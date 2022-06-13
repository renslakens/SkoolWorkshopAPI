const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const docentController = require("../controllers/docent.controller");
const aunthController = require("../controllers/auth.controller");

//Add user
router.post("/", employeeController.validateUser, employeeController.addUser);

//Get all users
router.get("/", employeeController.getAllUsers);

// //Get route for profile
//router.get('/profile', authController.validateToken, employeeController.getUserProfile);

// //Get routes for specific users
// router.get('/:id', authController.validateToken, employeeController.validateId, employeeController.getUserById);

// //Put routes for specific users
// router.put('/:id', authController.validateToken, employeeController.validateId, employeeController.validateUser, employeeController.updateUser);

// Put route for accepting a new docent
router.put(
    "/:id",
    //aunthController.validateToken,
    employeeController.acceptUser
);

// //Delete routes for specific users
// router.delete('/:id', authController.validateToken, employeeController.validateId, employeeController.deleteUser);
router.delete(
    "/:id",
    // aunthController.validateToken,
    employeeController.deleteUser
);

module.exports = router;