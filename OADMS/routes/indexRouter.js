//imports
const categoryController = require('../controllers/categoryController');

const router = require('express').Router();

//get Categories with item count
router.get('/', categoryController.getAllCategoriesWithCount);



module.exports = router;