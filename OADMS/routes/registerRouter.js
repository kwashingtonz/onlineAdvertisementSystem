//imports
const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerImageUpload')


//get register page and registration
router.route('/')
    //get cities to register page
    .get(cityController.getAllCities)
    .post(sellerImageMiddleware.upload, sellerController.addNewSeller)

    
module.exports = router