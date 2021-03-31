<template>
  <div class="d-flex align-items-start my-4 bg-white shadow rounded blog-card">
    <div w="25" class="border-right" ref="blog.image">
      <img :src="blog.image" class="blog-image img-fluid rounded-left" alt="blog-image">
    </div>
    <div class="px-3 pt-2 h-auto" w=75 ref="blog.info">
      <div class="d-flex justify-content-between">
        <h3 :w="anotherOptions ? 77 : 80">
          <a class="text-dark text-decoration-none pointer vertical-center">
            <svg v-if="blog.isAuthor" class="bi d-inline-block text-primary mr-2 mt-1 pointer" ref="myblog-icon" width="20" height="20" data-toggle="tooltip" title="Your blog">
              <use xlink:href="../../assets/icons/bootstrap-icons.svg#person-circle"/>
            </svg>
            <router-link :to="{ name: 'blog.detail', params: { id: blogData._id } }" class="text-dark">{{ blog.title }}</router-link>
          </a>
        </h3>
        <div w=20>
          <p class="mb-0 pt-1 vertical-center justify-content-end text-muted">
            <img src="../../assets/icons/clock.svg" class="d-inline-block mr-2" width="18" height="18">
            {{ blog.postedAt }}
          </p>
        </div>
        <div v-if="anotherOptions" class="ml-2 vertical-center">
          <div class="dropdown mb-1">
            <button class="btn dropdown-toggle shadow-none p-0 d-flex vertical-center" type="button" id="another-options-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg class="bi d-inline-block pointer" width="20" height="20">
                <use xlink:href="../../assets/icons/bootstrap-icons.svg#three-dots"/>
              </svg>
            </button>
            <div class="dropdown-menu shadow" aria-labelledby="another-options-btn">
              <a
                v-for="option in anotherOptions"
                @click="option.run(blogData)"
                :key="option.id"
                :class="['dropdown-item', 'pointer', `text-${option.color}`]"
              >{{ option.name }}</a>
            </div>
          </div>
        </div>
      </div>
      <p class="font-italic">{{ blog.content }}</p>
      <div class="d-flex justify-content-between align-items-center pb-3">
        <p class="mb-0">Author: <span class="font-weight-500 pointer">{{ blog.author }}</span></p>
        <div class="vertical-center" v-if="auth.isAuthorized">
          <svg class="bi mr-1 text-danger pointer" width="18" height="18" @click="likeBlog()">
            <use v-if="blog.isLiked" xlink:href="../../assets/icons/bootstrap-icons.svg#heart-fill"/>
            <use v-else xlink:href="../../assets/icons/bootstrap-icons.svg#heart"/>
          </svg>
          <p :class="{ 'font-weight-500': true, 'mb-0': true, 'text-muted': !blog.isLiked, 'text-danger': blog.isLiked }">{{ blog.likes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'
import BlogsMixin from "../../mixins/blogsMixin"


export default {
  props: {
    blogData: {
      type: Object,
      required: true,
    },
    anotherOptions: Array,
  },
  data: () => ({
    blog: {
      title: "", likes: 0, image: "", content: "", author: "", isLiked: false, isAuthor: false,
    },
    toggleLikeLoading: false,
  }),
  methods: {
    async likeBlog() {
      if (!this.toggleLikeLoading && this.auth.isAuthorized) {
        this.toggleLikeLoading = true

        const action = this.blog.isLiked ? "-" : "+"
        const data = { blog: this.blogData._id, action }
        const user =  await this.toggleLikeRequest(data)

        this.$store.dispatch("toggleLike", { data, user })
        this.createBlogData()
        this.toggleLikeLoading = false
      }
    },

    createBlogData() {
      this.blog.title = this.blogData.title
      this.blog.isLiked = this.blogData.isLiked
      this.blog.likes = this.blogData.likes
      this.blog.image = `${process.env.VUE_APP_MAIN_URL}/${this.blogData.image}`
      this.blog.content = this.blogData.content.slice(0, 313) + '...'
      this.blog.author = this.blogData.author.name

      const d = new Date(this.blogData.createdAt)
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (month < 10) month = `0${month}`
      if (day < 10) day = `0${day}`
      const date = `${day}.${month}.${d.getFullYear()}`
      const time = `${d.getHours()}:${d.getMinutes()}`
      this.blog.postedAt = `${date} ${time}`

      if (this.auth.isAuthorized && this.auth.user._id === this.blogData.author.author) {
        this.blog.isAuthor = true
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    }
  },
  mixins: [BlogsMixin],
  created() {
    this.createBlogData()
  },
  mounted() {
    const h = `${this.$refs["blog.info"].offsetHeight}px`
    $(this.$refs["blog.image"]).css("height", h)
    $(this.$refs["myblog-icon"]).tooltip()
  }
}
</script>

<style scoped>
  .blog-card > div {
    height: inherit;
  }
  .blog-card .blog-image {
    width: 100%;
    height: inherit;
    object-fit: cover;
  }

  .blog-card h3 {
    font-size: 1.5em;
    font-weight: 500;
    word-break: break-word;
  }

  #another-options-btn::after {
    content: "";
    display: none ;
  }
</style>
