const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.validateLogin, authController.login);

router.post("/register", authController.register);

router.post("/delete", authController.deleteUser);

// Put route for accepting a new user
router.put(
    "/:id",
    //aunthController.validateEmployeeToken,
    authController.acceptUser
);

module.exports = router;