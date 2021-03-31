
const ErrorResponse = require('../../utils/errorResponse')
const asyncHandler = require('../../middleware/async')

const User = require("../users/user.model");

const ValidationService = require("../../utils/validationService")
const validation = new ValidationService()

const Service = require("./auth.service")
const service = new Service()


module.exports = class AuthRoutes {

  // @desc      Register
  // @route     POST /api/v1/auth/register
  // @access    Public
  register = asyncHandler(async (req, res, next) => {
    const result = validation.validateBody(req.body, [
      { name: "name", type: "string" },
      { name: "password", type: "string" },
      { name: "email", type: "string" }
    ])
    if (!result.success) return next(new ErrorResponse(result.message, 400))

    const { name, password, email } = req.body
    const user = await User.create({
      name,
      password,
      email,
      likedBlogs: []
    })

    service.sendTokenResponse(user, 200, res)
  })

  // @desc      Login user
  // @route     POST /api/v1/auth/login
  // @access    Public
  login = asyncHandler(async (req, res, next) => {
    let result = validation.validateBody(req.body, [
      { name: "name", type: "string" },
      { name: "password", type: "string" },
    ])

    if (!result.success) return next(new ErrorResponse(result.message, 400))
    const { name, password } = req.body;

    //Check for the user
    const user = await User.findOne({ name }).select("+password")
    if (!user) return next(new ErrorResponse(`Bunday foydalanuvchi topilmadi!`, 401))

    // Check passwords
    const isMatch = await user.matchPassword(password)
    if (!isMatch) return next(new ErrorResponse("Noto'g'ri parol", 401))

    service.sendTokenResponse(user, 200, res)
  })

  // @desc      Get authorized user
  // @route     GET /api/v1/auth/me
  // @access    Private
  getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success: true,
      data: user,
    })
  })

}
