import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import {
  CHECK_AUTH, DELETE_OBJECT, ENTITY_TYPES,
  FETCH_OBJECTS, GET_OBJECT_ONE, GET_OBJECTS, GET_TOKEN,
  INIT_APP, LOGIN, LOGOUT, REMOVE_OBJECT,
  SET_OBJECTS, SET_TOKEN, UPDATE_OBJECT, UPLOAD_FILE
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
    },
    [GET_OBJECT_ONE]: (state) => (_id) => {
      return state.objects.find((item) => item._id === _id)
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

    [UPLOAD_FILE]: async (s, file) => {
      const formData = new FormData()

      formData.append('file', file)
      try {
        const res = await axios.post('upload', formData)
        return res.data.name
      } catch (e) {
        throw new Error(`Не удалось отправить файл ${file.fileName}`)
      }
    },

    [FETCH_OBJECTS]: async ({ commit }) => {
      const data = (await axios.get('objects')).data.map((item) => {
        if (item.type === ENTITY_TYPES.TEXT) {
          item.pType = 'Текст'
          return item
        }
        if (item.type === ENTITY_TYPES.AUDIO) {
          item.pType = 'Аудио'
          item.audioFile = item.files[0]
          return item
        }
        if (item.type === ENTITY_TYPES.OBJECT) {
          item.pType = 'Модель'
          item.modelFile = item.files[0]
          return item
        }
        if (item.type === ENTITY_TYPES.EXCURSION) {
          item.pType = 'Экскурсионный'
          item.audioFile = item.files.find((file) => file.type === 'audio')
          item.modelFile = item.files.find((file) => file.type === 'model')
          return item
        }
      })

      if (data) {
        commit(SET_OBJECTS, data)
        return data
      }

      throw new Error('Не удалось загрузить список объектов')
    },

    [UPDATE_OBJECT]: async (s, item) => {
      try {
        const res = item._id
          ? await axios.put('object', item)
          : await axios.post('object', item)

        return res.data
      } catch (e) {
        throw new Error('Не удалось сохранить изменения')
      }
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

axios.defaults.baseURL = process.env.VUE_APP_API

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
