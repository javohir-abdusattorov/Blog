const { Router } = require('express')
const router = Router()
const Blog = require("./blog.model")
const Routes = require('./blogs.routes')
const routes = new Routes()

const advancedResults = require('../../middleware/advancedResults')
const { protect, authorize } = require('../../middleware/auth')


router.get('/all', advancedResults(Blog), routes.getAllBlogs)
router.get('/my', protect, routes.getUserBlogs)
router.get('/tags', routes.getBlogTags)
router.get('/blog/:id', routes.getBlogById)

router.post('/create', protect, routes.createBlog)
router.put('/edit/:id', protect, routes.editBlog)
router.delete('/delete/:id', protect, routes.deleteBlog)
router.put('/toggle-like', protect, routes.toggleUserLike)


module.exports = router
