const pool = require('../../dbconnection')
const logger = require('../config/config').logger

let controller = {
  addWorkshop: (req, res) => {
    let workshop = req.body

    pool.query(
      'INSERT INTO Workshop (naam, salarisindicatie, beschrijving) VALUES (?,?,?);',
      [
        workshop.naam,
        workshop.startTijd,
        workshop.eindTijd,
        workshop.beschrjiving,
      ],
      function (error, result) {
        if (error) {
          logger.debug(error.sqlMessage)
          res.status(400).json({
            status: 400,
            message: 'Oeps, er is iets fout gegaan ' + error,
          })
        }
        res.status(201).json({
          status: 201,
          message: 'Workshop is toegevoegd',
        })
      },
    )
  },
  deleteWorkshop: (req, res) => {
    const workshopID = req.params.id

    pool.query(
      'DELETE FROM Workshop WHERE workshopID = ?;',
      [workshopID],
      function (error, result) {
        if (error) {
          logger.debug(error.sqlMessage)
          res.statur(400).json({
            status: 400,
            message: error,
          })
        }
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Workshop met ID ${workshopID} is verwijderd`,
          })
        } else {
          res.status(400).json({
            status: 400,
            message: 'De workshop bestaat niet',
          })
        }
      },
    )
  },
  updateWorkshop: (req, res) => {
    const workshopID = req.params.id

    pool.query(
      'UPDATE Workshop SET naam=?, startTijd=?, eindTijd=?, beschrijving=? WHERE workshopID =?;',
      [
        workshop.naam,
        workshop.startTijd,
        workshop.eindTijd,
        workshop.beschrijving,
        workshopID,
      ],
      function (error, result) {
        if (error) {
          res.status(400).json({
            status: 400,
            message: error,
          })
        }
        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Workshop met ID ${workshopID} is gewijzigd`,
          })
        } else {
          res.status(400).json({
            status: 400,
            message: 'De workshop bestaat niet',
          })
        }
      },
    )
  },
  getAllWorkshops: (req, res) => {
    pool.query('SELECT * FROM Workshop;', function (error, result) {
      if (error) {
        res.status(400).json({
          status: 400,
          message: error,
        })
      }
      res.status(200).json({
        status: 200,
        result: result,
        message: 'Alle workshops zijn opgehaald',
      })
    })
  },
}

module.exports = controller
