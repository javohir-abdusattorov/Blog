
const User = require('../users/user.model')


module.exports = class ModuleService {

  removeBlogFromSaved = async (blogID) => {
    const users = await User.find({ "savedBlogs.blog": blogID })
    for (const user of users) {
      const i = user.savedBlogs.findIndex(item => item.blog.toString() === blogID)
      if (i >= 0) {
        user.savedBlogs.splice(i, 1)
        await user.save()
      }
    }
  }

}
