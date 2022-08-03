//imports
const router = require('express').Router()
const logoutController = require('../controllers/logoutController')


//base route of logout router
router.route('/')
    //handle logout
    .get(logoutController.handleLogout)

 
//exporting module    
module.exports = router