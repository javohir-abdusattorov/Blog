const { Router } = require('express')
const router = Router()
const User = require('../users/user.model')
const Routes = require('./auth.routes')
const routes = new Routes()

const advancedResults = require('../../middleware/advancedResults')
const { protect, authorize } = require('../../middleware/auth')

router.get('/me', protect, routes.getMe)

router.post('/login', routes.login)
router.post('/register', routes.register)

module.exports = router
