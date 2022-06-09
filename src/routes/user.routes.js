const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

//Add user
router.post("/", userController.validateUser, userController.addUser);

//Get all users
router.get('/', userController.getAllUsers);

// //Get all accepted profiles
router.get('/profile', userController.getAllAcceptedUsers);

// //Get route for profile
//router.get('/profile', authController.validateToken, userController.getUserProfile);

// //Get routes for specific users
// router.get('/:id', authController.validateToken, userController.validateId, userController.getUserById);

// //Put routes for specific users
// router.put('/:id', authController.validateToken, userController.validateId, userController.validateUser, userController.updateUser);

// Put route for accepting a new docent
router.put('/:id', userController.validateId, userController.acceptUser);

// //Delete routes for specific users
// router.delete('/:id', authController.validateToken, userController.validateId, userController.deleteUser);
router.delete("/:id", userController.validateId, userController.deleteUser);

module.exports = router;