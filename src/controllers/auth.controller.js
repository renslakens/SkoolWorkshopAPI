const assert = require("assert");
const dbconnection = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const logger = require("../config/config").logger;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

let controller = {
  login: (req, res, next) => {
    //Assert for validation
    const { emailadres } = req.body;
    logger.debug(emailadres, " ", req.body.wachtwoord);

    const queryString =
      "SELECT docentID, naam, achternaam, emailadres, wachtwoord FROM Docent WHERE emailadres = ?";

    dbconnection.getConnection(function (err, connection) {
      if (err) {
        logger.error("Error getting connection from dbconnection");
        res.status(500).json({
          error: err.toString(),
          datetime: new Date().toISOString,
        });
      } // not connected!

      // Use the connection
      connection.query(
        queryString,
        [emailadres],
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) {
            logger.error("Error: ", err.toString());
            res.status(500).json({
              error: err.toString(),
              datetime: new Date().toISOString(),
            });
          }

          if (results && results.length === 1) {
            // User found with this emailAddress
            // Check if password's correct
            if (results[0].wachtwoord === req.body.wachtwoord) {
              //email and password are correct
              logger.info(
                "passwords matched, sending userinfo en valid token."
              );

              const { password, ...userinfo } = results[0];
              const payload = {
                docentID: userinfo.docentID,
              };

              logger.debug(payload);

              jwt.sign(
                payload,
                jwtSecretKey,
                { expiresIn: "25d" },
                function (err, token) {
                  if (token) {
                    logger.info("User logged in, sending: ", userinfo);
                    res.status(200).json({
                      status: 200,
                      result: { ...userinfo, token },
                    });
                  }
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
          } else {
            const queryString =
              "SELECT medewerkerID, naam, achternaam, emailadres, wachtwoord FROM Medewerker WHERE emailadres = ?";
            connection.query(
              queryString,
              [emailadres],
              function (error, results, fields) {
                connection.release();

                if (error) {
                  logger.error("Error: ", err.toString());
                  res.status(500).json({
                    error: err.toString(),
                    datetime: new Date().toISOString(),
                  });
                }
                if (results && results.length === 1) {
                  // User found with this emailAddress
                  // Check if password's correct
                  if (results[0].wachtwoord === req.body.wachtwoord) {
                    //email and password are correct
                    logger.info(
                      "passwords matched, sending userinfo en valid token."
                    );

                    const { password, ...userinfo } = results[0];
                    const payload = {
                      medewerkerID: userinfo.medewerkerID,
                    };

                    logger.debug(payload);

                    jwt.sign(
                      payload,
                      jwtSecretKey,
                      { expiresIn: "25d" },
                      function (err, token) {
                        if (token) {
                          logger.info("User logged in, sending: ", userinfo);
                          res.status(200).json({
                            status: 200,
                            result: { ...userinfo, token },
                          });
                        }
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
                } else {
                  logger.info("User not found");
                  res.status(404).json({
                    status: 404,
                    message: `Gebruiker met emailadres ${emailadres} niet gevonden.`,
                    datetime: new Date().toISOString,
                  });
                }
              }
            );
          }
        }
      );
    });
  },
  validateLogin: (req, res, next) => {
    //Make sure you have the expected input
    logger.debug("validate login called");
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
};

module.exports = controller;
