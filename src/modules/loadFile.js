import Axios from 'axios'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default function uploadfile (context, callback) {
  var fd = new FormData()

  if (context.form.file) {
    fd.append('file', context.form.file)
    Axios.post(`${GeoHelperAPI}/upload`, fd, { headers: Auth.getAuthHeader(context) })
      .then(({ data }) => {
        callback(data.name)
      })
      .catch((data) => {
        context.snackbar = true
        context.message = data.message
        console.log(JSON.stringify(data))
        callback('no-file')
      })
  } else {
    fd.append('file', context.form.audioFile)
    var fd1 = new FormData()
    fd1.append('file', context.form.modelFile)

    Promise.all([
      Axios.post(`${GeoHelperAPI}/upload`, fd, { headers: Auth.getAuthHeader(context) }),
      Axios.post(`${GeoHelperAPI}/upload`, fd1, { headers: Auth.getAuthHeader(context) })
    ]).then((data) => {
      console.log(data)
      callback({ audio: data[0].data.name, model: data[1].data.name })
    }).catch((error) => {
      context.snackbar = true
      context.message = error.message
      console.log(JSON.stringify(error))
    })
  }
}
