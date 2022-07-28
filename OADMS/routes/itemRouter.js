//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()


router.route('/')
    //get Items Page
    .get(itemController.getAllItems)
    //Get filterd Items - category or city
    .post(itemController.postSearchItems)
    
router.route('/search')
    //get Searched Items
    .get(itemController.getSearchItems)

module.exports = router