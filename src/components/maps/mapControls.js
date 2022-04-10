/* eslint-disable */

const MODES = {
  POSITION: 0,
  AREA: 1,
  ROUTE: 2
}

let bindElement, map, mode // Map control oobjects

let marker = [] // Entity position
let areas = []  // Entity areas of visibility
let route = []  // Entity route

let areaLine = ''   // Additional var to store not finished areas
let routeLine = ''  // Additional var to store not finished areas

export default {
  modes: {
    setPositionMode: () => {
      mode = MODES.POSITION
      if (marker[0]) {
        marker[0].setDraggable(true)
      }

      if (areaLine) {
        areaLine.setMap(null)
      }

      if (routeLine) {
        routeLine.setMap(null)
      }
    },
    setAreaMode: () => {
      mode = MODES.AREA
      if (marker[0]) {
        marker[0].setDraggable(false)
      }

      if (areaLine) {
        areaLine.setMap(map)
      }

      if (routeLine) {
        routeLine.setMap(null)
      }
    },
    setRouteMode: () => {
      mode = MODES.ROUTE
      if (marker[0]) {
        marker[0].setDraggable(false)
      }

      if (areaLine) {
        areaLine.setMap(null)
      }

      if (routeLine) {
        routeLine.setMap(map)
      }
    }
  },

  init: (element, data) => {
    bindElement = element

    // eslint-disable-next-line
    map = new google.maps.Map(bindElement, {
      center: data.hasOwnProperty('position') ?
        { lat: data.position.lat, lng: data.position.lng } :
        { lat: 55.751244, lng: 37.618423 },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggableCursor: 'crosshair'
    })

    map.addListener('click', (e) => processCoordinate(e.latLng))

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

      poly.addListener('rightclick', (e) => {
        removePoint(poly, e.latLng)
      })

      poly.setMap(map)
      areas.push(poly)
    })

    // Setup lines
    areaLine = new google.maps.Polyline({
      strokeColor: '#424242',
      strokeWeight: 2,
      editable: true
    })

    areaLine.addListener('rightclick', (e) => {
      removePoint(areaLine, e.latLng)
    })

    areaLine.addListener('dblclick', (e) => {
      checkIfFinished(areaLine, e.latLng)
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

function removePoint (elem, latLng) {
  const points = elem.getPath()
  let pointToRemove = -1

  points.forEach((point, i) => {
    if (point.lat() === latLng.lat() && point.lng() === latLng.lng()) {
      pointToRemove = i
    }
  })

  if (pointToRemove !== -1) {
    points.removeAt(pointToRemove)
  }

  elem.setPath(points)
}

function checkIfFinished(elem, latLng) {
  if (mode === MODES.AREA) {
    const points = elem.getPath()
    const begining = points.getAt(0)
    const ending = points.getAt(points.getLength() - 1)

    if (
      begining.lat() === latLng.lat() && begining.lng() === latLng.lng() ||
      ending.lat() === latLng.lat() && ending.lng() === latLng.lng()
    ) {
      // eslint-disable-next-line
      const area = new google.maps.Polygon({
        path: points,
        strokeColor: '#1976D2',
        strokeWeight: 2,
        fillColor: '#1976D2',
        fillOpacity: 0.4,
        editable: true
      })

      areaLine.setPath([])
      area.addListener('rightclick', (e) => {
        removePoint(area, e.latLng)
      })
      area.setMap(map)

      areas.push(area)
    }
  }
}

function processCoordinate (latLng) {
  if (mode === MODES.POSITION) {
    marker[0].setPosition(latLng)
  } else if (mode === MODES.AREA) {
    areaLine.setPath(areaLine.getPath().push(latLng))
  }
}
