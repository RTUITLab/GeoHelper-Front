//
//
//	File:	main.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-07 02:01:44
//	Updated:	2020-08-18 20:03:15
//
//

/*
 * Description:
 * Runs and mounts Vue app.
 */

import Vue from 'vue'
import App from './App'
import Auth from '@/components/pages/Auth'
import router from './router'
import VueCookie from 'vue-cookie'
import vuetify from '@/plugins/vuetify'
import '../node_modules/vuetify/dist/vuetify.min.css'

Vue.use(VueCookie)
Vue.config.productionTip = false
Auth.checkAuth(new Vue())

/* eslint-disable no-new */
const vm = new Vue({
  router,
  vuetify,
  components: { App },
  template: '<App/>'
})

vm.$mount('#app')
document.querySelector('#splash').remove()
