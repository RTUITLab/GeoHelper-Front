<template>
  <v-row>
    <v-col :cols="9">
      <div id="map" />
    </v-col>
    <v-col :cols="3" class="pl-5">
      <div class="headline pb-4" id="setup">Установить</div>
      <div>
        <v-btn-toggle
          class="btn-toggle"
          color="blue darken-2"
          mandatory
        >
          <v-btn @click="mode = 0">Координаты объекта</v-btn>
          <v-btn @click="mode = 1">Зоны видимости</v-btn>
        </v-btn-toggle>
        <v-btn
          color="red darken-2"
          class="mt-4"
          outlined
          width="100%"
          @click="clearMap"
        >Очистить карту</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Map from '@/components/Map'

export default {
  data () {
    return {
      map: '',
      position: '',
      mode: 0
    }
  },
  mounted () {
    Map.loadMap(this)
  },
  methods: {
    clearMap () {
      Map.clear(this)
    },
    check () {
      return Map.checkData(this)
    },
    getData () {
      return Map.getData(this)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';

#map {
  height: 400px;
  border-radius: 5px;
  border: $dark-blue 2px solid;
}
.btn-toggle {
  flex-direction: column;
  width: 100%
}
#setup {
  color: $dark-blue
}
</style>
