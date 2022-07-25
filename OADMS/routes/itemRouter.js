//imports
const itemController = require('../controllers/itemController');
const router = require('express').Router();

//get all Items
router.get('/', itemController.getAllItems);

//get Searched Items
router.get('/search', itemController.getSearchItems);

//get Items By Category
router.get('/category',itemController.getAllItemsByCategory)


module.exports = router;