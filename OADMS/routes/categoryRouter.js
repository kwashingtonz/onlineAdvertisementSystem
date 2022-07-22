const categoryController = require('../controllers/categoryController');

const router = require('express').Router();

router.get('/allCategories', categoryController.getAllCategories);

module.exports = router;