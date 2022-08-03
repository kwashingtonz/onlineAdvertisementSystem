//imports
const categoryController = require('../controllers/categoryController')
const router = require('express').Router()


//base route of index router
router.route('/')
    //get Categories with item count
    .get(categoryController.getAllCategoriesWithCount)


//exporting module
module.exports = router