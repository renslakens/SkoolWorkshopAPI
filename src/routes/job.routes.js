const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

//Add job
router.put("/", jobController.addJob);

//Delete job
router.delete("/:id", jobController.deleteJob);

//Update job
router.put("/:id", jobController.updateJob);

//Get all open jobs
router.get("/", jobController.getJobs);

router.post("/", jobController.addJob);

//Delete job
router.delete("/:id", jobController.deleteJob);

//Update job
router.put("/:id", jobController.updateJob);

router.get("/:id", jobController.getJob);
