const express = require("express");
const router = express.Router();
const docentController = require("../controllers/docent.controller");
const authController = require("../controllers/auth.controller");

//Get all users
router.get("/", docentController.getAllUsers);

// Put route for updating a new docent
router.put(
  "/:id",
  //aunthController.validateEmployeeToken,
  docentController.updateDocent
);

//Get routes for specific users
router.get("/:emailadres", docentController.getDocent);

module.exports = router;
