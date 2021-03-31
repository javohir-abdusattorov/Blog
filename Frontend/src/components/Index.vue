<template>
  <div>
    <Navbar></Navbar>
    <div class="col-9 mx-auto bg-white p-3 rounded my-5 shadow">
      <h2 class="text-center font-weight-light">About "Javohir Blog"</h2>
      <p>lorem ipsum dolor sit amet consectetur, adipisicing elit. A, cumque placeat? Voluptates, voluptas, necessitatibus? Corporis, reiciendis, veritatis dolores mollitia, ratione rerum magni quia voluptatum hic corrupti asperiores consequuntur excepturi culpa nemo nobis, dolor? Quam voluptas illo incidunt voluptates, laboriosam architecto maxime porro vitae nemo doloremque accusamus, dolorem consequuntur? Modi sint numquam aut ipsum odio culpa incidunt quisquam tenetur. Delectus, eum saepe ipsum dignissimos sit doloremque possimus reiciendis corporis ab neque rerum, quaerat. Deserunt incidunt atque, rem nesciunt officiis eum voluptatibus laboriosam harum earum modi maiores veniam magni nisi quasi, dolores amet illo accusantium, repellendus mollitia nulla sequi. Excepturi soluta sit, deserunt sint eaque porro! Dolore provident amet libero. Dolores assumenda, architecto doloribus. Aspernatur minima accusantium expedita consequatur at ut rem sit labore asperiores possimus corporis, perferendis voluptatum mollitia voluptates voluptate ipsam aperiam vel dolores eum nisi quaerat fugit nesciunt dolorem odit. Id veniam accusamus magnam incidunt, molestias, expedita at reprehenderit. Dicta asperiores doloremque magnam repellendus porro quidem, sunt nemo, nobis enim perspiciatis hic ratione neque dolores sequi molestiae aspernatur, minima ex eveniet, fugit voluptatibus reiciendis. Et, eos saepe ipsa sunt laborum dicta, officia modi. Officiis dicta labore, vel id, cupiditate velit ratione ipsum voluptatem iure in veniam modi, laboriosam beatae.</p>
    </div>
    <h2 class="text-center font-weight-light">Best blogs of today</h2>
    <div class="col-md-9 px-0 pb-5 mx-auto blogs-container">
      <BlogCard v-for="blog in blogs" :key="blog._id" :blogData="blog"></BlogCard>
      <div class="text-center py-3"><router-link :to="{ name: 'blog.all' }" class="btn btn-primary">See all blogs</router-link></div>
    </div>
  </div>
</template>

<script>

// Imports
import Navbar from "./Navbar.vue"
import BlogCard from "./Blog/BlogCard.vue"


export default {
  data: () => ({
  }),
  methods: {
  },
  computed: {
    blogs() {
      return this.$store.getters.getBestBlogsOfToday
    }
  },
  components: {
    Navbar, BlogCard
  },
}
</script>

<style scoped>
</style>
