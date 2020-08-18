<template>
  <div>
    <v-row v-if="!test" id="icon-btns" align="left">
      <div>
        <v-btn-toggle
          class="btn-toggle"
          color="blue darken-2"
          mandatory
          group
        >
          <v-btn icon @click="mode = 0"><v-icon>mdi-map-marker-outline</v-icon></v-btn>
          <v-btn icon @click="mode = 1"><v-icon>mdi-vector-rectangle</v-icon></v-btn>
        </v-btn-toggle>
        <v-btn
          color="red darken-2"
          class="mb-2"
          outlined
          icon
          @click="clearMap"
        ><v-icon>mdi-restore</v-icon></v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col :id="!test ? 'map-cont' : ''">
        <div id="map" />
      </v-col>
      <v-col v-if="!test" :cols="3" class="pl-5" id="text-btns">
        <div class="headline pb-4" id="setup">Установить</div>
        <div>
          <v-btn-toggle
            class="btn-toggle"
            id="desktop"
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
  </div>
</template>

<script>
import Map from '@/components/Map'

export default {
  props: ['test'],
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
    },
    setData (data) {
      Map.setData(this, data)
    },
    showArea (points) {
      Map.showArea(points)
    },
    listenClicks (next) {
      Map.listenClicks(this, next)
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
  width: 100%;

  @include _1000 {
    width: auto;
  }
}

.btn-toggle#desktop {
  flex-direction: column;
}

#setup {
  color: $dark-blue
}

#text-btns {
  @include _1000 {
    display: none;
  }
}

#icon-btns {
  display: none;
  padding-left: 0;
  padding-right: 0;

  @include _1000 {
    display: flex;
  }
}

#map-cont {
  @include _1000 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
