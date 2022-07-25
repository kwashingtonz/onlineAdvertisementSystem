//imports
const router = require('express').Router()
const sellerController = require('../controllers/sellerController')


//get login page and authorization
router.route('/')
    .get((req,res) =>{
        res.send('This is Login Page')
    })
    .post(sellerController.handleSellerLogin)


module.exports = router