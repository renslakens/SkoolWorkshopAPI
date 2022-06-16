const express = require("express");
const router = express.Router();
const docentController = require("../controllers/docent.controller");
const authController = require("../controllers/auth.controller");

//Add user
router.post("/", docentController.validateDocent, docentController.addUser);

//Get all users
router.get("/", docentController.getAllUsers);

// Put route for accepting a new docent
router.put(
  "/:id",
  //aunthController.validateEmployeeToken,
  docentController.acceptUser
);

//Get route for profile
router.get(
  "/profile/:emailadres",
  authController.validateToken,
  docentController.getUserProfile
);

//Get routes for specific users
router.get("/:id", docentController.validateId, docentController.getDocent);

// //Put routes for specific users
// router.put('/:id', authController.validateToken, userController.validateId, userController.validateUser, userController.updateUser);

// Put route for accepting a new docent
router.put(
  "/:id",
  //aunthController.validateEmployeeToken,
  docentController.acceptUser
);

// //Delete routes for specific users
// router.delete('/:id', authController.validateToken, userController.validateId, userController.deleteUser);
// router.delete(
//     "/:id",
//     //aunthController.validateEmployeeToken,
//     docentController.deleteUser
// );

module.exports = router;
