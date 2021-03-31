const { Router } = require('express')
const router = Router()
const User = require('./user.model')
const Routes = require('./users.routes')
const routes = new Routes()

const advancedResults = require('../../middleware/advancedResults')
const { protect, authorize } = require('../../middleware/auth')

router.get('/all', advancedResults(User), routes.getAll)

module.exports = router
