const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.validateLogin, authController.login);

router.post("/register", authController.register);

router.delete("/:emailadres", authController.deleteUser);

// Put route for accepting a new user
router.put(
  "/:emailadres",
  //aunthController.validateEmployeeToken,
  authController.acceptUser
);

router.get("/", authController.getAllUsers);

module.exports = router;
