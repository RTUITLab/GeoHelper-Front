//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-11 20:04:08
//	Updated:	2020-08-17 08:45:14
//
//

/*
 * Description:
 * Component functionality
 *
 * Functions:
 * LoadMap: downloads JS Maps API sources.
 * Init: creates and configures map.
 * ChangeCoordinates: canges position of marker or adds new point to area
 *  depending on the mode.
 * DeletePoint: removes point from area.
 * FinishPolygon: creates polygon from line and flushes line.
 * Clear: resets marker position and flushes line and areas.
 * CheckData: is used to check received data before sending to the server.
 * GetData: prepares data to sending to the server.
 * SetData: extracts received data and shows it on the map.
 * ShowArea: shows one area on the map.
 * ListenClicks: sets up a function that willl be executed on click
 *
 * Note:
 * eslint-disable is used to avoid errors related with undefined variable google
 */

// Google Cloud Maps API Key
const key = process.env.VUE_APP_KEY

// Modes of work with map
const modes = {
  SET_POSITION: 0,
  SET_AREA: 1
}

var map = ''
var marker = ''
var line = ''
var areas = []

export default {
  loadMap (context) {
    if (document.getElementById('maps-script')) {
      this.init(context)
    } else {
      let script = document.createElement('script')
      script.onload = () => {
        this.init(context)
      }
      script.async = true
      script.defer = true
      script.setAttribute('id', 'maps-script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing`
      document.head.appendChild(script)
    }
  },

  init (context) {
    // Map initialization
    // eslint-disable-next-line
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.751244, lng: 37.618423},
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      draggableCursor: 'crosshair'
    })

    map.addListener('click', (e) => {
      this.changeCoordinates(context, e.latLng)
    })

    // Creating marker showing position of object
    if (marker) {
      marker.setMap(null)
    }
    // eslint-disable-next-line
    marker = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      draggable: true
    })

    marker.setMap(map)

    // Creating line used in creating polygons
    if (line) {
      line.setMap(null)
    }
    // eslint-disable-next-line
    line = new google.maps.Polyline({
      strokeColor: '#424242',
      strokeWeight: 2,
      editable: true
    })

    line.addListener('rightclick', (e) => {
      this.deletePoint(context, e.latLng)
    })

    line.addListener('click', (e) => {
      this.finishPolygon(context, e.latLng)
    })

    line.setMap(map)

    if (areas) {
      areas.forEach((area, i, areas) => {
        area.setMap(null)
      })

      areas = []
    }
  },

  changeCoordinates (context, latLng) {
    if (context.mode === modes.SET_POSITION) {
      marker.setPosition(latLng)
      context.position = { lat: latLng.lat(), lng: latLng.lng() }
    }

    if (context.mode === modes.SET_AREA) {
      line.setPath(line.getPath().push(latLng))
    }
  },

  deletePoint (context, latLng) {
    if (context.mode === modes.SET_AREA) {
      var points = line.getPath()

      points.forEach((point, i) => {
        if (point.lat() === latLng.lat() && point.lng() === latLng.lng()) {
          points.removeAt(i)
        }
      })

      line.setPath(points)
    }
  },

  finishPolygon (context, latLng) {
    if (context.mode === modes.SET_AREA) {
      const begining = line.getPath().getAt(0)
      if (begining.lat() === latLng.lat() && begining.lng() === latLng.lng()) {
        // eslint-disable-next-line
        const area = new google.maps.Polygon({
          path: line.getPath(),
          strokeColor: '#1976D2',
          strokeWeight: 2,
          fillColor: '#1976D2',
          fillOpacity: 0.4
        })

        line.setPath([])
        area.setMap(map)

        areas.push(area)
      }
    }
  },

  clear (context) {
    context.position = ''
    marker.setPosition({ lat: 0, lng: 0 })

    line.setPath([])

    areas.forEach((area, i, areas) => {
      area.setMap(null)
    })

    areas = []
  },

  checkData (context) {
    var errors = []

    // Check marker
    if (!context.position) {
      errors.push('Укажите координаты объекта')
    }

    // Check line and areas
    if (line.getPath().getAt(0)) {
      errors.push('Закончите создание областей')
    }

    if (areas.length === 0) {
      errors.push('Укажите области видимости')
    }

    return errors
  },

  getData (context) {
    const data = { position: {
      lat: context.position.lat,
      lng: context.position.lng
    }}

    data.areas = []
    areas.forEach((area, i, areas) => {
      const points = []
      area.getPath().forEach((point, j) => {
        points.push({ lat: point.lat(), lng: point.lng() })
      })
      data.areas.push({ points: points })
    })

    return data
  },

  setData (context, data) {
    context.position = data.position
    marker.setPosition(context.position)

    data.areas.forEach((area, i, a) => {
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
  },

  showArea (points) {
    // eslint-disable-next-line
    const poly = new google.maps.Polygon({
      path: points,
      strokeColor: '#1976D2',
      strokeWeight: 2,
      fillColor: '#1976D2',
      fillOpacity: 0.4,
      editable: false,
      clickable: false
    })

    poly.setMap(map)
    areas.push(poly)
  },

  listenClicks (context, next) {
    map.addListener('click', (e) => {
      next(context, {lat: e.latLng.lat(), lng: e.latLng.lng()})
    })
  }
}
