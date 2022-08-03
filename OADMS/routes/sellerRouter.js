//imports
const sellerController = require('../controllers/sellerController')
const router = require('express').Router()


//base route of seller router
router.route('/')
    //get seller profile
    .get(sellerController.getSellerInfo)


//exporting module
module.exports = router