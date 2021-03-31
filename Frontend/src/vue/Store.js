import Vue from 'vue'
import Vuex from 'vuex'

import AuthorizationMixin from "../mixins/authorizationMixin"
import BlogsMixin from "../mixins/blogsMixin"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		auth: {
			isAuthorized: false,
			user: { _id: "", likedBlogs: [], name: "" },
		},
		blogs: {
			loaded: false,
			allBlogs: []
		},
	},

	getters: {

		// Blogs
		getBestBlogsOfToday(state) {
      const data = state.blogs.allBlogs.sort((a, b) => b.likes - a.likes || new Date(b.createdAt) - new Date(a.createdAt))
      data.splice(9)
      return data
		},

		getUserBlogs: (state) => () => { // If you return func from getter it would be dynamic
			return state.blogs.allBlogs.filter(item => item.author.author === state.auth.user._id)
		},

		getBlogById: (state) => (id) => {
			return state.blogs.allBlogs.find(item => item._id === id)
		}

	},

	mutations: {

		// Authorization
		login(state, user) {
			state.auth.isAuthorized = true
			state.auth.user = user
		},
		logout(state) {
			state.auth.isAuthorized = false
			state.auth.user = { _id: "", likedBlogs: [], name: "" }
		},

		// Blogs
		addNewBlog(state, blog) {
			state.blogs.allBlogs.push(blog)
		},
		blogEdited(state, blog) {
			const i = state.blogs.allBlogs.findIndex(item => item._id === blog._id)
			state.blogs.allBlogs[i] = blog
		},
		blogDeleted(state, blogID) {
			const i = state.blogs.allBlogs.findIndex(item => item._id === blogID)
			state.blogs.allBlogs.splice(i, 1)
		},
		blogLiked(state, { blogID, user }) {
			state.auth.user = user
			const i = state.blogs.allBlogs.findIndex(item => item._id === blogID)
			const blog = state.blogs.allBlogs[i]
			blog.likes += 1
			blog.isLiked = true
		},
		blogDisliked(state, { blogID, user }) {
			state.auth.user = user
			const i = state.blogs.allBlogs.findIndex(item => item._id === blogID)
			const blog = state.blogs.allBlogs[i]
			blog.likes -= 1
			blog.isLiked = false
		}
	},

	actions: {

		// Authorization
		async checkUserAuthorization(context) {
			if (context.state.auth.isAuthorized) return
			const auth = await AuthorizationMixin.methods.checkAuthorization()

			if (auth.isAuthorized) context.commit("login", auth.user)
			else context.commit("logout")
		},
		login: ({ commit }, user) => commit("login", user),
		logout: ({ commit }) => commit("logout"),

		// Blogs
		addNewBlog: ({ commit }, blog) => commit("addNewBlog", blog),

		blogEdited: ({ commit }, blog) => commit("blogEdited", blog),

		blogDeleted: ({ commit }, blogID) => commit("blogDeleted", blogID),

		async getAllBlogs(context) {
			if (context.state.blogs.loaded) return
			const blogs = await BlogsMixin.methods.getAllBlogs(context.state.auth)
			context.state.blogs.loaded = true
			context.state.blogs.allBlogs = blogs
		},
		toggleLike({ commit }, { data, user }) {
			if (data.action == "+") commit("blogLiked", { blogID: data.blog, user })
				else commit("blogDisliked", { blogID: data.blog, user })
		}

	}
})