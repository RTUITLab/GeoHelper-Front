import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import {
  CHECK_AUTH, DELETE_OBJECT,
  FETCH_OBJECTS, GET_OBJECTS, GET_TOKEN,
  INIT_APP,
  LOGIN,
  LOGOUT, REMOVE_OBJECT,
  SET_OBJECTS,
  SET_TOKEN
} from '../assets/globals'

import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      accessToken: ''
    },
    objects: []
  },

  getters: {
    [CHECK_AUTH]: (state) => {
      return !!state.user.accessToken || sessionStorage.getItem('accessToken')
    },
    [GET_TOKEN]: (state) => {
      return state.user.accessToken
    },
    [GET_OBJECTS]: (state) => {
      return state.objects
    }
  },

  mutations: {
    [INIT_APP]: (state) => {
      const token = sessionStorage.getItem('accessToken')
      if (token) {
        state.user.accessToken = token
      }
    },
    [SET_TOKEN]: (state, token) => {
      sessionStorage.setItem('accessToken', token)
      state.user.accessToken = token
    },
    [SET_OBJECTS]: (state, objects) => {
      state.objects = objects
    },
    [REMOVE_OBJECT]: (state, _id) => {
      state.objects = state.objects.filter((item) => item._id !== _id)
    },
    [LOGOUT]: (state) => {
      state.user.accessToken = ''
      sessionStorage.removeItem('accessToken')
    }
  },

  actions: {
    [LOGIN]: async ({ commit }, {
      username,
      password
    }) => {
      if (!username || !password) {
        throw new Error('Не все поля заполнены')
      }

      const data = await axios.post('auth', {
        username,
        password
      })

      if (data && data.data) {
        commit(SET_TOKEN, data.data.token)
        return data.data.accessToken
      }

      throw new Error('Неизвестная ошибка')
    },

    [FETCH_OBJECTS]: async ({ commit }) => {
      const data = (await axios.get('objects')).data.map((item) => {
        if (item.type === 'text') {
          item.pType = 'Текст'
          return item
        }
        if (item.type === 'audio') {
          item.pType = 'Аудио'
          return item
        }
        if (item.type === 'object') {
          item.pType = 'Модель'
          return item
        }
        if (item.type === 'excursion') {
          item.pType = 'Экскурсионный'
          return item
        }
      })

      if (data) {
        commit(SET_OBJECTS, data)
        return data
      }

      throw new Error('Не удалось загрузить список объектов')
    },

    [DELETE_OBJECT]: async (s, _id) => {
      if (!s.state.objects.find((item) => item._id === _id)) {
        throw new Error('Не удалось найти объект')
      }

      await axios.delete('object', { data: { _id } })
      s.commit(REMOVE_OBJECT, _id)

      return true
    }
  },

  modules: {
  }
})

axios.defaults.baseURL = 'https://geohelper.rtuitlab.dev/api/v1'

axios.interceptors.request.use((config) => {
  config.headers.authorization = store.getters[GET_TOKEN]
  return config
})

axios.interceptors.response.use((responce) => {
  return responce
}, (error) => {
  if (error.response.status === 401) {
    router.push('/login')
  }
})

export default store
