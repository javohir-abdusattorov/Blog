
import VueRouter from "vue-router"

import Index from "../components/Index.vue"

import AuthRegister from "../components/Auth/Register.vue"
import AuthLogin from "../components/Auth/Login.vue"

import CreateBlog from "../components/Blog/Create.vue"
import EditBlog from "../components/Blog/Edit.vue"
import AllBlogs from "../components/Blog/All.vue"
import MyBlogs from "../components/Blog/MyBlogs.vue"
import BlogDetail from "../components/Blog/Detail.vue"


const routes = [
  {
    name: "index",
    path: "/",
    component: Index,
    meta: {
      auth: '0'
    }
  },

  // -- Auth routes --
  {
    name: "auth.register",
    path: "/auth/register",
    component: AuthRegister,
    meta: {
      auth: '-'
    }
  },
  {
    name: "auth.login",
    path: "/auth/login",
    component: AuthLogin,
    meta: {
      auth: '-'
    }
  },

  // -- Blog routes --
  {
    name: "blog.all",
    path: "/blogs/all",
    component: AllBlogs,
    meta: {
      auth: '0'
    }
  },
  {
    name: "blog.my",
    path: "/blogs/my",
    component: MyBlogs,
    meta: {
      auth: '+'
    }
  },
  {
    name: "blog.detail",
    path: "/blogs/blog/:id",
    component: BlogDetail,
    meta: {
      auth: '0'
    }
  },
  {
    name: "blog.create",
    path: "/blogs/create",
    component: CreateBlog,
    meta: {
      auth: '+'
    }
  },
  {
    name: "blog.edit",
    path: "/blogs/edit/:id",
    component: EditBlog,
    meta: {
      auth: '+'
    }
  },
]

const Router = new VueRouter({
  mode: 'history',
  routes
})

Router.beforeResolve((to, from, next) => {
  const auth = to.matched[0].meta.auth
  if (auth == "+" && !localStorage["access-token"]) next({ name: 'auth.login' })
  else next()
})


export default Router