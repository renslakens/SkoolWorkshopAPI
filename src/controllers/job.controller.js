const pool = require("../../dbconnection");
const logger = require("../config/config").logger;

let controller = {
  addJob: (req, res) => {
    let job = req.body;
    let startTijd = new Date(job.startTijd)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    let eindTijd = new Date(job.eindTijd)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    pool.query(
      "INSERT INTO Opdracht (aantalDocenten, startTijd, eindTijd, locatieID, workshopID, klantID, doelgroepID) VALUES (?);",
      [job.aantalDocenten, startTijd, eindTijd],
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
          message: "Opdracht is toegevoegd",
        });
      }
    );
  },
  deleteJob: (req, res) => {
    const jobID = req.params.id;

    pool.query(
      "DELETE FROM Opdracht WHERE jobID = ?;",
      [jobID],
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
            message: `Opdracht met ID ${jobID} is verwijderd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Deze opdracht bestaat niet",
          });
        }
      }
    );
  },
  updateJob: (req, res) => {
    const jobID = req.params.id;
    let job = req.body;
    let startTijd = new Date(job.startTijd)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    let eindTijd = new Date(job.eindTijd)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    pool.query(
      "UPDATE Opdracht SET aantalDocenten=?, startTijd=?, eindTijd=? WHERE jobID =?;",
      [job.aantalDocenten, startTijd, eindTijd, jobID],
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
            message: `Opdracht met ID ${jobID} is gewijzigd`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Deze opdracht bestaat niet",
          });
        }
      }
    );
  },
  getJobs: (req, res) => {
    let queryString =
      "SELECT W.naam, O.startTijd, O.eindTijd, L.naam FROM workshop W, Opdracht O, locatie L WHERE O.workshopID IN (SELECT O.workshopID FROM docentinopdracht DIO WHERE DIO.opdrachtID = O.opdrachtID AND DIO.isBevestigd = TRUE HAVING COUNT(DIO.opdrachtID) < O.aantalDocenten );";
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
  acceptJob: (req, res) => {
    let docentID = req.params.id;
    pool.query(
      "UPDATE DocentInOpdracht SET isBevestigd = ? WHERE docentID = ?",
      [1, docentID],
      function (error, result) {
        if (error) throw error;

        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: `Docent is toegewezen aan de workshop`,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Docent bestaat niet`,
          });
        }
      }
    );
  },
  addTeacherToJob: (req, res) => {
    const docentOpdracht = req.body;

    pool.query(
      "INSERT INTO DocentInOpdracht (docentID, opdrachtID) VALUES (?,?);",
      [docentOpdracht.docentID, docentOpdracht.opdrachtID],
      function (error, result) {
        if (error) throw error;

        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: "Docent is toegevoegd aan de opdracht",
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Docent bestaat niet`,
          });
        }
      }
    );
  },
  deleteTeacherFromJob: (req, res) => {
    const docentID = req.params.id;

    pool.query(
      "DELETE FROM DocentInOpdracht WHERE docentID = ?",
      [docentID],
      function (error, result) {
        if (error) throw error;

        if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: "Docent is van de opdracht verwijderd.",
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `Docent bestaat niet`,
          });
        }
      }
    );
  },
  getJob: (req, res) => {
    const jobID = req.params.id;
    let queryString =
      "SELECT W.naam, O.startTijd, O.eindTijd, L.naam FROM workshop W, Opdracht O, locatie L WHERE opdrachtID =?";
    pool.query(queryString, [jobID], function (error, results, fields) {
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
          message: "Er zijn geen openstaande opdrachten",
        });
      }
    });
  },
};

module.exports = controller;
