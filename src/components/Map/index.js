//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-11 20:04:08
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

// Modes of work with map
const modes = {
  SET_POSITION: 0,
  SET_AREA: 1
}

let map = ''
let line = ''
let areas = []
const marker = []

export default {
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
    if (marker[0]) {
      marker[0].setMap(null)
    }
    // eslint-disable-next-line
    marker[0] = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      draggable: true
    })

    marker[0].setMap(map)

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
      areas.forEach((area) => {
        area.setMap(null)
      })

      areas = []
    }

    const controlDiv = document.createElement('div')

    const firstChild = document.createElement('button')
    firstChild.style.backgroundColor = '#fff'
    firstChild.style.border = 'none'
    firstChild.style.outline = 'none'
    firstChild.style.width = '28px'
    firstChild.style.height = '28px'
    firstChild.style.borderRadius = '2px'
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
    firstChild.style.cursor = 'pointer'
    firstChild.style.marginRight = '10px'
    firstChild.style.padding = '0px'
    firstChild.title = 'Your Location'
    controlDiv.appendChild(firstChild)

    const secondChild = document.createElement('div')
    secondChild.style.margin = '5px'
    secondChild.style.width = '18px'
    secondChild.style.height = '18px'
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)'
    secondChild.style.backgroundSize = '180px 18px'
    secondChild.style.backgroundPosition = '0px 0px'
    secondChild.style.backgroundRepeat = 'no-repeat'
    secondChild.id = 'you_location_img'
    firstChild.appendChild(secondChild)

    firstChild.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // eslint-disable-next-line
          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
          marker[0].setPosition(latlng)
          context.position = { lat: position.coords.latitude, lng: position.coords.longitude }
          map.setCenter(latlng)
        })
      }
    })

    controlDiv.index = 1
    // eslint-disable-next-line
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv)
  },

  changeCoordinates (context, latLng) {
    if (context.mode === modes.SET_POSITION) {
      marker[0].setPosition(latLng)
      context.position = { lat: latLng.lat(), lng: latLng.lng() }
    }

    if (context.mode === modes.SET_AREA) {
      line.setPath(line.getPath().push(latLng))
    }
  },

  deletePoint (context, latLng) {
    if (context.mode === modes.SET_AREA) {
      const points = line.getPath()

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
    marker[0].setPosition({ lat: 0, lng: 0 })

    line.setPath([])

    areas.forEach((area) => {
      area.setMap(null)
    })

    areas = []
  },

  checkData (context) {
    const errors = []

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

  getData () {
    const data = { position: {
      lat: marker[0].getPosition().lat(),
      lng: marker[0].getPosition().lng()
    }, areas: []}

    data.areas = []
    areas.forEach((area) => {
      const points = []
      area.getPath().forEach((point) => {
        points.push({ lat: point.lat(), lng: point.lng() })
      })
      data.areas.push({ points: points })
    })

    return data
  },

  setData (context, data) {
    context.position = data.position
    marker[0].setPosition(context.position)

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
  },

  deleteMarkers () {
    marker.forEach((marker, i) => {
      if (i > 0) marker.setMap(null)
    })
    while (marker.length !== 1) {
      marker.pop()
    }
  },

  addMarker (position, name) {
    // eslint-disable-next-line
    let m = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      label: name[0],
      draggable: false
    })

    marker.push(m)
    marker[marker.length - 1].setMap(map)
  }
}
