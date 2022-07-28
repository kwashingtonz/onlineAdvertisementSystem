//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()

router.route('/')
    //List Items Page
    .get(itemController.getAllItems)    ///////////     get itemImage using association
    //List filterd Items - category or city or name
    .post(itemController.postSearchItems)

router.route('/item')
    //Show item and details
    .get(itemController.getItemInformation)    //////////    get itemImage using association



module.exports = router