import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Task from '../views/Task.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const isAuthenticated = localStorage.getItem("user-token") || "";

const ifNotAuthenticated = (to, from, next) => {
  if (!isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (isAuthenticated) {
    next();
    return;
  }
  next("/login");
};


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/tareas',
    name: 'Task',
    component: Task,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/usuarios',
    name: 'User',
    component: User,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: ifAuthenticated
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
