const pool = require("../../dbconnection");
const logger = require("../config/config").logger;

let controller = {
  addLocation: (req, res) => {
    const location = req.body;

    pool.query(
      "INSERT INTO Locatie (naam, land, postcode, straat, huisnummer, plaats) VALUES (?,?,?,?,?,?)",
      [
        location.naam,
        location.land,
        location.postcode,
        location.straat,
        location.huisnummer,
        location.plaats,
      ],
      function (error, result) {
        if (error) throw error;

        res.status(201).json({
          status: 201,
          message: "Locatie is toegevoegd",
        });
      }
    );
  },
  getLocations: (req, res) => {
    pool.query("SELECT * FROM Locatie", function (error, result) {
      if (error) throw error;

      res.status(200).json({
        status: 200,
        result: result,
      });
    });
  },
  getLocation: (req, res) => {
    let locationID = req.params.id;

    pool.query(
      "SELECT * FROM Locatie WHERE locatieID =?",
      [locationID],
      function (error, result) {
        if (error) throw error;

        if (result.length > 0) {
          res.status(200).json({
            status: 200,
            result: result,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Location with id ${id} not found`,
          });
        }
      }
    );
  },
  updateLocation: (req, res) => {
    let location = req.body;
    let locationID = req.params.id;

    pool.query(
      "UPDATE Locatie SET naam=?, land=?, postcode=?, straat=?, huisnummer=?, plaats=? WHERE locatieID=?",
      [
        location.naam,
        location.land,
        location.postcode,
        location.straat,
        location.huisnummer,
        location.plaats,
        locationID,
      ],
      function (error, result) {
        if (error) throw error;

        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Locatie met ID ${locationID} is gewijzigd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Location with id ${location} not found`,
          });
        }
      }
    );
  },
  deleteLocation: (req, res) => {
    let locationID = req.params.id;

    pool.query(
      "DELETE FROM Locatie WHERE locatieID =?",
      [locationID],
      function (error, result) {
        if (error) throw error;

        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Locatie met ID ${locationID} is verwijderd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Location with id ${locationID} not found`,
          });
        }
      }
    );
  },
};
module.exports = controller;
