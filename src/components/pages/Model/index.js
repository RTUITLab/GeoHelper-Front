/*
 * Desciption:
 * Manage model object.
 *
 * Functions:
 * LoadModel: loads model into the player.
 * SendFile: sends file to the server and starts object creating on the server.
 * CreateObject: creates new model.
 * FillFields: sets up fields while model is updating.
 * UpdateObject: updates existing object.
 */

import Axios from 'axios'
import router from '@/router'
import uploadFile from '@/modules/loadFile.js'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  loadModel (context) {
    context.changed = true

    context.modelSrc = URL.createObjectURL(context.form.file)
    console.log(context.modelSrc)
    console.log(context.form.file)
  },
  sendFile (context, file) {
    Axios.put(`${GeoHelperAPI}/upload_model`, { file: file }, { headers: Auth.getAuthHeader(context) })
      .then(({data}) => {
        console.log('200')
      })
      .catch(({data}) => {
        console.log('Not 200')
      })
  },
  createObject (context) {
    const map = context.$refs.modal.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name || !context.form.file) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    } else if (context.form.file.size > 26214000) {
      errors = ['Размер файла больше 25МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      uploadFile(context, (name) => {
        const entity = map.getData()

        entity.name = context.form.name
        entity.type = 'object'
        entity.url = GeoHelperAPI.split('/api')[0] + '/uploads/' + name

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
      })
    }
  },

  fillFields (context) {
    context.form.name = context.item.name
    context.form.file = new Blob([], { type: 'application/zip' })
    context.form.file.name = context.item.url.split('/').pop()
    context.modelSrc = context.item.url
    context.form.file = 'Файл'

    const map = context.$refs.modal.$refs.map
    map.setData(context.item)
  },

  updateObject (context) {
    const map = context.$refs.modal.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    } else if (context.form.file.size > 26214000) {
      errors = ['Размер файла больше 25МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      const entity = map.getData()

      entity.name = context.form.name
      entity.type = 'object'
      entity._id = context.item._id
      entity.url = context.item.url

      if (context.changed) {
        Axios.delete(`${GeoHelperAPI}/delete_file`, { data: { url: entity.url.split('/').pop() }, headers: Auth.getAuthHeader(context) })
        uploadFile(context, (name) => {
          entity.url = GeoHelperAPI.split('/api')[0] + '/uploads/' + name

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
        })
      } else {
        Axios.put(`${GeoHelperAPI}/object`, entity, { headers: Auth.getAuthHeader(context) })
          .then(({ data }) => {
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
}
