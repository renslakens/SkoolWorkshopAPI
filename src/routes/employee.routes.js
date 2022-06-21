const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const docentController = require("../controllers/docent.controller");
const authController = require("../controllers/auth.controller");

//Add user
router.post("/", employeeController.validateUser, employeeController.addUser);

//Get all users
router.get("/", employeeController.getAllUsers);

//Get route for profile
router.get("/profile/:emailadres", employeeController.getUserProfile);

module.exports = router;
