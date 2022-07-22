const categoryController = require('../controllers/categoryController');

const router = require('express').Router();

router.get('/', categoryController.getAllCategories);

module.exports = router;