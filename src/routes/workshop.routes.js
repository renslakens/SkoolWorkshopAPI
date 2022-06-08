const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()
const workshopController = require('../controllers/workshop.controller')

//Add workshop
router.post(
  '/',
  authController.validateEmployeeToken,
  workshopController.addWorkshop,
)

//Delete workshop
router.delete(
  '/:id',
  authController.validateEmployeeToken,
  workshopController.deleteWorkshop,
)

//Update workshop
router.put(
  '/:id',
  authController.validateEmployeeToken,
  workshopController.updateWorkshop,
)

//get all workshops
router.get('/', workshopController.getAllWorkshops)

module.exports = router
