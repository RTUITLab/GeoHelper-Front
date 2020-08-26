//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-24 00:19:53
//	Updated:	2020-08-19 11:15:59
//
//

/*
 * Desciption:
 * Sends file to server.
 */

import Axios from 'axios'
import Auth from '@/components/pages/Auth'

const GeoHelperAPI = process.env.VUE_APP_API

export default function uploadfile (context, callback) {
  var fd = new FormData()
  fd.append('file', context.form.file)
  Axios.post(`${GeoHelperAPI}/upload`, fd, { headers: Auth.getAuthHeader(context) })
    .then(({ data }) => {
      callback(data.name)
    })
    .catch((data) => {
      context.snackbar = true
      context.message = data.message
      console.log(JSON.stringify(data))
    })
}
