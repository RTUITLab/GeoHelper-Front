//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-26 01:48:51
//	Updated:	2020-08-17 09:37:38
//
//

/*
 * Description:
 * Environment to test WebSocket functionality of server.
 *
 * Functions:
 * GetAllObjects: gets all objects from the server to show them on the site.
 * ShowAreas: shows all areas that are existing in objects.
 * SendCoordinates: sends coordinates of marker to the server.
 *
 * TODO: reconnect wss
 */

import Axios from 'axios'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API
const socket = new WebSocket('wss://' + GeoHelperAPI.split('/')[2])
var map = ''

export default {
  getAllObjects (context) {
    Axios.get(`${GeoHelperAPI}/objects`, { headers: Auth.getAuthHeader(context) })
      .then(({data}) => (this.showAreas(data, context)))

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)

      if (data.data) {
        context.objects = data.data

        map.deleteMarkers()
        data.data.forEach((object, i, objects) => {
          map.addMarker(object.position, object.name)
        })
      }
    }
  },

  showAreas (data, context) {
    map = context.$refs.map

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
