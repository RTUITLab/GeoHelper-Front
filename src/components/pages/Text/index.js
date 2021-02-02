//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-09 00:01:48
//	Updated:	2020-08-17 09:45:13
//
//

/*
 * Desciption:
 * Manage text object.
 *
 * Functions:
 * CreateObject: creates new text object.
 * FillFields: sets up fields while text object is updating.
 * UpdateObject: updates existing object.
 */

import Axios from 'axios'
import router from '@/router'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  createObject (context) {
    const map = context.$refs.modal.$refs.map

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

      Axios.post(`${GeoHelperAPI}/object`, entity, { headers: Auth.getAuthHeader(context) })
        .then(({data}) => {
          context.$parent.getAllObjects()
          context.validForm = true
          router.push('/')
        })
        .catch(({ data }) => {
          context.snackbar = true
          context.message = data.message
        })
    }
  },

  fillFields (context) {
    context.form.name = context.item.name
    context.form.description = context.item.description

    const map = context.$refs.modal.$refs.map
    map.setData(context.item)
  },

  updateObject (context) {
    const map = context.$refs.modal.$refs.map

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
      entity._id = context.item._id

      Axios.put(`${GeoHelperAPI}/object`, entity, { headers: Auth.getAuthHeader(context) })
        .then(({data}) => {
          context.$parent.getAllObjects()
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
