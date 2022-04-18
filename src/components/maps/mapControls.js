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
    markers = markers === undefined ? undefined : []
    areas = areas === undefined ? undefined : []
    routes = routes === undefined ? undefined : []
    areaLine = { points: [] }
    routeLine =  { points: [] }

    return { markers, areas, routes, lines: [areaLine, routeLine] }
  },

  map: {
    onClick (latLng) {
      if (mode === MODES.POSITION) {
        // Move marker to another place
        if (!markers) markers = new Array(1)
        markers[0] = { position: latLng }
      } else if (mode === MODES.AREA) {
        areaLine.points.push(latLng)
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