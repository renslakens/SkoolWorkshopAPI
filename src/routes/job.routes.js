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
router.post("/moderate", jobController.addTeacherToJob);

//Accept job
router.put("/moderate:id", jobController.acceptJob);

//Deny job
router.delete("/moderate:id", jobController.deleteTeacherFromJob);

module.exports = router;
