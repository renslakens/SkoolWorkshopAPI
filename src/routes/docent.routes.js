const express = require("express");
const router = express.Router();
const docentController = require("../controllers/docent.controller");
const authController = require("../controllers/auth.controller");

//Add user
router.post("/", docentController.validateDocent, docentController.addUser);

//Get all users
router.get("/", docentController.getAllUsers);

//Get routes for specific users
router.get("/:id", docentController.validateId, docentController.getDocent);

// Put route for accepting a new docent
router.put("/:id", docentController.validateId, docentController.updateDocent);

module.exports = router;
