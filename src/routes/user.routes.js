const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const aunthController = require("../controllers/auth.controller");

//Add user
router.post("/", userController.validateUser, userController.addUser);

//Get all users
router.get("/", userController.getAllUsers);

// //Get route for profile
//router.get('/profile', authController.validateToken, userController.getUserProfile);

// //Get routes for specific users
// router.get('/:id', authController.validateToken, userController.validateId, userController.getUserById);

// //Put routes for specific users
// router.put('/:id', authController.validateToken, userController.validateId, userController.validateUser, userController.updateUser);

<<<<<<< HEAD
// Put route for accepting a new docent
router.put(
    "/:id",
    aunthController.validateToken,
    userController.acceptUser
);
=======
//Put route for accepting a new docent
/*router.put(
  "/:id",
  aunthController.validateEmployeeToken,
  userController.acceptUser
);*/
>>>>>>> 9e4d2ef02481e083ac0a25dbfae3c4b1ee76af2a

// //Delete routes for specific users
// router.delete('/:id', authController.validateToken, userController.validateId, userController.deleteUser);
router.delete(
    "/:id",
    // aunthController.validateToken,
    userController.deleteUser
);

module.exports = router;