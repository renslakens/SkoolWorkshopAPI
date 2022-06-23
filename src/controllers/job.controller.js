const { query } = require("../../dbconnection");
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

    let valuesJob = [
      [
        job.aantalDocenten,
        startTijd,
        eindTijd,
        job.locatieID,
        job.workshopID,
        job.klantID,
        job.doelgroepID,
      ],
    ];

    pool.query(
      "INSERT INTO Opdracht (aantalDocenten, startTijd, eindTijd, locatieID, workshopID, klantID, doelgroepID) VALUES ?;",
      [valuesJob],
      function (error, result) {
        if (error) {
          logger.debug(error.sqlMessage);
          res.status(400).json({
            status: 400,
            message: "Oeps, er is iets fout gegaan " + error,
          });
        } else {
          res.status(201).json({
            status: 201,
            message: "Opdracht is toegevoegd",
          });
        }
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
    const loginEmail = req.params.emailadres;
    let queryjobview =
      "CREATE VIEW jobslist AS SELECT O.opdrachtID, W.workshopnaam, W.beschrijving, O.aantalDocenten, O.startTijd, O.eindTijd, L.naam, L.land, L.postcode, L.straat, L.huisnummer, L.plaats, O.locatieID, O.workshopID, O.klantID, O.doelgroepID FROM workshop W, Opdracht O, locatie L WHERE O.workshopID IN (SELECT O.workshopID FROM docentinopdracht DIO WHERE DIO.opdrachtID = O.opdrachtID AND DIO.isBevestigd = TRUE HAVING COUNT(DIO.opdrachtID) < O.aantalDocenten);";
    let queryjobviewdrop = "DROP VIEW IF EXISTS jobslist;";
    let queryString =
      "SELECT * FROM jobslist WHERE opdrachtID != ANY(SELECT opdrachtID FROM docentinopdracht WHERE loginEmail = ?);";
    function deleteview() {
      pool.query(queryjobviewdrop);
    }
    deleteview;
    function createview() {
      pool.query(queryjobview);
    }
    createview;
    pool.query(queryString, [loginEmail], function (error, results, fields) {
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
        res.status(200).json({
          status: 200,
          message: "Geen openstaande opdrachten",
        });
      }
      deleteview;
    });
  },
  acceptJob: (req, res, next) => {
    //let emailadres = req.params.emailadres
    const { loginEmail, opdrachtID } = req.query;

    let queryString = "UPDATE DocentInOpdracht SET isBevestigd = 1";

    if (loginEmail || opdrachtID) {
      queryString += " WHERE ";
      if (loginEmail) {
        queryString += `loginEmail = '${loginEmail}'`;
      }
      if (loginEmail && opdrachtID) {
        queryString += " AND ";
      }
      if (opdrachtID) {
        queryString += `opdrachtID='${opdrachtID}'`;
      }
    }
    logger.debug(queryString);

    pool.query(queryString, function (error, results) {
      if (error) {
        next(error);
      }

      // logger.debug("#results =", results.length);
      res.status(200).json({
        status: 200,
        message: "Docent is toegevoegd aan workshop",
      });
    });
  },

  getWorkshops: (req, res, next) => {
    const { loginEmail, isBevestigd } = req.query;
    logger.debug(`loginEmail = ${loginEmail} isBevestigd = ${isBevestigd}`);

    let queryString =
      "SELECT O.opdrachtID, W.workshopnaam, W.beschrijving, O.aantalDocenten, O.startTijd, O.eindTijd, L.naam, L.land, L.postcode, L.straat, L.huisnummer, L.plaats, O.locatieID, O.workshopID, O.klantID, O.doelgroepID, DIO.loginEmail, DIO.isBevestigd FROM workshop W, Opdracht O, locatie L, DocentInOpdracht DIO";

    if (loginEmail || isBevestigd) {
      queryString += " WHERE ";
      if (loginEmail) {
        queryString += `loginEmail = '${loginEmail}'`;
      }
      if (loginEmail && isBevestigd) {
        queryString += " AND ";
      }
      if (isBevestigd) {
        queryString += `isBevestigd='${isBevestigd}'`;
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

  addTeacherToJob: (req, res) => {
    const teacherJob = req.body;

    pool.query(
      "INSERT INTO DocentInOpdracht (loginEmail, opdrachtID) VALUES (?,?);",
      [teacherJob.emailadres, teacherJob.id],
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
  getJob: (req, res, next) => {
    const jobID = req.params.id;
    logger.debug(`Job with ID ${jobID} is requested`);
    let queryString =
      "SELECT W.workshopnaam, O.startTijd, O.eindTijd, L.naam FROM Workshop W, Opdracht O, Locatie L WHERE opdrachtID =?";
    pool.query(queryString, [jobID], function (error, results, fields) {
      // if (error) {
      //     res.status(400).json({
      //         status: 400,
      //         message: error,
      //     })
      // }
      // if (results.length > 0) {
      //     res.status(200).json({
      //         status: 200,
      //         result: results,
      //     })
      // } else {
      //     res.status(400).json({
      //         status: 400,
      //         message: 'Er zijn geen openstaande opdrachten',
      //     })
      // }

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
