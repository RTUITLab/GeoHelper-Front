<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Интерактивная карта</v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>

    <v-card-text>
      <div>
        <map-input v-model="mapData" @input="sendPosition" :view="true"></map-input>
      </div>

      <v-divider style="margin-top: 16px"></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredObjects"
        :loading="loading"
        loading-text="Загрузка объектов"
        :items-per-page="5"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import MapInput from '../../components/maps/MapInput'
import { FETCH_OBJECTS } from '../../assets/globals'

export default {
  name: 'MapTest',
  components: { MapInput },
  data: () => {
    return {
      loading: true,
      headers: [
        { text: 'Название', align: 'start', value: 'name' },
        { text: 'Тип', value: 'pType' },
        { text: 'Широта', value: 'position.lat' },
        { text: 'Долгота', value: 'position.lng' }
      ],
      objects: {},
      filteredObjects: [],
      mapData: undefined,
      socket: {}
    }
  },
  async mounted () {
    this.socket = new WebSocket(process.env.VUE_APP_WS_PROTOCOL + '://' + process.env.VUE_APP_API.split('/')[2] + '/api/test')

    this.socket.onmessage = (res) => {
      this.filteredObjects = Object.values(JSON.parse(res.data)).reduce((accum, next) => {
        accum.push(...(next.map((obj) => ({
          name: obj.name,
          pType: obj.type,
          position: obj.position
        }))))
        return accum
      }, [])
    }

    this.objects = await this.$store.dispatch(FETCH_OBJECTS)
    this.mapData = {}
    this.mapData.areas = this.objects.reduce((prev, curr) => {
      prev.push(...curr.areas)
      return prev
    }, [])

    this.loading = false
  },
  methods: {
    sendPosition (e) {
      this.socket.send(JSON.stringify(e.position))
    }
  }
}
</script>

<style scoped>

</style>
