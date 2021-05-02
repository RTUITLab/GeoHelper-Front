import Axios from 'axios'
import router from '@/router'
import uploadFile from '@/modules/loadFile.js'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  loadModel (context, type) {
    context.changed = true

    if (type === 'audio') {
      context.audioSrc = URL.createObjectURL(context.form.audioFile)
    }
    if (type === 'model') {
      context.modelSrc = URL.createObjectURL(context.form.modelFile)
    }
  },
  createObject (context) {
    const map = context.$refs.modal.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name || !context.form.description || !context.form.audioFile || !context.form.modelFile) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    } else if (context.form.audioFile.size + context.form.modelFile.size > 52428000) {
      errors = ['Размер файлов больше 50МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      uploadFile(context, (names) => {
        const entity = map.getData()

        entity.name = context.form.name
        entity.description = context.form.description
        entity.type = 'excursion'

        entity.files = []
        entity.files.push({
          type: 'audio',
          url: GeoHelperAPI.split('/api')[0] + '/uploads/' + names.audio,
          fileName: context.form.audioFile.name
        })
        entity.files.push({
          type: 'model',
          url: GeoHelperAPI.split('/api')[0] + '/uploads/' + names.model,
          fileName: context.form.modelFile.name
        })

        Axios.post(`${GeoHelperAPI}/object`, entity, { headers: Auth.getAuthHeader(context) })
          .then(() => {
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

    console.log(context.item)

    context.form.name = context.item.name
    context.form.description = context.item.description

    let file = context.item.files.find((F) => F.type === 'model')
    if (file) {
      context.modelSrc = file.url
      context.form.modelFile = new File([], file.fileName, { type: 'application/zip' })
    }
    file = context.item.files.find((F) => F.type === 'audio')
    if (file) {
      context.audioSrc = file.url
      context.form.audioFile = new File([], file.fileName, { type: 'application/zip' })
    }
  },

  updateObject (context) {
    const map = context.$refs.modal.$refs.map

    // Check map data
    var errors = map.check()

    // Check form data
    if (!context.form || !context.form.name || !context.form.description || !context.form.audioFile || !context.form.modelFile) {
      errors = ['Не все поля заполнены']
      context.snackbar = true
    } else if (context.form.audioFile.size + context.form.modelFile.size > 52428000) {
      errors = ['Размер файлов больше 50МБ']
      context.snackbar = true
    }

    if (errors[0]) {
      context.snackbar = true
      context.message = errors[0]
    } else {
      const entity = map.getData()

      entity.name = context.form.name
      entity.description = context.form.description
      entity.type = 'excursion'
      entity._id = context.item._id

      if (context.changed) {
        console.log(context.form)
        Axios.delete(`${GeoHelperAPI}/delete_file`, { data: { url: context.item.files[0].url.split('/').pop() }, headers: Auth.getAuthHeader(context) })
        Axios.delete(`${GeoHelperAPI}/delete_file`, { data: { url: context.item.files[1].url.split('/').pop() }, headers: Auth.getAuthHeader(context) })
        uploadFile(context, (names) => {
          entity.files = []
          entity.files.push({
            type: 'audio',
            url: GeoHelperAPI.split('/api')[0] + '/uploads/' + names.audio,
            fileName: context.form.audioFile.name
          })
          entity.files.push({
            type: 'model',
            url: GeoHelperAPI.split('/api')[0] + '/uploads/' + names.model,
            fileName: context.form.modelFile.name
          })

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
        entity.files = context.item.files
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
  },

  getFileLink (context) {
    return `${GeoHelperAPI.split('/api')[0]}/uploads/${context.item.files.find((F) => F.type === 'model').url.split('/').pop()}`
  }
}
