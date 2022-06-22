const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

//Add job
router.post("/", jobController.addJob);

//Delete job
router.delete("/:id", jobController.deleteJob);

//Update job
router.put("/:id", jobController.updateJob);

//Get all open jobs
router.get("/", jobController.getJobs);

//Get one job
router.get("/:id", jobController.getJob);

//Teacher added to job
router.post("/moderate/", jobController.addTeacherToJob);

// //Apply to job
// router.put("/apply/:emailadres", jobController.applyJob);

//Accept job
router.put("/moderate/:emailadres", jobController.acceptJob);

//Deny job
router.delete("/moderate/:emailadres", jobController.deleteTeacherFromJob);

module.exports = router;