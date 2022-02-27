/* eslint-disable */

let bindElement, map, mode, line // Map control oobjects

let marker = [] // Entity position
let areas = [] // Entity areas of visibility
let route = [] // Entity route

export default {
  modes: {
    setPositionMode: () => { mode = 0 },
    setAreaMode: () => { mode = 1 },
    setRouteMode: () => { mode = 2 }
  },
  init: (element, data) => {
    bindElement = element

    // eslint-disable-next-line
    map = new google.maps.Map(bindElement, {
      center: { lat: 55.751244, lng: 37.618423 },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggableCursor: 'crosshair'
    })

    // Setup marker
    if (marker[0]) {
      marker[0].setMap(null)
    }
    // eslint-disable-next-line
    marker[0] = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      draggable: true
    })
    marker[0].setMap(map)
    if (data.hasOwnProperty('position')) {
      marker[0].setPosition({ lat: data.position.lat, lng: data.position.lng })
    }

    // Setup areas
    if (areas) {
      areas.forEach((area) => {
        area.setMap(null)
      })
      areas = []
    }
    data.areas.forEach((area) => {
      // eslint-disable-next-line
      const poly = new google.maps.Polygon({
        path: area.points,
        strokeColor: '#1976D2',
        strokeWeight: 2,
        fillColor: '#1976D2',
        fillOpacity: 0.4,
        editable: true
      })
      poly.setMap(map)
      areas.push(poly)
    })

    // TODO route setup
  },

  clearMap() {
    if (marker[0]) {
      marker[0].setPosition(map.getCenter())
    }

    if (areas.length) {
      if (areas) {
        areas.forEach((area) => {
          area.setMap(null)
        })
        areas = []
      }
    }
  }
}
