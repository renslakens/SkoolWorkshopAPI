const assert = require("assert");
const pool = require("../../dbconnection");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const logger = require("../config/config").logger;
const bcrypt = require("bcrypt");
const { count } = require("console");
const saltRounds = 10;

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

let controller = {
  login: (req, res, next) => {
    //Assert for validation
    const { emailadres } = req.body;
    logger.debug(emailadres, req.body.wachtwoord);

    const queryString =
      "SELECT emailadres, wachtwoord, rol, isAccepted FROM Login WHERE emailadres = ?";

    pool.query(queryString, [emailadres], function (error, results, fields) {
      // Handle error after the release.
      if (error) {
        logger.error("Error: ", error.toString());
        res.status(500).json({
          error: error.toString(),
          datetime: new Date().toISOString(),
        });
      }

      if (results && results.length === 1) {
        logger.debug(results[0].wachtwoord);
        // User found with this emailaddress
        // Check if password's correct
        bcrypt
          .compare(req.body.wachtwoord, results[0].wachtwoord)
          .then((match) => {
            if (match) {
              // Send JWT
              logger.info(
                "passwords matched, sending userinfo en valid token."
              );

              const { password, ...userinfo } = results[0];
              const payload = {
                emailadres: userinfo.emailadres,
              };

              logger.debug(payload);

              jwt.sign(
                payload,
                jwtSecretKey,
                { expiresIn: "25d" },
                function (err, token) {
                  if (err) throw err;
                  if (token) {
                    logger.info("User logged in, sending: ", userinfo);
                    res.status(200).json({
                      status: 200,
                      result: { ...userinfo, token },
                    });
                  }
                  logger.debug("Logged in");
                }
              );
            } else {
              logger.info("Password invalid");
              res.status(401).json({
                status: 401,
                message: "Wachtwoord ongeldig.",
                datetime: new Date().toISOString,
              });
            }
          });
      }
    });
  },
  validateLogin: (req, res, next) => {
    //Make sure you have the expected input
    logger.debug("Validate login called");
    let emailIsValid = emailRegex.test(req.body.emailadres);
    let passwordIsValid = passwordRegex.test(req.body.wachtwoord);

    try {
      assert(
        typeof req.body.emailadres === "string",
        "email must be a string."
      );
      assert(
        typeof req.body.wachtwoord === "string",
        "password must be a string."
      );
      logger.debug("Both email and password are strings");
      assert(
        emailIsValid,
        "Email is invalid. Make sure to have characters before and after the @ and that the domain length after the . is either 2 or 3"
      );
      assert(
        passwordIsValid,
        "Password is invalid. Make sure the password has at least a uppercase letter, one digit and is 8 characters long"
      );
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };
      next(error);
    }
  },
  validateToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn("Authorization header is missing!");
      res.status(401).json({
        status: 401,
        message: "Authorization header is missing!",
        datetime: new Date().toISOString,
      });
    } else {
      const token = authHeader.substring(7, authHeader.length);
      logger.debug(token);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        logger.debug(payload);
        if (err) {
          logger.warn(err.message);
          res.status(401).json({
            status: 401,
            message: "Not authorized",
            datetime: new Date().toISOString,
          });
        }
        if (payload.docentID) {
          logger.debug("token is valid", payload);
          //User has acces. Add userId from payload to
          //request, for every next endpoint
          logger.debug(payload.docentID);
          req.docentID = payload.docentID;
          next();
        }
        if (payload.medewerkerID) {
          logger.debug("token is valid", payload);
          //User has acces. Add userId from payload to
          //request, for every next endpoint
          logger.debug(payload.medewerkerID);
          req.medewerkerID = payload.medewerkerID;
          next();
        }
      });
    }
  },
  register: (req, res, next) => {
    const user = req.body;
    emailadres = req.body.emailadres;
    wachtwoord = req.body.wachtwoord;
    rol = req.body.rol;

    naam = req.body.naam;
    achternaam = req.body.achternaam;

    bcrypt.hash(wachtwoord, saltRounds, function (err, hash) {
      let sql =
        "INSERT INTO login (emailadres, wachtwoord, rol, isAccepted) VALUES ?";
      let sqlMedewerker =
        "INSERT INTO Medewerker (naam, achternaam, loginEmail) VALUES ?";
      let sqlDocent =
        "INSERT INTO Docent (naam, achternaam, geboortedatum, geboorteplaats, maxRijafstand, heeftRijbewijs, heeftAuto, straat, huisnummer, geslacht, nationaliteit, woonplaats, postcode, land, isFlexwerker, loginEmail) VALUES ?";
      let valuesLogin = [[emailadres, hash, rol, 0]];
      let valuesMedewerker = [[naam, achternaam, emailadres]];

      pool.query(sql, [valuesLogin], (dbError, result) => {
        if (dbError) {
          logger.debug(dbError.message);
          const error = {
            status: 409,
            message: "User has not been added to login",
            result: "User is niet toegevoegd in database",
          };
          next(error);
          return;
        }

        if (rol === "Docent") {
          geboortedatum = req.body.geboortedatum;
          geboorteplaats = req.body.geboorteplaats;
          maxRijafstand = req.body.maxRijafstand;
          heeftRijbewijs = req.body.heeftRijbewijs;
          heeftAuto = req.body.heeftAuto;
          straat = req.body.straat;
          huisnummer = req.body.huisnummer;
          geslacht = req.body.geslacht;
          nationaliteit = req.body.nationaliteit;
          woonplaats = req.body.woonplaats;
          postcode = req.body.postcode;
          land = req.body.land;
          isFlexwerker = req.body.isFlexwerker;
          //doelgroep = req.body.doelgroep;

          let valuesDocent = [
            [
              naam,
              achternaam,
              geboortedatum,
              geboorteplaats,
              maxRijafstand,
              heeftRijbewijs,
              heeftAuto,
              straat,
              huisnummer,
              geslacht,
              nationaliteit,
              woonplaats,
              postcode,
              land,
              isFlexwerker,
              emailadres,
            ],
          ];

          pool.query(sqlDocent, [valuesDocent], (dbError, result) => {
            if (dbError) {
              logger.debug(dbError.message);
              const error = {
                status: 409,
                message: "Teacher has not been added",
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
        } else {
          pool.query(sqlMedewerker, [valuesMedewerker], (dbError, result) => {
            if (dbError) {
              logger.debug(dbError.message);
              const error = {
                status: 409,
                message: "Employee has not been added",
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
        }
      });
    });
  },
  deleteUser: (req, res, next) => {
    const userEmail = req.params.emailadres;
    let user;
    logger.debug(`User with email ${userEmail} requested to be deleted`);

    pool.query(
      "DELETE FROM login WHERE emailadres = ?;",
      [userEmail],
      function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `User with email ${userEmail} succesfully deleted`,
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

  acceptUser: (req, res, next) => {
    const emailadres = req.params.emailadres;
    let user;
    logger.debug(`User with emailadres ${emailadres} requested to be updated`);

    pool.query(
      "UPDATE login SET isAccepted = ? WHERE emailadres = ?;",
      [1, emailadres],
      function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `User with emailadres ${emailadres} succesfully updated`,
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
  getAllUsers: (req, res, next) => {
    const { naam, isAccepted } = req.query;
    logger.debug(`name = ${naam} isAccepted = ${isAccepted}`);

    let queryString = "SELECT * FROM `Login`";

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
};

module.exports = controller;
