const assert = require("assert");
const pool = require("../../dbconnection");
const logger = require("../config/config").logger;
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const bcrypt = require("bcrypt");
const saltRounds = 10;

let controller = {
    validateUser: (req, res, next) => {
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
        const userId = req.params.id;
        try {
            assert(Number.isInteger(parseInt(userId)), "ID must be a number");
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

        bcrypt.hash(wachtwoord, saltRounds, function(err, hash) {
            let sql =
                "INSERT INTO docent (naam, achternaam, emailadres, wachtwoord) VALUES ?";
            let values = [
                [naam, achternaam, emailadres, hash]
            ];

            if (err) throw err;

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
    deleteUser: (req, res, next) => {
        const docentID = req.params.id;
        let user;
        logger.debug(`User with ID ${docentID} requested to be deleted`);

        pool.query(
            "DELETE FROM docent WHERE docentID = ?;", [docentID],
            function(error, results, fields) {
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
    acceptUser: (req, res, next) => {
        const docentID = req.params.id;
        let user;
        logger.debug(`User with ID ${docentID} requested to be updated`);

        pool.query(
            "UPDATE docent SET isAccepted = ? WHERE docentID = ?;", [1, docentID],
            function(error, results, fields) {
                if (error) throw error;

                if(results.affectedRows > 0){
                    res.status(200).json({
                    status: 200,
                    message: `User with ID ${docentID} succesfully updated`,
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: `User does not exist`,
                    });
                }
            }
        )
    },
};

module.exports = controller;