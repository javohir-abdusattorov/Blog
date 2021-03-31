<template>
  <div>
    <Navbar></Navbar>
    <h2 class="text-center mt-4">All blogs</h2>
    <div class="col-md-9 d-flex flex-wrap px-0 py-4 mx-auto" id="filters">
      <div class="form-group col-md-6 pl-0">
        <input v-model="filter.searchTitle" type="search" class="form-control" placeholder="Search from blog's title...">
      </div>
      <div class="form-group col-md-6 pr-0">
        <input v-model="filter.searchAuthor" type="search" class="form-control" placeholder="Search author...">
      </div>
      <div class="form-group col-12 px-0">
        <input v-model="filter.searchContent" type="search" class="form-control" placeholder="Search from blog's content...">
      </div>
    </div>
    <div class="col-md-9 px-0 mx-auto mb-5 d-flex flex-wrap align-items-center">
      <p class="mb-0 ml-auto mr-2">Sort by</p>
      <div class="form-group pl-0 mb-0">
        <select v-model="sortBy" class="form-control">
          <option value="createdAt+">Newest</option>
          <option value="createdAt-">Oldest</option>
          <option value="likes+">Most liked</option>
          <option value="likes-">Less liked</option>
          <option v-if="auth.isAuthorized" value="user-liked">My favourite</option>
        </select>
      </div>
    </div>
    <div class="col-md-9 px-0 pb-5 pt-5 mx-auto blogs-container">
      <BlogCard v-for="blog in filteredBlogs" :key="blog._id" :blogData="blog"></BlogCard>
    </div>
  </div>
</template>

<script>

// Imports
import Navbar from "../Navbar.vue"
import BlogCard from "./BlogCard.vue"

import BlogsMixin from "../../mixins/blogsMixin"


export default {
  data: () => ({
    filter: {
      searchTitle: "",
      searchAuthor: "",
      searchContent: "",
    },
    sortBy: "createdAt+",
  }),
  methods: {
  },
  computed: {
    blogs() { return this.$store.state.blogs.allBlogs },

    auth() { return this.$store.state.auth },
  },
  components: {
    Navbar, BlogCard
  },
  mixins: [BlogsMixin],
}
</script>

<style scoped>
</style>
