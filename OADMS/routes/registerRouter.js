//imports
const router = require('express').Router()
const cityController = require('../controllers/cityController')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerImageUpload')


//base route of register route
router.route('/')
    //get register page and cities to register page
    .get(cityController.getAllCities)
    //post registration
    .post(sellerImageMiddleware.upload, sellerController.addNewSeller)

 
//exporting module    
module.exports = router