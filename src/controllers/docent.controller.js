const assert = require("assert");
const pool = require("../../dbconnection");
const logger = require("../config/config").logger;
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const bcrypt = require("bcrypt");
const { rollback } = require("../../dbconnection");
const saltRounds = 10;

let controller = {
  validateDocent: (req, res, next) => {
    let user = req.body;
    let { naam, achternaam, emailadres, wachtwoord } = user;
    try {
      assert(typeof naam === "string", "The naam must be a string");
      assert(typeof achternaam === "string", "The achternaam must be a string");
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
    const docentId = req.params.id;
    try {
      assert(Number.isInteger(parseInt(docentId)), "ID must be a number");
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
    emailadres = req.body.emailadres;
    wachtwoord = req.body.wachtwoord;
    rol = req.body.rol;

    bcrypt.hash(wachtwoord, saltRounds, function (err, hash) {
      let sql = "INSERT INTO login (emailadres, wachtwoord, rol) VALUES ?";
      let values = [[emailadres, hash, rol]];

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

    let queryString = "SELECT * FROM `Docent`";

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
  getDocent: (req, res) => {
    const docentID = req.params.id;
    pool.query(
      "SELECT * FROM docent WHERE docentID = ?;",
      [docentID],
      function (error, result) {
        if (error) {
          res.status(400).json({
            status: 400,
            message: error,
          });
        }
        res.status(200).json({
          status: 200,
          result: { ...result },
          message: "De docent is opgehaald",
        });
      }
    );
  },
  getUserProfile: (req, res) => {
    const emailadres = req.params.emailadres;

    pool.query(
      "SELECT * FROM Docent WHERE loginEmail = ?",
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
};

module.exports = controller;
