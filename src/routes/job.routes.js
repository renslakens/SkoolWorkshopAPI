const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

module.exports = router;

//Get all open jobs
router.get('/', jobController.getJobs);