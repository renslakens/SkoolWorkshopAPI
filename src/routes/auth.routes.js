const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.validateLogin, authController.login);

router.post("/register", authController.register);

router.post("/delete", authController.deleteUser);

router.post("/email", authController.updateMail);

module.exports = router;