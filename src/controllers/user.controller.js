const assert = require('assert');
const pool = require('../../dbconnection');
const logger = require('../config/config').logger;
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../config/config').jwtSecretKey

let controller = {
    validateUser: (req, res, next) => {
        let user = req.body;
        let { firstName, lastName, emailAddress, password, nationality, sex, birhtDate, birthCity, birthCountry, phoneNumber, street, postalCode, city, country } = user;
        try {
            assert(typeof firstName === 'string', 'The firstname must be a string');
            assert(typeof lastName === 'string', 'The lastName must be a string');
            assert(typeof emailAddress === 'string', 'The emailAddress must be a string');
            assert(typeof password === 'string', 'The password must a string');
            assert(typeof nationality === 'string', 'The nationality must be a string');
            assert(typeof sex === 'string', 'The sex must be a string');
            assert(typeof birhtDate === 'string', 'The birthDate must be a string');
            assert(typeof birthCity === 'string', 'The birthCity must be a string');
            assert(typeof birthCountry === 'string', 'The birthCountry must be a string')
            assert(typeof street === 'string', 'The street must be a string');
            assert(typeof postalCode === 'string', 'The postalCode must be a string');
            assert(typeof city === 'string', 'The city must be a string');
            assert(typeof country === 'string', 'The country must be a string');

            assert(emailAdress.match(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), 'emailAdress is invalid');
            //8 karakters, 1 letter, 1 nummer en 1 speciaal teken
            assert(password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/), 'password is invalid');

            if (phoneNumber != undefined) {
                assert(typeof phoneNumber === 'string', 'The phoneNumber must be a string');
                assert(
                    phoneNumber.match(
                        /(06)(\s|\-|)\d{8}|31(\s6|\-6|6)\d{8}/
                    ),
                    'invalid phoneNumber'
                )
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
            assert(Number.isInteger(parseInt(userId)), 'ID must be a number');
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
        pool.query('INSERT INTO user SET ?', user, (dbError, result) => {
            if (dbError) {
                logger.debug(dbError.message);
                const error = {
                    status: 409,
                    message: 'User has not been added',
                    result: 'User is niet toegevoegd in database',
                };
                next(error);
            } else {
                logger.debug('InsertId is: ', result.insertId);
                user.userId = result.insertId;
                res.status(201).json({
                    status: 201,
                    message: 'User is toegevoegd in database',
                    result: { id: result.insertId, ...user },
                });
            }
        });
    },
};

module.exports = controller;