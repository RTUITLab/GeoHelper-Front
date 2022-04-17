<template>
  <div>
    <v-skeleton-loader
      v-if="!mapIsReady"
      type="image"
    ></v-skeleton-loader>
    <v-toolbar class="map-control" dense>
      <v-toolbar-title>
        <v-btn-toggle
          color="primary"
          group
          mandatory
        >
          <v-btn
            width="36"
            height="36"
            icon
            small
            @click="mapControls.modes.setPositionMode()"
          ><v-icon style="padding: 4px">mdi-map-marker</v-icon></v-btn>
          <v-btn
            width="36"
            height="36"
            icon
            small
            @click="mapControls.modes.setAreaMode()"
          ><v-icon>mdi-texture-box</v-icon></v-btn>
          <v-btn
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
          @click="mapControls.clearMap()"
        ><v-icon>mdi-restore</v-icon></v-btn>
      </v-toolbar-title>
    </v-toolbar>
    <map-component
      v-if="mapIsReady"
      :start-pos="{ lat: this.mapData.markers[0].position.lat, lng: this.mapData.markers[0].position.lng }"
      :markers="[mapData.markers[0]]"
      :areas="mapData.areas"
      :lines="[mapControls.getMode() === 2 ? mapData.lines[1] : mapData.lines[0]]"
      @click="clickHandler"
    ></map-component>
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import MapControls from './mapControls'
import { CREATE_SNACHBAR, TARGETS } from '../../assets/globals'
import MapComponent from './MapComponent'

export default {
  name: 'MapInput',
  components: { MapComponent },
  props: ['value'],
  data: () => {
    return {
      mapIsReady: false,
      mapControls: MapControls,
      mapData: {}
    }
  },
  mounted () {
    this.mapControls.modes.setPositionMode()

    // Check if map is ready to showing
    const mapCallback = () => {
      setTimeout(() => {
        if (window.mapIsReady && this.value) {
          this.mapIsReady = true
          this.mapData = this.value
          this.mapData.markers = [{ position: this.mapData.position }] // TODO: remove, process in store
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
    },

    validate () {
      const result = this.mapControls.getData()
      if (result.error) {
        this.$root.$emit(CREATE_SNACHBAR, { text: result.error })
        return false
      } else {
        this.handleInput(result.data)
        this.mapData = result.data
      }
      return true
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
