import Axios from 'axios'
import router from '@/router'
import runtimeEnv from '@mars/heroku-js-runtime-env'

const GeoHelperAPI = runtimeEnv().JS_RUNTIME_API || process.env.VUE_APP_API

export default {
  user: { authorized: false },

  authorize (context, credentials, redirect) {
    if (!context.credentials || !context.credentials.username || !context.credentials.password) {
      context.message = 'Не все поля заполнены'
      context.snackbar = true
    } else {
      Axios.post(`${GeoHelperAPI}/auth`, credentials)
        .then(({data}) => {
          context.$cookie.set('token', data.token, 1)
          context.$cookie.set('user_id', data.user._id, 1)
          context.validLogin = true
          this.user.authorized = true

          if (redirect) router.push(redirect)
        })
        .catch(({ response: {data} }) => {
          context.snackbar = true
          context.message = data.message
        })
    }
  },

  signout (context, redirect) {
    context.$cookie.delete('token')
    context.$cookie.delete('user_id')
    this.user.authorized = false

    if (redirect) router.push(redirect)
  },

  checkAuth (context) {
    const token = context.$cookie.get('token')

    this.user.authorized = !!token
  },

  getAuthHeader (context) {
    return {'Authorization': `Bearer ${context.$cookie.get('token')}`}
  }
}
