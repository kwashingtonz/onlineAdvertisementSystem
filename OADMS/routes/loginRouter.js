//imports
const router = require('express').Router()
const sellerController = require('../controllers/sellerController')


//base route of login router
router.route('/')
    //get login page
    .get((req,res) =>{
        res.send('This is Login Page')
    })
    //login authorization
    .post(sellerController.handleSellerLogin)


//exporting module
module.exports = router