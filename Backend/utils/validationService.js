
const User = require('../apps/users/user.model')
const Blog = require('../apps/blogs/blog.model')


module.exports = class Validation {

	validateWaterfall = async (...validations) => {
		let lastResult = []
		for (let result of validations) {
			if (!result.success) {
				return {
					success: false,
					message: result.message
				}
			} else {
				if (result.data) lastResult.push(result.data)
			}
		}
		return { success: true, data: lastResult }
	}

	validateID = async (Model, id, name) => {
	  if(!id || typeof(id) !== "string" || id.length !== 24) return { success: false, message: `Invalid ID` }
	  const item = await Model.findById(id)
	  if (!item) return { success: false, message: `${name} not found with this ID` }
	  return { success: true, data: item }
	}

	validateUserID = async (id) => await this.validateID(User, id, "User")

	validateBlogID = async (id) => await this.validateID(Blog, id, "Blog")

	validateType = (item, type) => {
		if (type == "string" && typeof(item) !== "string") return false
		else if (type == "number" && typeof(item) !== "number") return false
		else if (type == "boolean" && typeof(item) !== "boolean") return false
		else if (type == "object" && typeof(item) !== "object") return false
		else if (type == "array" && !Array.isArray(item)) return false

		return true
	}

	validateBody = (body, requirements) => {
		if (!body) return { success: false, message: `Invalid data: Don't have body!` }

		for  (let item of requirements) {
			if (item.type !== "boolean" && !body[item.name]) return { success: false, message: `Invalid data: '${item.name}' is required` }

			if (item.type == "number" && !this.validateType(body[item.name], item.type)) body[item.name] = +body[item.name]
			if (item.type == "array" && !this.validateType(body[item.name], item.type)) body[item.name] = JSON.parse(body[item.name])
			if (item.type == "object" && !this.validateType(body[item.name], item.type)) body[item.name] = JSON.parse(body[item.name])

			if (!this.validateType(body[item.name], item.type)) return { success: false, message: `Invalid data: '${item.name}' must be ${item.type}` }
		}

		return { success: true }
	}
}
