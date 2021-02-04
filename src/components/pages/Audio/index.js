//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-21 12:47:48
//	Updated:	2020-08-27 16:43:26
//
//

/*
 * Desciption:
 * Manage audio object.
 *
 * Functions:
 * LoadAudio: loads audio into the player.
 * SendFile: sends file to the server and starts object creating on the server.
 * CreateObject: creates new audio object.
 * FillFields: sets up fields while audio object is updating.
 * UpdateObject: updates existing object.
 */

import Axios from 'axios'
import router from '@/router'
import uploadFile from '@/modules/loadFile.js'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  loadAudio (context) {
    context.changed = true

    context.audioSrc = URL.createObjectURL(context.form.file)
    console.log(context.audioSrc)
    console.log(context.form.file.name)
  },
  sendFile (context, file) {
    Axios.put(`${GeoHelperAPI}/upload_audio`, { file: file }, { headers: Auth.getAuthHeader(context) })
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
    } else if (context.form.file.size > 52428000) {
      errors = ['Размер файла больше 50МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      uploadFile(context, (name) => {
        const entity = map.getData()

        entity.name = context.form.name
        entity.type = 'audio'
        entity.url = GeoHelperAPI.split('/api')[0] + '/uploads/' + name
        entity.fileName = context.form.file.name

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
    const map = context.$refs.modal.$refs.map
    map.setData(context.item)

    context.form.name = context.item.name
    context.audioSrc = context.item.url
    context.form.file = new File([], context.item.fileName, { type: 'audio/*' })
  },

  updateObject (context) {
    const map = context.$refs.modal.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    } else if (context.form.file.size > 52428000) {
      errors = ['Размер файла больше 50МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      const entity = map.getData()

      entity.name = context.form.name
      entity.type = 'audio'
      entity._id = context.item._id
      entity.url = context.item.url

      if (context.changed) {
        Axios.delete(`${GeoHelperAPI}/delete_file`, { data: { url: entity.url.split('/').pop() }, headers: Auth.getAuthHeader(context) })
        uploadFile(context, (name) => {
          entity.url = GeoHelperAPI.split('/api')[0] + '/uploads/' + name
          entity.fileName = context.form.file.name

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
