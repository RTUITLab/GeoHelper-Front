/* eslint-disable */

const MODES = {
  POSITION: 0,
  AREA: 1,
  ROUTE: 2
}

let bindElement, map, mode // Map control oobjects

let markers = [] // Entity position
let areas = []  // Entity areas of visibility
let routes = []  // Entity route

let areaLine = { points: [] }   // Additional var to store not finished areas
let routeLine = ''  // Additional var to store not finished areas

export default {
  modes: {
    setPositionMode: () => {
      mode = MODES.POSITION
    },
    setAreaMode: () => {
      mode = MODES.AREA
    },
    setRouteMode: () => {
      mode = MODES.ROUTE
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

    // Setup areas
    if (areas) {
      areas.forEach((area) => {
        area.setMap(null)
      })
      areas = []
    }
    data.areas.forEach((area) => {
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

  clearMap () {
    if (areas.length) {
      if (areas) {
        areas.forEach((area) => {
          area.setMap(null)
        })
        areas = []
      }
    }
  },

  getData () {
    const data = {
      position: {
        lat: markers[0].position.lat(),
        lng: markers[0].position.lng()
      },
      areas: [],
      routes: []
    }

    let error = null

    if (!areas.length) {
      error = 'Не задана ни одна область видимости'
    }
    if (areaLine && areaLine.getPath().getLength()) {
      error = 'Не все области видимости завершены'
    }
    // if (!routeLine || !routeLine.getPath().getLength()) {
    //   error = 'Не все маршруты завершены'
    // }

    areas.forEach((A) => {
      const points = []
      A.getPath().forEach((point) => points.push({ lat: point.lat(), lng: point.lng() }))
      data.areas.push({ points })
    })

    return { data, error }
  },

  map: {
    onClick (latLng) {
      if (mode === MODES.POSITION) {
        // Move marker to another place
        markers[0] = { position: latLng }
      }
      return { markers, areas, routes }
    }
  },

  marker: {
    moveTo (i, latLng) {
      markers[i].position = latLng
      return { markers, areas, routes }
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
    // marker[0].setPosition(latLng)
  } else if (mode === MODES.AREA) {
    areaLine.setPath(areaLine.getPath().push(latLng))
  }
}
