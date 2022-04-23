<template>
  <div>
    <v-skeleton-loader
      v-if="!mapIsReady"
      type="image"
    ></v-skeleton-loader>
    <v-toolbar class="map-control" dense v-if="!view">
      <v-toolbar-title>
        <v-btn-toggle
          color="primary"
          group
          mandatory
        >
          <v-btn
            v-if="mapData.markers"
            width="36"
            height="36"
            icon
            small
            @click="mapControls.modes.setPositionMode()"
          ><v-icon style="padding: 4px">mdi-map-marker</v-icon></v-btn>
          <v-btn
            v-if="mapData.areas"
            width="36"
            height="36"
            icon
            small
            @click="mapControls.modes.setAreaMode()"
          ><v-icon>mdi-texture-box</v-icon></v-btn>
          <v-btn
            v-if="mapData.routes"
            width="36"
            height="36"
            icon
            small
            @click="mapControls.modes.setRouteMode()"
          ><v-icon>mdi-map-marker-path</v-icon></v-btn>
        </v-btn-toggle>
        <v-btn
          width="36"
          height="36"
          icon
          small
          style="margin-top: -6px"
          color="error"
          @click="clearMap()"
        ><v-icon>mdi-restore</v-icon></v-btn>
      </v-toolbar-title>
    </v-toolbar>
    <map-component
      v-if="mapIsReady"
      :start-pos="this.mapData.markers && this.mapData.markers[0] && this.mapData.markers[0].position
        ? { lat: this.mapData.markers[0].position.lat, lng: this.mapData.markers[0].position.lng }
        : null"
      :markers="mapData.markers"
      :areas="mapData.areas"
      :routes="mapData.routes"
      :lines="[mapControls.getMode() === 2 ? mapData.lines[1] : mapData.lines[0]]"
      :view="view"
      @click="clickHandler"
      @change="changeHandler"
      @create="createHandler"
    ></map-component>
  </div>
</template>

<script>
import MapControls from './mapControls'
import { CHANGE_TYPES, CREATE_SNACHBAR, TARGETS } from '../../assets/globals'
import MapComponent from './MapComponent'

export default {
  name: 'MapInput',
  components: { MapComponent },
  props: ['value', 'view'],
  data: () => {
    return {
      mapIsReady: false,
      mapControls: MapControls,
      mapData: {}
    }
  },
  mounted () {
    this.$watch(
      'value',
      (val) => {
        if (val.markers) {
          this.mapData.markers = [this.mapData.markers[0], ...val.markers]
        }
      },
      { deep: true }
    )

    this.mapControls.modes.setPositionMode()

    // Wait until map is ready to showing
    const mapCallback = () => {
      setTimeout(() => {
        if (window.mapIsReady && this.value) {
          this.mapIsReady = true
          this.mapData = this.value
          this.mapData.lines = [{ points: [] }, { points: [] }]
          this.mapControls.init(this.mapData)
        } else {
          mapCallback()
        }
      }, 100)
    }

    mapCallback()
  },
  methods: {
    handleInput (data) {
      this.$emit('input', data)
    },

    clickHandler (e) {
      if (e.target.type === TARGETS.MAP) {
        this.mapData = this.mapControls.map.onClick(e.value)
      } else if (e.target.type === TARGETS.MARKER) {
        this.mapData = this.mapControls.marker.moveTo(e.target.index, e.value)
      }

      this.validate(true)
    },

    changeHandler (e) {
      if (e.target.type === TARGETS.LINE) {
        if (e.value.type === CHANGE_TYPES.SET) {
          this.mapData = this.mapControls.line.setAt(e.value.index, e.value.latLng)
        } else if (e.value.type === CHANGE_TYPES.INSERT) {
          this.mapData = this.mapControls.line.insertAt(e.value.index, e.value.latLng)
        } else if (e.value.type === CHANGE_TYPES.REMOVE) {
          this.mapData = this.mapControls.line.removeAt(e.value.index)
        }
      } else if (e.target.type === TARGETS.AREA) {
        if (e.value.type === CHANGE_TYPES.SET) {
          this.mapData = this.mapControls.area.setAt(e.target.index, e.value.index, e.value.latLng)
        } else if (e.value.type === CHANGE_TYPES.INSERT) {
          this.mapData = this.mapControls.area.insertAt(e.target.index, e.value.index, e.value.latLng)
        } else if (e.value.type === CHANGE_TYPES.REMOVE) {
          this.mapData = this.mapControls.area.removeAt(e.target.index, e.value.index)
        }
      }

      this.validate(true)
    },

    createHandler () {
      if (this.mapControls.getMode() === 1) {
        this.mapData = this.mapControls.area.create()
      } else if (this.mapControls.getMode() === 2) {
        this.mapData = this.mapControls.route.create()
      }

      this.validate(true)
    },

    clearMap () {
      this.mapData = this.mapControls.clearMap()
    },

    validate (silent = false) {
      const result = {
        position: this.mapData.markers ? {
          lat: this.mapData.markers[0].position.lat,
          lng: this.mapData.markers[0].position.lng
        } : undefined,
        areas: this.mapData.areas,
        routes: this.mapData.routes
      }

      let error = null

      if (!result.areas || !result.areas.length) {
        error = 'Не задана ни одна область видимости'
      }
      if (this.mapData.lines[0].length) {
        error = 'Не все области видимости или маршруты завершены'
      }
      // if (!routeLine || !routeLine.getPath().getLength()) {
      //   error = 'Не все маршруты завершены'
      // }

      if (error && !silent) {
        this.$root.$emit(CREATE_SNACHBAR, { text: error })
        return false
      } else {
        this.handleInput(result)
        return true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.map
  max-height: 60vh
  height: 500px

.map-control
  position: absolute
  z-index: 5
  margin: 4px
  border-radius: 4px

  button
    border-radius: 50% !important
</style>
