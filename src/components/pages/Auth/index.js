//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-07 09:01:23
//	Updated:	2020-08-17 09:05:02
//
//

/*
 * Description:
 * Manage auth.
 *
 * Functions:
 * Authorize: logs in.
 * Signout: logs out.
 * CheckAuth: checks if user is authorized.
 * GetAuthHeader: returns complete request bearer header.
 */

import Axios from 'axios'
import router from '@/router'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  user: { authorized: false },

  authorize (context, credentials, redirect) {
    if (!context.credentials || !context.credentials.username || !context.credentials.password) {
      context.message = 'Не все поля заполнены'
      context.snackbar = true
    } else {
      Axios.post(`${GeoHelperAPI}/auth`, credentials)
        .then(({data}) => {
          context.$cookie.set('token', data.token, 1)
          context.$cookie.set('user_id', data.user._id, 1)
          context.validLogin = true
          this.user.authorized = true

          if (redirect) router.push(redirect)
        })
        .catch(({ response: {data} }) => {
          context.snackbar = true
          context.message = data.message
        })
    }
  },

  signout (context, redirect) {
    context.$cookie.delete('token')
    context.$cookie.delete('user_id')
    this.user.authorized = false

    if (redirect) router.push(redirect)
  },

  checkAuth (context) {
    const token = context.$cookie.get('token')

    this.user.authorized = !!token
  },

  getAuthHeader (context) {
    return {'Authorization': `Bearer ${context.$cookie.get('token')}`}
  }
}
