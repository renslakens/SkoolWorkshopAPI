const assert = require("assert");
const pool = require("../../dbconnection");
const logger = require("../config/config").logger;
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const bcrypt = require("bcrypt");
const saltRounds = 10;

let controller = {
  validateCustomer: (req, res, next) => {
    let user = req.body;
    let {
      naam,
      achternaam,
      postcode,
      telefoonnummer,
      straat,
      huisnummer,
      plaats,
      klantType,
      land,
      naamContactpersoon,
    } = user;
    try {
      assert(typeof naam === "string", "The naam must be a string");
      assert(typeof achternaam === "string", "The achternaam must be a string");
      if (postcode != undefined) {
        assert(typeof postcode === 'string', 'The postalCode must be a string');

    }
      if (telefoonnummer != undefined) {
          assert(typeof telefoonnummer === 'string', 'The phoneNumber must be a string');
          assert(
            telefoonnummer.match(
                  /(06)(\s|\-|)\d{8}|31(\s6|\-6|6)\d{8}/
              ),
              'invalid phoneNumber'
          )
      }
      if (straat != undefined) {
        assert(typeof straat === 'string', 'The straat must be a string');

    }
    if (huisnummer != undefined) {
        assert(typeof huisnummer === 'string', 'The huisnummer must be a string');

    }
    if (plaats != undefined) {
        assert(typeof plaats === 'string', 'The plaats must be a string');

    
    }
    if (klantType != undefined) {
        assert(typeof klantType === 'string', 'The klantType must be a string');

    }
    if (land != undefined) {
        assert(typeof land === 'string', 'The land must be a string');

    }
    if (naamContactpersoon != undefined) {
        assert(typeof naamContactpersoon === 'string', 'The naamContactpersoon must be a string');

    }

      next();
    } catch (err) {
      logger.debug(err.message);
      const error = {
        status: 400,
        message: err.message,
      };
      next(error);
    }
  },
  validateId: (req, res, next) => {
    const userId = req.params.id;
    try {
      assert(Number.isInteger(parseInt(userId)), "ID must be a number");
      logger.debug("ValidateID is done");
      next();
    } catch (err) {
      logger.debug(req.body);
      const error = {
        status: 400,
        message: err.message,
      };
      logger.debug(error);
      next(error);
    }
  },

  addCustomer: (req, res, next) => {
    const customer = req.body;

    pool.query(
      "INSERT INTO Klant (naam, achternaam, postcode, telefoonnummer, straat, huisnummer, plaats, klantType, land, naamContactpersoon) VALUES ?",
      [
        customer.naam,
        customer.postcode,
        customer.telefoonnummer,
        customer.straat,
        customer.huisnummer,
        customer.plaats,
        customer.klantType,
        customer.land,
        customer.naamContactpersoon,
      ],
      (dbError, result) => {
        if (dbError) {
          logger.debug(dbError.message);
          const error = {
            status: 409,
            message: "Customer has not been added",
            result: "Klant is niet toegevoegd in database",
          };
          next(error);
        } else {
          logger.debug("InsertId is: ", result.insertId);
          res.status(201).json({
            status: 201,
            message: "Klant is toegevoegd in database",
            result: { id: result.insertId, ...customer },
          });
        }
      }
    );
  },
  getAllCustomers: (req, res, next) => {
    const { naam, achternaam } = req.query;
    logger.debug(`name = ${naam} achternaam = ${achternaam}`);

    let queryString = "SELECT * FROM `Klant`";

    if (naam || achternaam) {
      queryString += " WHERE ";
      if (naam) {
        queryString += `naam LIKE '%${naam}%'`;
      }
      if (naam && achternaam) {
        queryString += " AND ";
      }
      if (achternaam) {
        queryString += `achternaam LIKE'${achternaam}'`;
      }
    }
    logger.debug(queryString);

    pool.query(queryString, function (error, results, fields) {
      // Handle error after the release.
      if (error) {
        next(error);
      }

      // logger.debug("#results =", results.length);
      res.status(200).json({
        status: 200,
        result: results,
      });
    });
  },
  deleteCustomer: (req, res, next) => {
    const customerID = req.params.id;
    let customer;
    logger.debug(`Customer with ID ${customerID} requested to be deleted`);

    pool.query(
      "DELETE FROM Klant WHERE KlantID = ?;",
      [customerID],
      function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Customer with ID ${customerID} succesfully deleted`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Customer does not exist`,
          });
        }
      }
    );
  },

  updateCustomer: (req, res, next) => {
    const customerID = req.params.id;
    const customer = req.body;
    logger.debug(`customer with ID ${customerID} requested to be updated`);

    pool.query(
      "Update Klant SET (naam, achternaam, postcode, telefoonnummer, straat, huisnummer, plaats, klantType, land, naamContactpersoon) WHERE KlantID = ?;",
      [
        customer.naam,
        customer.postcode,
        customer.telefoonnummer,
        customer.straat,
        customer.huisnummer,
        customer.plaats,
        customer.klantType,
        customer.land,
        customer.naamContactpersoon,
        customerID
      ],
      function (error, results, fields) {
        if (error) {
          res.status(401).json({
            status: 401,
            message: `Update failed`,
          });
          return;
        }
        if (results.affectedRows > 0) {
          connection.query(
            "SELECT * FROM Klant WHERE id = ?;",
            [customerID],
            function (error, results, fields) {
              res.status(200).json({
                status: 200,
                result: results[0],
              });
            }
          );
        } else {
          res.status(400).json({
            status: 400,
            message: `Update failed, customer with ID ${customerID} does not exist`,
          });
        }
      }
    );
  },
};

module.exports = controller;
