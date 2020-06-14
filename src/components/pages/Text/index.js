import Axios from 'axios'
import router from '@/router'
import Auth from '@/components/pages/Auth'
import runtimeEnv from '@mars/heroku-js-runtime-env'

const GeoHelperAPI = runtimeEnv().JS_RUNTIME_API || process.env.VUE_APP_API

export default {
  createObject (context) {
    const map = context.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name || !context.form.description) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      const entity = map.getData()

      entity.name = context.form.name
      entity.description = context.form.description
      entity.type = 'text'

      // eslint-disable-next-line
      console.log(entity)
      Axios.post(`${GeoHelperAPI}/object`, entity, { headers: Auth.getAuthHeader(context) })
        .then(({data}) => {
          context.validForm = true
          router.push('/')
        })
        .catch(({ data }) => {
          context.snackbar = true
          context.message = data.message
        })
    }
  }
}
