//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()

router.route('/')
    //get all Items
    .get(itemController.getAllItems)

router.route('/search')
    //get Searched Items
    .get(itemController.getSearchItems)
    //searching by item name
    .post(itemController.postSearchItems)


router.route('/category')
    //get Items By Category
    .get(itemController.getAllItemsByCategory)


module.exports = router