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
    <div class="map" ref="map"></div>
  </div>
</template>

<script>
import MapControls from './mapControls'

export default {
  name: 'MapInput',
  props: ['value'],
  data: () => {
    return {
      mapIsReady: false,
      mapControls: MapControls
    }
  },
  mounted () {
    this.mapControls.modes.setPositionMode()

    // Check if map is ready to showing
    const mapCallback = () => {
      setTimeout(() => {
        if (window.mapIsReady && this.value) {
          this.mapIsReady = true
          this.mapControls.init(this.$refs.map, this.value)
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
