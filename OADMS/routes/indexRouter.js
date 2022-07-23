const categoryController = require('../controllers/categoryController');

const router = require('express').Router();

router.get('/', categoryController.getAllCategoriesWithCount);

module.exports = router;