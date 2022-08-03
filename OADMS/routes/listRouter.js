//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()


//base route of list router
router.route('/')
    //List Items Page
    .get(itemController.getAllItems)
    //List filterd Items - category or city or name
    .post(itemController.postSearchItems)

//item route of list router
router.route('/item')
    //Show item and details
    .get(itemController.getItemInformation)


//exporting module
module.exports = router