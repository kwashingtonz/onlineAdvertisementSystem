const router = require('express').Router()
const logoutController = require('../controllers/logoutController')

//refresh the access token
router.route('/')
    .get(logoutController.handleLogout)

module.exports = router