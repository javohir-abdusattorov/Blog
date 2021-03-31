<template>
  <div>
    <Navbar></Navbar>
    <div>
      <div class="col-md-7 mx-auto bg-white rounded shadow py-3 px-4 my-5">
        <h2 class="text-center font-weight-light mb-4">Edit <span class="text-primary pointer">#{{ blog._id }}</span> blog</h2>
        <form>
          <div class="form-group mb-4">
            <label for="blog-title">Blog title</label>
            <input v-model="blog.title" type="text" class="form-control" id="blog-title" placeholder="Enter blog title" required>
          </div>
          <p class="mb-1">Blog image</p>
          <img :src="blog.image" class="blog-image">
          <div class="custom-file mb-4" data-toggle="tooltip" data-placement="right" title="Upload image if you want to change. Optional field">
            <input type="file" ref="blog-image" class="custom-file-input" id="blog-image" required accept="image/*" @change="handleFileUpload()">
            <label class="custom-file-label" ref="blog-image-label" for="blog-image">Choose image</label>
          </div>
          <div class="form-group">
            <label for="blog-content">Blog content</label>
            <textarea v-model="blog.content" class="form-control" id="blog-content" rows="5" required></textarea>
          </div>
          <p class="mb-2">Blog tags</p>
          <div class="d-flex flex-wrap pb-4">
            <div
              v-for="(tag, index) in tags"
              :key="tag"
              class="form-check px-3 border mr-3 mb-2 rounded border-primary">
              <input type="checkbox"
                class="form-check-input"
                :id="`tag-${index}`"
                :value="tag"
                v-model="blog.tags">
              <label class="form-check-label"
                :for="`tag-${index}`">{{ tag }}
              </label>
            </div>
          </div>
          <div class="text-center pb-3">
            <button type="submit" class="btn btn-primary" @click.prevent="editBlog()">Update blog</button>
          </div>
          <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
          <p class="text-center text-success font-weight-500" v-show="validation.success">Blog updated successfuly!</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'

import Navbar from "../Navbar.vue"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    tags: [],
    blog: {
      _id: "",
      title: "",
      content: "",
      tags: [],
      image: "",

      editingImage: null,
    },
    validation: {
      success: false,
      errorMessage: ""
    }
  }),
  methods: {
    createBlogData(blog) {
      if (this.$store.state.auth.user._id !== blog.author.author) return this.$emit("redirect", "blog.all")

      this.blog._id = blog._id
      this.blog.title = blog.title
      this.blog.content = blog.content
      this.blog.tags = blog.tags
      this.blog.image = `${process.env.VUE_APP_MAIN_URL}/${blog.image}`
    },

    handleFileUpload() {
      this.blog.editingImage = this.$refs["blog-image"].files[0]
      this.$refs["blog-image-label"].textContent = this.blog.editingImage.name
    },

    editBlog() {
      const { blog } = this
      const data = { title: blog.title, content: blog.content, tags: blog.tags,  }
      const isInvalidData = this.validateObject(data, [
        { name: "title", type: "string" }, { name: "content", type: "string" },
        { name: "tags", type: "array" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData

      const formData = this.createFormData(data)
      if (blog.editingImage) formData.append("image", blog.editingImage)

      this.$emit("loader", "show")
      this.axios({
        method: 'put',
        url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/edit/${blog._id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage["access-token"]}`
        },
        data: formData,
      }).then((res) => {
        this.validation.success = true
        this.validation.errorMessage = ""
        this.$store.dispatch("blogEdited", res.data.data)

        setTimeout(() => this.$router.push({ name: "blog.detail", params: { id: blog._id } }), 2000)
      })
      .catch((error) => {
        const errorText = error.response.data.error ? error.response.data.error : error.message
        this.validation.errorMessage = errorText
      })
      .then(() => this.$emit("loader", "hide"))
    },
  },
  components: {
    Navbar
  },
  mixins: [ValidationMixin],
  async created() {
    if (!this.$store.state.auth.isAuthorized) return this.$emit("redirect", "auth.login")
    this.$emit("loader", "show")
    try {
      const tagsRes = await this.axios({
        method: 'get',
        url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/tags`
      })
      this.tags = tagsRes.data
    } catch (error) { return console.error(error) }

    const blog = this.$store.getters.getBlogById(this.$route.params.id)
    this.$emit("loader", "hide")

    if (blog.author.author !== this.$store.state.auth.user._id) return this.$emit("redirect", "blog.my")
    this.createBlogData(blog)
  },
  mounted() {
    $('.custom-file').tooltip()
  }
}
</script>

<style scoped>
  .blog-image {
    max-width: 100%;
    margin-bottom: 10px;
    border-radius: 4px;
  }
</style>
