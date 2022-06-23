const pool = require("../../dbconnection");
const logger = require("../config/config").logger;

let controller = {
  addTA: (req, res) => {
    let ta = req.body;

    pool.query(
      "INSERT INTO Doelgroep (doelgroep) VALUES (?);",
      [ta.doelgroep],
      function (error, result) {
        if (error) {
          logger.debug(error.sqlMessage);
          res.status(400).json({
            status: 400,
            message: "Oeps, er is iets fout gegaan " + error,
          });
        }
        res.status(201).json({
          status: 201,
          message: "Doelgroep is toegevoegd",
        });
      }
    );
  },
  deleteTA: (req, res) => {
    const taID = req.params.id;

    pool.query(
      "DELETE FROM Opdracht WHERE doelgroepID = ?;",
      [taID],
      function (error, result) {
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
            message: `Doelgroep met ID ${taID} is verwijderd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Deze doelgroep bestaat niet",
          });
        }
      }
    );
  },
  updateTA: (req, res) => {
    const taID = req.params.id;
    let ta = req.body;

    pool.query(
      "UPDATE Doelgroep SET doelgroep=? WHERE doelgroepID =?;",
      [ta.doelgroep, taID],
      function (error, result) {
        if (error) {
          res.status(400).json({
            status: 400,
            message: error,
          });
        }
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Doelgroep met ID ${taID} is gewijzigd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Deze doelgroep bestaat niet",
          });
        }
      }
    );
  },
  getTAS: (req, res) => {
    let queryString = "SELECT * FROM doelgroep;";
    pool.query(queryString, function (error, results, fields) {
      if (error) {
        res.status(400).json({
          status: 400,
          message: error,
        });
      }
      if (results.length > 0) {
        res.status(200).json({
          status: 200,
          result: results,
        });
      }
    });
  },

  getTA: (req, res) => {
    const taID = req.params.id;
    let queryString = "SELECT doelgroep WHERE doelgroepID =?;";
    pool.query(queryString, [taID], function (error, results, fields) {
      if (error) {
        res.status(400).json({
          status: 400,
          message: error,
        });
      }
      if (results.length > 0) {
        res.status(200).json({
          status: 200,
          result: results,
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Er is geen doelgroep met dit ID",
        });
      }
    });
  },
};

module.exports = controller;
