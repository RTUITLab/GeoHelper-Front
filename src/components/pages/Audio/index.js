//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-21 12:47:48
//	Updated:	2020-08-19 11:15:59
//
//

/*
 * Desciption:
 * Manage text object.
 *
 * Functions:
 * LoadAudio: loads audio into the player.
 * SendFile: sends file to the server and starts object creating on the server.
 * CreateObject: creates new text object.
 * FillFields: sets up fields while text object is updating.
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
    console.log(context.form.file)
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
    const map = context.$refs.map

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
        entity.type = 'audio'
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
    context.form.file = 'Файл'

    const map = context.$refs.map
    map.setData(context.item)
  },

  updateObject (context) {
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
      entity._id = context.item._id

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
