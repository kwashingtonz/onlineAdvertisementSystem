//imports
const router = require('express').Router()
const logoutController = require('../controllers/logoutController')


//handle logout
router.route('/')
    .get(logoutController.handleLogout)

    
module.exports = router