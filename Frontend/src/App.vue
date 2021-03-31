<template>
  <div>
    <template>
      <router-view
        @loader="loader($event)"
        @login="login($event)"
        @logout="logout()"
        @redirect="redirect($event)"
        v-if="!authLoading && !blogsLoading"
      ></router-view>
    </template>

    <div class="modal loading-modal" ref="loader" tabindex="-1" role="dialog">
      <div id="loader"><div class="loader-container"></div></div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'

import AuthorizationMixin from "./mixins/authorizationMixin"
import ValidationMixin from "./mixins/validationMixin"


export default {
  name: 'App',
  data: () => ({
    authLoading: true,
    blogsLoading: true,
  }),
  methods: {
    loader(action) {
      $(this.$refs.loader).modal(action)
    },

    redirect(name) {
      this.loader("hide")
      this.$router.push({ name })
    }
  },
  mixins: [AuthorizationMixin, ValidationMixin],
  async created() {

    // Authorization checking
    await this.$store.dispatch("checkUserAuthorization")
    this.authLoading = false
    this.loader("hide")

    // Getting all blogs
    await this.$store.dispatch("getAllBlogs")
    this.blogsLoading = false
  },
  mounted() {
    if (this.authLoading || this.blogsLoading) this.loader("show")
    $('[data-toggle="tooltip"]').tooltip()
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
  @import "assets/main-styles.css";
</style>
