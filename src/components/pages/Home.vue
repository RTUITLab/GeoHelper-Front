<template>
  <div>
    <app-header />
    <router-view name="container"/>
  </div>
</template>

<script>
import Axios from 'axios'
import Auth from '@/components/pages/Auth'
import runtimeEnv from '@mars/heroku-js-runtime-env'

const GeoHelperAPI = runtimeEnv().JS_RUNTIME_API || process.env.VUE_APP_API

export default {
  data () {
    return {
      users: [],
      t: false
    }
  },
  mounted () {
    this.getAllUsers()
  },
  methods: {
    getAllUsers (context) {
      Axios.get(`${GeoHelperAPI}/users`, { headers: Auth.getAuthHeader(this) })
        .then(({data}) => (this.users = data))
    }
  }
}
</script>
