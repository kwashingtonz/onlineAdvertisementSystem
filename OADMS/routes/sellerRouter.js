const sellerController = require('../controllers/sellerController')
const router = require('express').Router()

router.route('/')
    //get seller profile
    .get(sellerController.getSellerInfo) /////////// get itemImage using association

module.exports = router