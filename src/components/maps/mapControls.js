/* eslint-disable */

const MODES = {
  POSITION: 0,
  AREA: 1,
  ROUTE: 2
}

let mode // Map control object

let markers = [] // Entity position
let areas = []  // Entity areas of visibility
let routes = []  // Entity route

let areaLine = { points: [] }   // Additional var to store not finished areas
let routeLine = { points: [] }  // Additional var to store not finished areas

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

  getMode () {
    return mode
  },

  init: (data) => {
    markers = data.markers
    areas = data.areas
    routes = data.routes

    areaLine = { points: [] }
    routeLine = { points: [] }
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
      } else if (mode === MODES.AREA) {
        areaLine.points.push(latLng)
        console.log(areaLine)
      }
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    }
  },

  marker: {
    moveTo (i, latLng) {
      markers[i].position = latLng
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    }
  },

  line: {
    setAt (pointId, latLng) {
      if (mode === MODES.AREA) {
        areaLine.points[pointId] = latLng
      } else if (mode === MODES.ROUTE) {
        routeLine.points[pointId] = latLng
      }
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    },
    insertAt (pointId, latLng) {
      if (mode === MODES.AREA) {
        areaLine.points.splice(pointId, 0, latLng)
      } else if (mode === MODES.ROUTE) {
        routeLine.points.splice(pointId, 0, latLng)
      }
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    },
    removeAt (pointId) {
      if (mode === MODES.AREA) {
        areaLine.points.splice(pointId, 1)
      } else if (mode === MODES.ROUTE) {
        routeLine.points.splice(pointId, 1)
      }
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    }
  },

  area: {
    create () {
      areas.push(areaLine)
      areaLine = { points: [] }
      return { markers, areas, routes, lines: [areaLine, routeLine] }
    },
    setAt (areaId, pointId, latLng) {
      areas[areaId].points[pointId] = latLng

      return { markers, areas, routes, lines: [areaLine, routeLine] }
    },
    insertAt (areaId, pointId, latLng) {
      areas[areaId].points.splice(pointId, 0, latLng)

      return { markers, areas, routes, lines: [areaLine, routeLine] }
    },
    removeAt (areaId, pointId) {
      areas[areaId].points.splice(pointId, 1)

      if (areas[areaId].points.length <= 1) {
        areas.splice(areaId, 1)
      }

      return { markers, areas, routes, lines: [areaLine, routeLine] }
    }
  },

  route: {}
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
