
const path = require('path')
const fs = require('fs')


module.exports = class FileService {

	uploadFile = async (file, uploadPath, getPath, fileName) => {
		file.name = `${fileName}${path.parse(file.name).ext}`
		const filePath = `${uploadPath}/${file.name}`
		const directPath = `${getPath}/${file.name}`

		await file.mv(filePath)
		return directPath
	}

	uploadBlogImage = async (file) => {
		return await this.uploadFile(file, "./public/blog-images", "blog-images", `blog_${new Date().getTime()}`)
	}

	deleteFiles = (files) => {
		for (const file of files) {
			const filePath = `./public/${file}`
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
		}
	}

}
