<template>
  <div>
    <div class="col-md-5 mx-auto bg-white rounded shadow pt-3 px-4 my-5">
      <h2 class="text-center font-weight-light">Register</h2>
      <form @submit="register($event)">
        <div class="form-group mb-4">
          <label for="user-name">Name</label>
          <input v-model="user.name" type="text" class="form-control" id="user-name" placeholder="Enter your name" required>
        </div>
        <div class="form-group mb-4">
          <label for="user-email">Email</label>
          <input v-model="user.email" type="email" class="form-control" id="user-email" placeholder="Enter your email" required>
        </div>
        <div class="form-group mb-4">
          <label for="user-password">Password</label>
          <input v-model="user.password" type="password" class="form-control" id="user-password" placeholder="Enter your password" autocomplete="new-password" required>
        </div>
        <p class="text-center text-danger font-weight-500">{{ validation.errorMessage }}</p>
        <p class="text-center text-success font-weight-500" v-show="validation.success">You registred successfuly!</p>
        <div class="text-center"><button type="submit" class="btn btn-primary">Register</button></div>
        <p class="mt-4 mb-1 text-center">Aleardy have an account? <router-link :to="{ name: 'auth.login' }">Login</router-link></p>
        <p class="pb-3 text-center"><router-link :to="{ name: 'index' }">Home page</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>

import ValidationMixin from "../../mixins/validationMixin"


export default {
  data: () => ({
    user: {
      name: "",
      email: "",
      password: ""
    },
    validation: {
      success: false,
      errorMessage: ""
    }
  }),
  methods: {
    register(evt) {
      evt.preventDefault()

      const data = JSON.parse(JSON.stringify(this.user))
      const isInvalidData = this.validateObject(data, [
        { name: "name", type: "string" }, { name: "email", type: "string" }, { name: "password", type: "string" }
      ])
      if (isInvalidData) return this.validation.errorMessage = isInvalidData

      this.$emit("loader", "show")
      this.axios({
        method: 'post',
        url: `${process.env.VUE_APP_MAIN_URL}/api/v1/auth/register`,
        data
      }).then((res) => {
        this.validation.success = true

        this.$store.dispatch("login", res.data.user)
        localStorage["access-token"] = res.data.token

        this.$emit("redirect", "index")
      })
      .catch((error) => {
        const errorText = error.response.data.error ? error.response.data.error : error.message
        this.validation.errorMessage = errorText
      })
      .then(() => {
        this.$emit("loader", "hide")
      })
    }
  },
  mixins: [ValidationMixin],
  created() {
    if (this.$store.state.auth.isAuthorized) this.$emit("redirect", "index")
  }

}
</script>

<style scoped>
</style>
