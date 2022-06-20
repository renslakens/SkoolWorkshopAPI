const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

//Add customer
router.post(
  "/",
  customerController.validateCustomer,
  customerController.addCustomer
);

//Get all customer
router.get("/", customerController.getAllCustomers);

//update customer
router.put(
  "/:id",
  customerController.validateId,
  customerController.validateCustomer,
  customerController.updateCustomer
);

// //Delete customer
router.delete(
  "/:id",
  customerController.validateId,
  customerController.deleteCustomer
);

module.exports = router;
