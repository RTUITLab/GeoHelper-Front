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
