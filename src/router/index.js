import Vue from 'vue'
import Router from 'vue-router'
import * as Authorization from '@/components/pages/Auth'

// Pages
import Auth from '@/components/pages/Auth/Auth'
import Home from '@/components/pages/Home'
import Text from '@/components/pages/Text/Text'
import Test from '@/components/pages/Test/Test'

// Pages elements
import Header from '@/components/Header'
import Map from '@/components/Map/Map'

Vue.component('app-header', Header)
Vue.component('app-map', Map)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiredAuth: true
      },
      children: [
        {
          path: 'create-text',
          components: {
            default: Home,
            container: Text
          },
          props: {
            defaulst: false,
            container: { item: '' }
          },
          meta: {
            requiredAuth: true
          }
        },
        {
          name: 'update-text',
          path: 'update-text',
          components: {
            default: Home,
            container: Text
          },
          props: {
            defaulst: false,
            container: true
          },
          meta: {
            requiredAuth: true
          }
        }
      ]
    },
    {
      path: '/test',
      component: Test,
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/login',
      name: 'Auth',
      component: Auth
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    if (Authorization.default.user.authorized) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
