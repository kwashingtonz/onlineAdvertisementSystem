const router = require('express').Router()
const cityController = require('../controllers/cityController')

//get all Items
router.route('/')
    //get cities to register page
    .get(cityController.getAllCities)

module.exports = router