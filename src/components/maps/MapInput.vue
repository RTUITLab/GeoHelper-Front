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
        >
          <v-btn
            width="36"
            height="36"
            icon
            small
          ><v-icon style="padding: 4px">mdi-map-marker</v-icon></v-btn>
          <v-btn
            width="36"
            height="36"
            icon
            small
          ><v-icon>mdi-texture-box</v-icon></v-btn>
          <v-btn
            width="36"
            height="36"
            icon
            small
          ><v-icon>mdi-map-marker-path</v-icon></v-btn>
        </v-btn-toggle>
        <v-btn
          width="36"
          height="36"
          icon
          small
          style="margin-top: -6px"
          color="error"
          dark
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
  data: () => {
    return {
      mapIsReady: false
    }
  },
  created () {
    // Check if map is ready to showing
    const mapCallback = () => {
      setTimeout(() => {
        if (window.mapIsReady) {
          this.mapIsReady = true
          MapControls.init(this.$refs.map)
        } else {
          mapCallback()
        }
      }, 100)
    }

    mapCallback()
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
