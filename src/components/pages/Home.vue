<template>
  <div>
    <app-header />
    <router-view name="container"/>

    <v-card class="pt-12">
      <v-card-title>
        Объекты
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="objects"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editObject(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteObject(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import Axios from 'axios'
import Auth from '@/components/pages/Auth'
import runtimeEnv from '@mars/heroku-js-runtime-env'

const GeoHelperAPI = runtimeEnv().JS_RUNTIME_API || process.env.VUE_APP_API

export default {
  data () {
    return {
      search: '',
      objects: [],
      headers: [
        { text: 'Название', value: 'name' },
        { text: 'Тип объекта', value: 'type', width: '30%' },
        { text: '', value: 'actions', sortable: false, align: 'right', width: '90px' }
      ]
    }
  },
  mounted () {
    this.getAllObjects()
  },
  methods: {
    getAllObjects () {
      Axios.get(`${GeoHelperAPI}/objects`, { headers: Auth.getAuthHeader(this) })
        .then(({data}) => (this.objects = data))
    },
    editObject (item) {},
    deleteObject (item) {
      Axios.delete(`${GeoHelperAPI}/object`, { headers: Auth.getAuthHeader(this), data: { _id: item._id } })
        .then((data) => {
          this.objects.forEach((obj, i, objects) => {
            if (obj._id === item._id) {
              objects.splice(i, 1)
              return true
            }
          })
        })
    }
  }
}
</script>
