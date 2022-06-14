const express = require("express");
const router = express.Router();
const taController = require("../controllers/ta.controller");

//Add job
router.post("/", taController.addTA);

//Delete job
router.delete("/:id", taController.deleteTA);

//Update job
router.put("/:id", taController.updateTA);

//Get all open jobs
router.get("/", taController.getTAS);

//Teacher added to job
router.get("/:id", taController.getTA);

module.exports = router;