const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()
const workshopController = require('../controllers/workshop.controller')

//Add workshop
router.post(
    '/',
    authController.validateToken,
    workshopController.addWorkshop,
)

//Delete workshop
router.delete(
    '/:id',
    authController.validateToken,
    workshopController.deleteWorkshop,
)

//Update workshop
router.put(
    '/:id',
    authController.validateToken,
    workshopController.updateWorkshop,
)

//get all workshops
router.get('/', workshopController.getAllWorkshops)

router.get('/:id', workshopController.getWorkshop)
module.exports = router