import Vue from 'vue'
import VueRouter from 'vue-router'
import DefaultLayout from '../components/layouts/DefaultLayout'
import EmptyLayout from '../components/layouts/EmptyLayout'
import Login from '../views/Login'
import store from '../store'
import ObjectsList from '../views/objects/ObjectsList'
import { CHECK_AUTH } from '../assets/globals'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '/',
        component: ObjectsList,
        meta: {
          secure: true
        }
      },
      {
        path: 'create',
        meta: {
          secure: true
        }
      },
      {
        path: 'map',
        meta: {
          secure: true
        }
      }
    ]
  },
  {
    path: '**',
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: '**',
        redirect: '/'
      }
    ],
    component: EmptyLayout
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.secure && !store.getters[CHECK_AUTH]) {
    next('/login')
  } else {
    next()
  }
})

export default router
