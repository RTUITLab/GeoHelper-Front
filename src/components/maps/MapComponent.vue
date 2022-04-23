<template>
  <div class="map" ref="map"></div>
</template>

<script>
/* eslint-disable */

import {CHANGE_TYPES, TARGETS} from '../../assets/globals'

export default {
  name: 'MapComponent',
  props: [
    'startPos',
    'areas',
    'routes',
    'markers',
    'lines',
    'view'
  ],
  data: () => {
    return {
      loading: true,
      map: undefined,
      elements: {
        areas: [],
        routes: [],
        markers: [],
        lines: []
      }
    }
  },
  mounted () {
    const mapCallback = () => {
      setTimeout(() => {
        if (window.mapIsReady) {
          this.loading = false
          this.initMap()
          this.drawElements()
        } else {
          mapCallback()
        }
      }, 100)
    }

    mapCallback()
  },
  watch: {
    lines: {
      handler: function () {
        this.watchProps()
      },
      deep: true
    }
  },
  methods: {
    watchProps () {
      this.drawElements()
    },

    initMap () {
      const mapElem = this.$refs.map

      this.map = new google.maps.Map(mapElem, {
        center: this.startPos ?
          { lat: this.startPos.lat, lng: this.startPos.lng } :
          { lat: 55.751244, lng: 37.618423 },
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        draggableCursor: 'crosshair'
      })

      this.map.addListener('click', (e) => this.dispatchEvent(
        'click',
        { type: TARGETS.MAP, index: 0},
        { lat: e.latLng.lat(), lng: e.latLng.lng() }
      ))
    },

    drawElements () {
      this.clearMap()

      if (this.markers) {
        this.elements.markers = this.markers.map((marker, i) => {
          const mapMarker = new google.maps.Marker({
            position: marker.position,
            label: marker.title ? marker.title[0] : null,
            title: marker.title ? marker.title : null,
            draggable: !marker.title,
            map: this.map
          })

          if (mapMarker.getDraggable()) {
            mapMarker.addListener('dragend', (e) => this.dispatchEvent(
              'click',
              { type: TARGETS.MARKER, index: i},
              { lat: e.latLng.lat(), lng: e.latLng.lng() }
            ))
          }

          return mapMarker
        })
      }

      if (this.lines) {
        this.elements.lines = this.lines.map((line, i) => {
          const poly = new google.maps.Polyline({
            path: line.points,
            strokeColor: '#424242',
            strokeWeight: 2,
            editable: true,
            map: this.map
          })

          poly.addListener('rightclick', (e) => {
            let index = -1
            poly.getPath().forEach((point, i) => {
              if (point.lat() === e.latLng.lat() && point.lng() === e.latLng.lng()) {
                index = i
              }
            })

            if (index !== -1) {
              this.dispatchEvent(
                'change',
                { type: TARGETS.LINE, index: i },
                { type: CHANGE_TYPES.REMOVE, index: index}
              )
            }
          })

          poly.addListener('dblclick', (e) => {
            let index = -1
            poly.getPath().forEach((point, i) => {
              if (point.lat() === e.latLng.lat()) {
                index = i
              }
            })

            if (index === 0 || index === poly.getPath().getLength() - 1) {
              this.dispatchEvent('create')
            }
          })

          poly.getPath().addListener('insert_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.LINE, index: i },
              { type: CHANGE_TYPES.INSERT, index: e, latLng: {
                lat: poly.getPath().getAt(e).lat(),
                lng: poly.getPath().getAt(e).lng()
              }}
            )
          })

          poly.getPath().addListener('remove_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.LINE, index: i },
              { type: CHANGE_TYPES.REMOVE, index: e}
            )
          })

          poly.getPath().addListener('set_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.LINE, index: i },
              { type: CHANGE_TYPES.SET, index: e, latLng: {
                lat: poly.getPath().getAt(e).lat(),
                lng: poly.getPath().getAt(e).lng()
              }}
            )
          })

          return poly
        })
      }

      if (this.areas) {
        this.elements.areas = this.areas.map((area, i) => {
          const poly = new google.maps.Polygon({
            path: area.points,
            strokeColor: '#1976D2',
            strokeWeight: 2,
            fillColor: '#1976D2',
            fillOpacity: !this.view ? 0.4 : 0.2,
            editable: !this.view,
            clickable: false,
            map: this.map,
            draggable: false
          })

          poly.getPath().addListener('insert_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.AREA, index: i },
              { type: CHANGE_TYPES.INSERT, index: e, latLng: {
                lat: poly.getPath().getAt(e).lat(),
                lng: poly.getPath().getAt(e).lng()
              }}
            )
          })

          poly.getPath().addListener('remove_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.AREA, index: i },
              { type: CHANGE_TYPES.REMOVE, index: e}
            )
          })

          poly.getPath().addListener('set_at', (e) => {
            this.dispatchEvent(
              'change',
              { type: TARGETS.AREA, index: i },
              { type: CHANGE_TYPES.SET, index: e, latLng: {
                lat: poly.getPath().getAt(e).lat(),
                lng: poly.getPath().getAt(e).lng()}}
            )
          })

          poly.addListener('rightclick', (e) => {
            let index = -1
            poly.getPath().forEach((point, i) => {
              if (point.lat() === e.latLng.lat() && point.lng() === e.latLng.lng()) {
                index = i
              }
            })

            this.dispatchEvent(
              'change',
              { type: TARGETS.AREA, index: i },
              { type: CHANGE_TYPES.REMOVE, index: index}
            )
          })

          return poly
        })
      }

      // if (this.routes) {
      //   this.elements.lines = this.lines.map((route, i) => {
      //     const poly = new google.maps.Polyline({
      //       path: route.points,
      //       strokeColor: '#1976D2',
      //       strokeWeight: 2,
      //       editable: !this.view,
      //       clickable: false,
      //       map: this.map,
      //       draggable: false
      //     })
      //
      //     poly.getPath().addListener('insert_at', (e) => {
      //       this.dispatchEvent(
      //         'change',
      //         { type: TARGETS.ROUTE, index: i },
      //         { type: CHANGE_TYPES.INSERT, index: e, latLng: {
      //             lat: poly.getPath().getAt(e).lat(),
      //             lng: poly.getPath().getAt(e).lng()
      //           }}
      //       )
      //     })
      //
      //     poly.getPath().addListener('remove_at', (e) => {
      //       this.dispatchEvent(
      //         'change',
      //         { type: TARGETS.ROUTE, index: i },
      //         { type: CHANGE_TYPES.REMOVE, index: e}
      //       )
      //     })
      //
      //     poly.getPath().addListener('set_at', (e) => {
      //       this.dispatchEvent(
      //         'change',
      //         { type: TARGETS.ROUTE, index: i },
      //         { type: CHANGE_TYPES.SET, index: e, latLng: {
      //             lat: poly.getPath().getAt(e).lat(),
      //             lng: poly.getPath().getAt(e).lng()}}
      //       )
      //     })
      //
      //     poly.addListener('rightclick', (e) => {
      //       let index = -1
      //       poly.getPath().forEach((point, i) => {
      //         if (point.lat() === e.latLng.lat() && point.lng() === e.latLng.lng()) {
      //           index = i
      //         }
      //       })
      //
      //       this.dispatchEvent(
      //         'change',
      //         { type: TARGETS.ROUTE, index: i },
      //         { type: CHANGE_TYPES.REMOVE, index: index}
      //       )
      //     })
      //
      //     return poly
      //   })
      // }
    },

    clearMap () {
      this.elements.markers.forEach((marker) => marker.setMap(null))
      this.elements.areas.forEach((area) => area.setMap(null))
      this.elements.routes.forEach((route) => route.setMap(null))
      this.elements.lines.forEach((lines) => lines.setMap(null))
    },

    dispatchEvent (event, target, value) {
      this.$emit(event, { target, value })
    }
  }
}
</script>

<style lang="sass" scoped>
.map
  max-height: 60vh
  height: 500px
</style>
