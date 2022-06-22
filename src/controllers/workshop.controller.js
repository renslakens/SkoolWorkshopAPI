const pool = require("../../dbconnection");
const logger = require("../config/config").logger;

let controller = {
    addWorkshop: (req, res) => {
        const workshop = req.body;

        pool.query(
            "INSERT INTO Workshop (naam, beschrijving) VALUES (?,?);", [workshop.naam, workshop.beschrijving],
            (dbError, result) => {
                if (dbError) {
                    logger.debug(dbError.message);
                    const error = {
                        status: 409,
                        message: "Workshop has not been added",
                        result: "Workshop is niet toegevoegd in database",
                    };
                    next(error);
                } else {
                    logger.debug("InsertId is: ", result.insertId);
                    res.status(201).json({
                        status: 201,
                        message: "Workshop is toegevoegd in database",
                        result: { id: result.insertId, ...workshop },
                    });
                }
            }
        );
    },
    deleteWorkshop: (req, res) => {
        const workshopID = req.params.id;

        pool.query(
            "DELETE FROM Workshop WHERE workshopID = ?;", [workshopID],
            function(error, result) {
                if (error) {
                    logger.debug(error.sqlMessage);
                    res.statur(400).json({
                        status: 400,
                        message: error,
                    });
                }
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 200,
                        message: `Workshop met ID ${workshopID} is verwijderd`,
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "De workshop bestaat niet",
                    });
                }
            }
        );
    },
    updateWorkshop: (req, res) => {
        const workshopID = req.params.id;

        pool.query(
            "UPDATE Workshop SET naam=?, startTijd=?, eindTijd=?, beschrijving=? WHERE workshopID =?;", [
                workshop.naam,
                workshop.startTijd,
                workshop.eindTijd,
                workshop.beschrijving,
                workshopID,
            ],
            function(error, result) {
                if (error) {
                    res.status(400).json({
                        status: 400,
                        message: error,
                    });
                }
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 200,
                        message: `Workshop met ID ${workshopID} is gewijzigd`,
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "De workshop bestaat niet",
                    });
                }
            }
        );
    },
    getAllWorkshops: (req, res) => {
        pool.query("SELECT * FROM Workshop;", function(error, result) {
            if (error) {
                res.status(400).json({
                    status: 400,
                    message: error,
                });
            }
            res.status(200).json({
                status: 200,
                result: result,
                message: "Alle workshops zijn opgehaald",
            });
        });
    },

    getWorkshop: (req, res) => {
        const docentID = req.params.id;
        pool.query(
            "SELECT * FROM Workshop WHERE workshopID = ?;", [docentID],
            function(error, result) {
                if (error) {
                    res.status(400).json({
                        status: 400,
                        message: error,
                    });
                }
                res.status(200).json({
                    status: 200,
                    result: {...result },
                    message: "De workshop is opgehaald",
                });
            }
        );
    },
};

module.exports = controller;