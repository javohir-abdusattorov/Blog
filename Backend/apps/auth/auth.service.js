
const FileService = require('../../utils/fileService')
const fileService = new FileService()


module.exports = class AuthService {

  sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const role = user.role

    res.status(statusCode).json({
      success: true,
      token,
      role,
      user,
    })
  }

}
