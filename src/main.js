import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Init Google API
const script = document.createElement('script')
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_KEY}&callback=initMap&libraries=drawing`
script.async = true

window.initMap = () => {
  window.mapIsReady = true
}

document.head.appendChild(script)

// Init Vue app
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
