<template>
  <div>
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-white shadow py-1">
      <router-link :to="{ name: 'index' }" class="navbar-brand d-flex align-items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Blogger.svg/603px-Blogger.svg.png" width="40" height="40" class="d-inline-block align-top">
        <p class="mb-0 ml-2">Javohir Blog</p>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-content" aria-controls="navbar-content" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar-content">
        <ul class="navbar-nav align-items-center ml-auto" v-if="authorized">
          <li :class="{ 'nav-item': true, active: currentRoute == 'blog.all' }">
            <router-link :to="{ name: 'blog.all' }" class="nav-link py-1">All blogs</router-link>
          </li>
          <li :class="{ 'nav-item': true, active: currentRoute == 'blog.my' }">
            <router-link :to="{ name: 'blog.my' }" class="nav-link py-1">My blogs</router-link>
          </li>
          <li :class="{ 'nav-item': true, active: currentRoute == 'blog.create' }">
            <router-link :to="{ name: 'blog.create' }" class="nav-link py-1">Post new blog</router-link>
          </li>
          <li class="nav-item">
            <a class="btn btn-outline-danger ml-3 py-1" type="button" @click="logout()">Logout</a>
          </li>
        </ul>
        <ul class="navbar-nav align-items-center ml-auto" v-else>
          <li :class="{ 'nav-item': true, active: currentRoute == 'blog.all' }">
            <router-link :to="{ name: 'blog.all' }" class="nav-link py-1">All blogs</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'auth.login' }" class="btn btn-outline-primary ml-3 py-1">Sign up | Login</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  methods: {
    logout() {
      this.$store.dispatch("logout")
      localStorage.removeItem("access-token")
      this.$router.push({ name: "auth.login" })
    }
  },
  computed: {
    authorized() {
      return this.$store.state.auth.isAuthorized
    },
    currentRoute() {
      return this.$route.name
    },
  }
}
</script>

<style scoped>
</style>
