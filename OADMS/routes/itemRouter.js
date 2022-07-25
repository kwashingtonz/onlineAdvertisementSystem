//imports
const itemController = require('../controllers/itemController')
const router = require('express').Router()

//get all Items
router.get('/', itemController.getAllItems)

router.route('/search')
    //get Searched Items
    .get(itemController.getSearchItems)
    //searching by item name
    .post(itemController.postSearchItems)

//get Items By Category
router.get('/category',itemController.getAllItemsByCategory)


module.exports = router