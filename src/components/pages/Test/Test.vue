<template>
  <div>
    <app-header />
    <router-view name="container"/>

    <v-card class="pt-12">
      <v-card-text>
        <app-map :test="true" ref="map" />
      </v-card-text>

      <v-card-title>
        Объекты
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="objects"
        :search="search"
      ></v-data-table>
    </v-card>
    <v-footer
      color="blue darken-2"
    >
      <v-spacer></v-spacer>
      <v-btn
        dark
        text
        @click="$router.push('/')"
      >Назад</v-btn>
    </v-footer>
  </div>
</template>

<script>
import Test from '@/components/pages/Test'

export default {
  data () {
    return {
      search: '',
      objects: [],
      headers: [
        { text: 'Название', value: 'name' },
        { text: 'Тип объекта', value: 'type' },
        { text: 'Описание', value: 'description' },
        { text: 'Широта', value: 'position.lat' },
        { text: 'Долгота', value: 'position.lng' }
      ]
    }
  },
  mounted () {
    Test.getAllObjects(this)
  },
  methods: {
  }
}
</script>
