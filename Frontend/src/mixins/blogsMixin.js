import axios from 'axios'


export default {
	methods: {
    async getAllBlogs(auth) {
      try {
        const res = await axios({
          method: 'get',
          url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/all`
        })

        if (!auth.isAuthorized) return res.data.data
        const data = res.data.data.map(blog => {
          blog.isLiked = auth.user.likedBlogs.some(item => item.blog === blog._id)
          return blog
        })
        return data
      } catch (error) {
        console.error(error)
        return []
      }
    },

    async toggleLikeRequest(data) {
      try {
        const res = await axios({
          method: 'put',
          url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/toggle-like`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
          data
        })
        return res.data.data
      } catch (error) { return console.error(error) }
    },

    async deleteBlog(blog) {
      try {
        await axios({
          method: 'delete',
          url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/delete/${blog._id}`,
          headers: { "Authorization": `Bearer ${localStorage["access-token"]}` },
        })
      } catch (error) { return console.error(error) }
    }
	},

  computed: {
    filteredBlogs() {
      let blogs = [...this.blogs]
      const sortBy = this.sortBy

      if (this.filter.searchTitle.length) {
        const q = new RegExp(this.filter.searchTitle, "gi")
        blogs = blogs.filter((item) => item.title.match(q))
      }
      if (this.filter.searchAuthor.length) {
        const q = new RegExp(this.filter.searchAuthor, "gi")
        blogs = blogs.filter((item) => item.author.name.match(q))
      }
      if (this.filter.searchContent.length) {
        const q = new RegExp(this.filter.searchContent, "gi")
        blogs = blogs.filter((item) => item.content.match(q))
      }

      if (sortBy !== "none") {
        if (sortBy == "createdAt+") {
          blogs = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (sortBy == "createdAt-") {
          blogs = blogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else if (sortBy == "likes+") {
          blogs = blogs.sort((a, b) => b.likes - a.likes)
        } else if (sortBy == "likes-") {
          blogs = blogs.sort((a, b) => a.likes - b.likes)
        } else if (sortBy == "user-liked") {
          blogs = blogs.sort((a, b) => {
            const aAuth = this.auth.user.likedBlogs.some(item => item.blog === a._id)
            const bAuth = this.auth.user.likedBlogs.some(item => item.blog === b._id)

            if (aAuth && bAuth) return 0
            else if (!aAuth && bAuth) return 1
            else if (aAuth && !bAuth) return -1
            return 0
          })
        }
      }

      return blogs
    },
  },
}