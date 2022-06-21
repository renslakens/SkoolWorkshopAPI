const assert = require("assert");
const pool = require("../../dbconnection");
const logger = require("../config/config").logger;
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const bcrypt = require("bcrypt");
const { rollback } = require("../../dbconnection");
const saltRounds = 10;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let { naam, achternaam, emailadres, wachtwoord } = user;
    try {
      //assert(typeof naam === "string", "The naam must be a string");
      //assert(typeof achternaam === "string", "The achternaam must be a string");
      assert(typeof emailadres === "string", "The emailadres must be a string");
      assert(typeof wachtwoord === "string", "The wachtwoord must a string");
      // assert(typeof nationality === 'string', 'The nationality must be a string');
      // assert(typeof sex === 'string', 'The sex must be a string');
      // assert(typeof birhtDate === 'string', 'The birthDate must be a string');
      // assert(typeof birthCity === 'string', 'The birthCity must be a string');
      // assert(typeof birthCountry === 'string', 'The birthCountry must be a string')
      // assert(typeof street === 'string', 'The street must be a string');
      // assert(typeof postalCode === 'string', 'The postalCode must be a string');
      // assert(typeof city === 'string', 'The city must be a string');
      // assert(typeof country === 'string', 'The country must be a string');

      assert(
        emailadres.match(
          /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        "emailadres is invalid"
      );
      //8 karakters, 1 letter, 1 nummer en 1 speciaal teken
      assert(
        wachtwoord.match(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        ),
        "wachtwoord is invalid"
      );

      // if (phoneNumber != undefined) {
      //     assert(typeof phoneNumber === 'string', 'The phoneNumber must be a string');
      //     assert(
      //         phoneNumber.match(
      //             /(06)(\s|\-|)\d{8}|31(\s6|\-6|6)\d{8}/
      //         ),
      //         'invalid phoneNumber'
      //     )
      // }

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
  addUser: (req, res, next) => {
    const user = req.body;
    naam = req.body.naam;
    achternaam = req.body.achternaam;
    emailadres = req.body.emailadres;
    wachtwoord = req.body.wachtwoord;
    rol = req.body.rol;

    bcrypt.hash(wachtwoord, saltRounds, function (err, hash) {
      let sql = "INSERT INTO login (emailadres, wachtwoord, rol) VALUES ?";
      let values = [[emailadres, hash, rol]];

      if (err) {
        logger.error("Could not encrypt password");
        return next({ status: 500, message: "Could not encrypt password" });
      }

      pool.query(sql, [values], (dbError, result) => {
        if (dbError) {
          logger.debug(dbError.message);
          const error = {
            status: 409,
            message: "User has not been added",
            result: "User is niet toegevoegd in database",
          };
          next(error);
        } else {
          logger.debug("InsertId is: ", result.insertId);
          res.status(201).json({
            status: 201,
            message: "User is toegevoegd in database",
            result: { id: result.insertId, ...user },
          });
        }
      });
    });
  },
  getAllUsers: (req, res, next) => {
    const { naam, isAccepted } = req.query;
    logger.debug(`name = ${naam} isAccepted = ${isAccepted}`);

    let queryString = "SELECT * FROM `medewerker`";

    if (naam || isAccepted) {
      queryString += " WHERE ";
      if (naam) {
        queryString += `naam LIKE '%${naam}%'`;
      }
      if (naam && isAccepted) {
        queryString += " AND ";
      }
      if (isAccepted) {
        queryString += `isAccepted='${isAccepted}'`;
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
  getUserProfile: (req, res) => {
    const emailadres = req.params.emailadres;
    logger.debug("yeehaw", emailadres);
    pool.query(
      "SELECT * FROM Medewerker WHERE loginEmail = ?",
      [emailadres],
      function (error, results, fields) {
        if (error) throw error;

        logger.debug("#results =", results.length);
        if (results.length > 0) {
          res.status(200).json({
            status: 200,
            result: results,
          });
        } else {
          res.status(404).json({
            status: 404,
            message: `Could not find user with email: ${emailadres}`,
          });
        }
      }
    );
  },
  deleteUser: (req, res, next) => {
    const medewerkerID = req.params.id;
    let user;
    logger.debug(`User with ID ${medewerkerID} requested to be deleted`);

    pool.query(
      //TO DO --- also delete from login
      "DELETE FROM docent WHERE medewerkerID = ?;",
      [medewerkerID],
      function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `User with ID ${docentID} succesfully deleted`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `User does not exist`,
          });
        }
      }
    );
  },
  updateUser: (req, res, next) => {
    const medewerkerID = req.params.id;
    const updateUser = req.body;
    logger.debug(`User with ID ${medewerkerID} requested to be updated`);

    pool.query(
      "Update docent SET naam = ?, achternaam = ?, emaildres = ?, geboortedatum = ?, geboorteplaats = ?, maxRijafstand = ?, heeftRijbewijs = ?, heeftAuto = ?, straat = ?, huisnummer = ?, geslacht = ?, nationaliteit = ?, woonplaats = ?, postcode = ?, land = ? WHERE docentID = ?;",
      [
        updateUser.naam,
        updateUser.achternaam,
        updateUser.emailadres,
        updateUser.geboortedatum,
        updateUser.geboorteplaats,
        updateUser.maxRijafstand,
        updateUser.heeftRijbewijs,
        updateUser.heeftAuto,
        updateUser.straat,
        updateUser.huisnummer,
        updateUser.geslacht,
        updateUser.nationaliteit,
        updateUser.woonplaats,
        updateUser.postcode,
        updateUser.land,
        medewerkerID,
      ],
      function (error, results, fields) {
        if (error) {
          res.status(401).json({
            status: 401,
            message: `Update failed, provided email already taken`,
          });
          return;
        }
        if (results.affectedRows > 0) {
          connection.query(
            "SELECT * FROM user WHERE id = ?;",
            [medewerkerID],
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
            message: `Update failed, user with ID ${medewerkerID} does not exist`,
          });
        }
      }
    );
  },
};

module.exports = controller;
