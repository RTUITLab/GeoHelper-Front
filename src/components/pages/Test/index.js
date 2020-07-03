import Axios from 'axios'
import Auth from '@/components/pages/Auth'
import runtimeEnv from '@mars/heroku-js-runtime-env'

const GeoHelperAPI = runtimeEnv().JS_RUNTIME_API || process.env.VUE_APP_API
const socket = new WebSocket('ws://' + GeoHelperAPI.split('/')[2])

export default {
  getAllObjects (context) {
    Axios.get(`${GeoHelperAPI}/objects`, { headers: Auth.getAuthHeader(context) })
      .then(({data}) => (this.showAreas(data, context)))

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)

      if (data.data) context.objects = data.data
    }
  },

  showAreas (data, context) {
    const map = context.$refs.map

    map.listenClicks(this.sendCoordinates)

    data.forEach((object, i, objects) => {
      object.areas.forEach((area, j, areas) => {
        map.showArea(area.points)
      })
    })
  },

  sendCoordinates (context, latLng) {
    socket.send(JSON.stringify(latLng))
  }
}
