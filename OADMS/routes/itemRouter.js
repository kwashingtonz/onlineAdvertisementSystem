//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()


router.route('/')
    //get Items Page
    .get(itemController.getAllItems)
    //Get filterd Items - category or city
    .post(itemController.postSearchItems)
    

module.exports = router