<template>
  <div>
    <Navbar></Navbar>
    <div>
      <div class="col-md-7 mx-auto bg-white rounded shadow py-3 px-4 my-5">
        <h2 class="text-center font-weight-light">Create new blog</h2>
        <form>
          <div class="form-group mb-4">
            <label for="blog-title">Blog title</label>
            <input v-model="blog.title" type="text" class="form-control" id="blog-title" placeholder="Enter blog title" required>
          </div>
          <p class="mb-1">Blog image</p>
          <div class="custom-file mb-4">
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
            <button type="submit" class="btn btn-primary" @click.prevent="createNewBlog()">Create blog</button>
          </div>
          <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
          <p class="text-center text-success font-weight-500" v-show="validation.success">Blog created successfuly!</p>
        </form>
      </div>

      <!-- Preview -->
      <div class="col-md-7 mx-auto bg-white rounded shadow py-3 px-4 my-5">
        <div class="">
          <h3 class="text-center text-primary pointer">Preview</h3>
          <div class="mx-3 mt-4 bg-light border p-3 preview-blog">
            <h5 class="text-center mb-3">{{ blog.title }}</h5>
            <p class="d-flex flex-wrap">
              <button
                v-for="tag in blog.tags" :key="tag"
                class="btn btn-outline-primary rounded-25 px-2 py-1 mr-2 mb-2 tag">#{{ tag }}
              </button>
            </p>
            <pre>{{ blog.content }}</pre>
            <p class="text-right mb-0">By <span class="underline font-italic pointer">{{ user.name }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Navbar from "../Navbar.vue"
import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    tags: [],
    blog: {
      title: "Title",
      content: "Content",
      tags: [],
      image: null,
    },
    validation: {
      success: false,
      errorMessage: ""
    },
  }),
  methods: {
    handleFileUpload() {
      this.blog.image = this.$refs["blog-image"].files[0]
      this.$refs["blog-image-label"].textContent = this.blog.image.name
    },

    createNewBlog() {
      const data = JSON.parse(JSON.stringify(this.blog))
      delete data.image

      const isInvalidData = this.validateObject(data, [
        { name: "title", type: "string" }, { name: "content", type: "string" },
        { name: "tags", type: "array" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData

      const formData = this.createFormData(data)
      if (!this.blog.image) return this.validation.errorMessage = `Please upload blog image!`
      formData.append("image", this.blog.image)

      this.$emit("loader", "show")
      this.axios({
        method: 'post',
        url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/create`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage["access-token"]}`
        },
        data: formData,
      }).then((res) => {
        this.validation.success = true
        this.validation.errorMessage = ""
        this.$store.dispatch("addNewBlog", res.data.data)
        setTimeout(() => this.$emit("redirect", "blog.my"), 2000)
      })
      .catch((error) => {
        const errorText = error.response.data.error ? error.response.data.error : error.message
        this.validation.errorMessage = errorText
      })
      .then(() => this.$emit("loader", "hide"))
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    }
  },
  components: {
    Navbar
  },
  mixins: [ValidationMixin],
  created() {
    if (!this.$store.state.auth.isAuthorized) return this.$emit("redirect", "auth.login")

    this.$emit("loader", "show")
    this.axios({
      method: 'get',
      url: `${process.env.VUE_APP_MAIN_URL}/api/v1/blogs/tags`
    }).then((res) => this.tags = res.data)
    .catch((error) => console.error(error))
    .then(() => this.$emit("loader", "hide"))
  }
}
</script>

<style scoped>
  .preview-blog pre {
    font-family: 'Open Sans', sans-serif;
    font-style: italic;
    font-size: 16px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  button.tag {
    font-size: 14px;
  }
</style>
