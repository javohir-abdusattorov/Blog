<template>
  <div>
    <Navbar></Navbar>
    <div class="blog-container">
      <div class="col-md-6 px-0 mx-auto py-5">
        <h1 class="font-weight-bold blog-title">{{ blog.title }}</h1>
        <div class="d-flex justify-content-between">
          <div class="author pt-3 vertical-center">
            <img src="../../assets/images/default_user_image.png" width="30" height="30">
            <p class="ml-2 mb-0">{{ blog.author.name }}</p>
          </div>
          <div v-if="auth.isAuthorized" class="vertical-center like-button">
            <svg class="bi mr-1 text-danger pointer" width="25" height="25" @click="likeBlog()">
              <use v-if="blog.isLiked" xlink:href="../../assets/icons/bootstrap-icons.svg#heart-fill"/>
              <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#heart"/>
            </svg>
            <p :class="{ 'font-weight-500': true, 'mb-0': true, 'text-muted': !blog.isLiked, 'text-danger': blog.isLiked }">{{ blog.likes }}</p>
          </div>
        </div>
      </div>
      <div class="text-center">
        <img :src="blogImage" class="rounded blog-image shadow-sm">
      </div>
      <div class="col-md-6 px-0 mx-auto pt-5">
        <p class="content">{{ blog.content }}</p>
        <p class="d-flex flex-wrap pt-4 pb-5 mb-0">
          <button
            v-for="tag in blog.tags" :key="tag"
            class="btn btn-outline-primary rounded-25 px-2 py-1 mr-2 mb-2 tag">#{{ tag }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

// Imports
import Navbar from "../Navbar.vue"
import BlogsMixin from "../../mixins/blogsMixin"


export default {
  data: () => ({
    toggleLikeLoading: false
  }),
  methods: {
    async likeBlog() {
      if (!this.toggleLikeLoading && this.auth.isAuthorized) {
        this.toggleLikeLoading = true

        const action = this.blog.isLiked ? "-" : "+"
        const data = { blog: this.blog._id, action }
        const user =  await this.toggleLikeRequest(data)

        this.$store.dispatch("toggleLike", { data, user })
        this.toggleLikeLoading = false
      }
    },
  },
  computed: {
    blog() { return this.$store.getters.getBlogById(this.$route.params.id) },

    auth() { return this.$store.state.auth },

    blogImage() { return `${process.env.VUE_APP_MAIN_URL}/${this.blog.image}` }
  },
  components: {
    Navbar
  },
  mixins: [BlogsMixin],
}
</script>

<style scoped>
  .blog-container {
    background: #fff !important;
    font-family: "Open Sans", sans-serif !important;
  }
  .blog-title {
    font-size: 50px;
  }
  .blog-image {
    min-width: 680px;
    max-width: 87%;
  }
  .author p {
    font-size: 15px;
  }
  .content {
    font-size: 21px;
    word-break: break-word;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: -0.003em;
    font-family: "Georgia", serif !important;
  }
  .like-button {
    font-family: "Segoe UI";
  }
  .like-button p {
    font-size: 18px;
  }
</style>
