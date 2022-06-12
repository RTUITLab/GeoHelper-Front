/* eslint-disable */

const MODES = {
  POSITION: 0,
  AREA: 1,
  ROUTE: 2
}

export class MapControl {

  constructor (data) {
    this.returnState = () => {
      return {
        markers: this.markers,
        areas: this.areas,
        routes: this.routes,
        lines: [this.areaLine, this.routeLine]
      }
    }

    this.modes = {
      setPositionMode: () => {
        this.mode = MODES.POSITION
      },
      setAreaMode: () => {
        this.mode = MODES.AREA
      },
      setRouteMode: () => {
        this.mode = MODES.ROUTE
      }
    }

    this.markers = data.markers
    this.areas = data.areas
    this.routes = data.routes

    this.areaLine = { points: [] }
    this.routeLine = data.routes && data.routes.length ? data.routes[0] : { points: [] }

    if (this.markers) {
      this.mode = MODES.POSITION
    } else if (this.areas) {
      this.mode = MODES.AREA
    } else if (this.routes) {
      this.mode = MODES.ROUTE
    }

    this.map = {
      onClick: (latLng) => {
        if (this.mode === MODES.POSITION) {
          // Move marker to another place
          if (!this.markers) this.markers = new Array(1)
          this.markers[0] = { position: latLng }
        } else if (this.mode === MODES.AREA) {
          this.areaLine.points.push(latLng)
        } else if (this.mode === MODES.ROUTE) {
          this.routeLine.points.push(latLng)
          this.routes = [this.routeLine]
        }
        return this.returnState()
      }
    }

    this.marker = {
      moveTo: (i, latLng) => {
        this.markers[i].position = latLng
        return this.returnState()
      }
    }

    this.line = {
      setAt: (pointId, latLng) => {
        if (this.mode === MODES.AREA) {
          this.areaLine.points[pointId] = latLng
        } else if (this.mode === MODES.ROUTE) {
          this.routeLine.points[pointId] = latLng
          this.routes = [this.routeLine]
        }
        return this.returnState()
      },
      insertAt: (pointId, latLng) => {
        if (this.mode === MODES.AREA) {
          this.areaLine.points.splice(pointId, 0, latLng)
        } else if (this.mode === MODES.ROUTE) {
          this.routeLine.points.splice(pointId, 0, latLng)
          this.routes = [this.routeLine]
        }
        return this.returnState()
      },
      removeAt: (pointId) => {
        if (this.mode === MODES.AREA) {
          this.areaLine.points.splice(pointId, 1)
        } else if (this.mode === MODES.ROUTE) {
          this.routeLine.points.splice(pointId, 1)
          this.routes = [routeLine]
        }
        return this.returnState()
      }
    }

    this.area = {
      create: () => {
        this.areas.push(this.areaLine)
        this.areaLine = { points: [] }
        return this.returnState()
      },
      setAt: (areaId, pointId, latLng) => {
        this.areas[areaId].points[pointId] = latLng

        return this.returnState()
      },
      insertAt: (areaId, pointId, latLng) => {
        this.areas[areaId].points.splice(pointId, 0, latLng)

        return this.returnState()
      },
      removeAt: (areaId, pointId) => {
        this.areas[areaId].points.splice(pointId, 1)

        if (this.areas[areaId].points.length <= 1) {
          this.areas.splice(areaId, 1)
        }

        return this.returnState()
      }
    }

    this.route = {
      create: () => {
        this.routeLine = { points: [] }
        this.routes = []
        return this.returnState()
      },
      setAt: (routeId, pointId, latLng) => {
        this.routes[routeId].points[pointId] = latLng

        return this.returnState()
      },
      insertAt: (routeId, pointId, latLng) => {
        this.routes[routeId].points.splice(pointId, 0, latLng)

        return this.returnState()
      },
      removeAt: (routeId, pointId) => {
        this.routes[routeId].points.splice(pointId, 1)

        if (this.routes[routeId].points.length <= 1) {
          this.routes.splice(routeId, 1)
        }

        return this.returnState()
      }
    }
  }

  getMode () {
    return this.mode
  }

  clearMap () {
    this.markers = markers === undefined ? undefined : []
    this.areas = areas === undefined ? undefined : []
    this.routes = routes === undefined ? undefined : []
    this.areaLine = { points: [] }
    this.routeLine =  { points: [] }

    return this.returnState()
  }
}
