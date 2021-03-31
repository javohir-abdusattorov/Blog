
const path = require("path")
const crypto = require("crypto")
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../../utils/errorResponse')
const asyncHandler = require('../../middleware/async')

const Blog = require("./blog.model")
const User = require('../users/user.model')

const ValidationService = require("../../utils/validationService")
const validation = new ValidationService()
const FileService = require("../../utils/fileService")
const fileService = new FileService()

const Service = require("./blogs.service")
const service = new Service()

const openTopics = +process.env.OPEN_TOPICS
const blogTags = JSON.parse(process.env.TAGS)


module.exports = class ModuleRoutes {

  // @desc      Get all blogs
  // @route     GET /api/v1/blogs/all
  // @access    Public
  getAllBlogs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
  })

  // @desc      Get all blog tags
  // @route     GET /api/v1/blogs/tags
  // @access    Public
  getBlogTags = asyncHandler(async (req, res, next) => {
    res.status(200).json(blogTags)
  })

  // @desc      Get all blogs
  // @route     GET /api/v1/blogs/my
  // @access    Public
  getUserBlogs = asyncHandler(async (req, res, next) => {
    const blogs = await Blog.find({ "author.author": req.user._id })
    res.status(200).json({ success: true, data: blogs })
  })

  // @desc      Get blog by id
  // @route     GET /api/v1/blogs/blog/:id
  // @access    Public
  getBlogById = asyncHandler(async (req, res, next) => {
    const result = await validation.validateBlogID(req.params.id)
    if (!result.success) return next(new ErrorResponse(result.message, 400))

    res.status(200).json({
      success: true,
      data: result.data
    })
  })

  // @desc      Create
  // @route     POST /api/v1/blogs/create
  // @access    Private
  createBlog = asyncHandler(async (req, res, next) => {
    const result = validation.validateBody(req.body, [
      { name: "title", type: "string" },
      { name: "tags", type: "array" },
      { name: "content", type: "string" }
    ])
    if (!result.success) return next(new ErrorResponse(result.message, 400))

    const { title, tags, content } = req.body
    if (!req.files || !req.files.image || req.files.image.mimetype.split('/')[0] !== "image") return next(new ErrorResponse(`Blog's image is required`, 400))

    const image = await fileService.uploadBlogImage(req.files.image)
    const newBlog = await Blog.create({
      title,
      tags,
      content,
      image,
      author: {
        name: req.user.name,
        author: req.user._id
      }
    })

    res.status(200).json({
      success: true,
      data: newBlog,
    })
  })

  // @desc      Edit module
  // @route     PUT /api/v1/blogs/edit/:id
  // @access    Private
  editBlog = asyncHandler(async (req, res, next) => {
    const result = await validation.validateBlogID(req.params.id)
    if (!result.success) return next(new ErrorResponse(result.message, 400))

    const blog = result.data
    if (blog.author.author.toString() !== req.user._id.toString()) return next(new ErrorResponse(`You are not a creator of this blog`, 400))

    const fields = ["title", "content"]
    for (const field of fields) if (field in req.body) blog[field] = req.body[field]

    if (req.files && req.files.image) {
      if (req.files.image.mimetype.split('/')[0] !== "image") return next(new ErrorResponse(`Please upload blog's image in supported format!`, 400))

      fileService.deleteFiles([blog.image])
      blog.image = await fileService.uploadBlogImage(req.files.image)
    }

    if (req.body.tags) {
      if (typeof(req.body.tags) == "string") blog.tags = JSON.parse(req.body.tags)
        else blog.tags = req.body.tags
    }

    await blog.save()

    res.status(200).json({
      success: true,
      data: blog,
    })
  })

  // @desc      Add blog to liked | Remove blog from liked
  // @route     GET /api/v1/blogs/toggle-like
  // @access    Private
  toggleUserLike = asyncHandler(async (req, res, next) => {
    const result = await validation.validateWaterfall(
      validation.validateBody(req.body, [
        { name: "blog", type: "string" },
        { name: "action", type: "string" },
      ]),
      await validation.validateBlogID(req.body.blog),
    )
    if (!result.success) return next(new ErrorResponse(result.message, 400))
    const blog = result.data[0]
    const { action } = req.body
    const user = req.user
    const i = user.likedBlogs.findIndex(item => item.blog._id.toString() === req.body.blog)

    if (action == "+" && i < 0) {
      user.likedBlogs.push({
        name: blog.title,
        blog: blog._id
      })
      blog.likes += 1
    } else if (action == "-" && i >= 0) {
      user.likedBlogs.splice(i, 1)
      blog.likes -= 1
    }

    await blog.save()
    await user.save()
    res.status(200).json({ success: true, data: user })
  })

  // @desc      Delete module
  // @route     PATCH /api/v1/blogs/delete/:id
  // @access    Private
  deleteBlog = asyncHandler(async (req, res, next) => {
    const result = await validation.validateBlogID(req.params.id)
    if (!result.success) return next(new ErrorResponse(result.message, 400))
    const blog = result.data
    if (blog.author.author.toString() !== req.user._id.toString()) return next(new ErrorResponse(`You are not a creator of this blog`, 400))

    // await service.removeBlogFromSaved(blog._id.toString())
    // fileService.deleteFiles([blog.image])
    // await Blog.deleteOne({ _id: blog._id })

    res.status(200).json({ success: true })
  })
}
