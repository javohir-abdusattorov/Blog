
const ErrorResponse = require('../../utils/errorResponse')
const asyncHandler = require('../../middleware/async')

const User = require("./user.model")

const ValidationService = require("../../utils/validationService")
const validation = new ValidationService()

const Service = require("./users.service")
const service = new Service()


module.exports = class UserRoutes {

  // @desc      Get all users
  // @route     GET /api/v1/users/all
  // @access    Public
  getAll = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
  })

}
