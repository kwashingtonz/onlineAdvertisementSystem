const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')

//get all Items
router.route('/')
    //get cities to register page
    //.get(cityController.getAllCities)
    .get(sellerController.getAllSellers)
    .post(sellerController.addNewSeller)

    module.exports = router