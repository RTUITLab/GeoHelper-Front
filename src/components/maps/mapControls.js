let bindElement, map

export default {
  init: (element) => {
    console.log(element)
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

    console.log(map, bindElement)
  }
}
