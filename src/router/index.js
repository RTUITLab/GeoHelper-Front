//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-07 02:01:44
//	Updated:	2020-08-19 08:22:38
//
//

/*
 * Description:
 * Manage site paths
 */

import Vue from 'vue'
import Router from 'vue-router'
import * as Authorization from '@/components/pages/Auth'

// Pages
import Auth from '@/components/pages/Auth/Auth'
import Home from '@/components/pages/Home'
import Text from '@/components/pages/Text/Text'
import Audio from '@/components/pages/Audio/Audio'
import Test from '@/components/pages/Test/Test'
import Model from '@/components/pages/Model/Model'

// Pages elements
import Header from '@/components/Header'
import Map from '@/components/Map/Map'
import ViewModel from '../components/pages/ViewModel/ViewModel'

Vue.component('app-header', Header)
Vue.component('app-map', Map)

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
            default: false,
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
            default: false,
            container: true
          },
          meta: {
            requiredAuth: true
          }
        },
        {
          path: 'create-audio',
          components: {
            default: Home,
            container: Audio
          },
          props: {
            default: false,
            container: { item: '' }
          },
          meta: {
            requiredAuth: true
          }
        },
        {
          name: 'update-audio',
          path: 'update-audio',
          components: {
            default: Home,
            container: Audio
          },
          props: {
            default: false,
            container: true
          },
          meta: {
            requiredAuth: true
          }
        },
        {
          path: 'create-model',
          components: {
            default: Home,
            container: Model
          },
          props: {
            default: false,
            container: { item: '' }
          },
          meta: {
            requiredAuth: true
          }
        },
        {
          name: 'update-model',
          path: 'update-model',
          components: {
            default: Home,
            container: Model
          },
          props: {
            default: false,
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
    },
    {
      path: '/view/:fileName',
      name: 'ViewModel',
      component: ViewModel
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
