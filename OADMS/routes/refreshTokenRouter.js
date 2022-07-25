const router = require('express').Router()
const refreshTokenController = require('../controllers/refreshTokenController')

//refresh the access token
router.route('/')
    .get(refreshTokenController.handleRefreshToken)

module.exports = router