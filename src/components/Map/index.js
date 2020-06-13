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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_KEY}&libraries=drawing`
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
    // eslint-disable-next-line
    marker = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      draggable: true
    })

    marker.setMap(map)

    // Creating line used in creating polygons
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
  }
}
