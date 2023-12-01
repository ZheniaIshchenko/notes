import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/notes-board/:name',
    name: 'notes-board',
    component: () => import('../views/NotesBoard.vue')
  },
  {
    path: '/',
    name: 'welcome-page',
    component: () => import('../views/WelcomePage.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
