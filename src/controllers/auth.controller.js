const assert = require("assert");
const pool = require("../../dbconnection");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const logger = require("../config/config").logger;
const bcrypt = require("bcrypt");

const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

let controller = {
    login: (req, res, next) => {
        //Assert for validation
        const { emailadres } = req.body;
        logger.debug(emailadres, " ", req.body.wachtwoord);

        const queryString =
            "SELECT docentID, naam, achternaam, emailadres, wachtwoord FROM Docent WHERE emailadres = ?";

        pool.query(queryString, [emailadres], function(error, results, fields) {
            // Handle error after the release.
            if (error) {
                logger.error("Error: ", err.toString());
                res.status(500).json({
                    error: err.toString(),
                    datetime: new Date().toISOString(),
                });
            }

            if (results && results.length === 1) {
                logger.debug(results[0].wachtwoord);
                // User found with this emailaddress
                // Check if password's correct
                bcrypt.compare(
                        req.body.wachtwoord,
                        results[0].wachtwoord)
                    .then((match) => {
                        if (match) {
                            // Send JWT
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
                                jwtSecretKey, { expiresIn: "25d" },
                                function(err, token) {
                                    if (err) throw err;
                                    if (token) {
                                        logger.info("User logged in, sending: ", userinfo);
                                        res.status(200).json({
                                            status: 200,
                                            result: {...userinfo, token },
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
            } else {
                const queryString =
                    "SELECT medewerkerID, naam, achternaam, emailadres, wachtwoord FROM Medewerker WHERE emailadres = ?";
                pool.query(
                    queryString, [emailadres],
                    function(error, results, fields) {
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
                            bcrypt.compare(
                                req.body.wachtwoord,
                                results[0].wachtwoord,
                                function(err, res) {
                                    if (err) {
                                        logger.error(err);
                                        res.status(err.status).json(err);
                                    }
                                    if (res) {
                                        // Send JWT
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
                                            jwtSecretKey, { expiresIn: "25d" },
                                            function(err, token) {
                                                if (token) {
                                                    logger.info("User logged in, sending: ", userinfo);
                                                    res.status(200).json({
                                                        status: 200,
                                                        result: {...userinfo, token },
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        // response is OutgoingMessage object that server response http request
                                        logger.info("Password invalid");
                                        res.status(401).json({
                                            status: 401,
                                            message: "Wachtwoord ongeldig.",
                                            datetime: new Date().toISOString,
                                        });
                                    }
                                }
                            );
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
};

module.exports = controller;