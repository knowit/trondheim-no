class GoogleMapsUrlHelper {
  static getAddress(node) {
    if (node.address && node.address.address) return node.address.address
    return null
  }

  static getLocation(node = null) {
    if (node == null) {
      return {
        lat: 63.4305149,
        lng: 10.3950528,
      }
    }
    if (node.latLong && node.latLong.latitude && node.latLong.longitude) {
      return {
        lat: Number(node.latLong.latitude),
        lng: Number(node.latLong.longitude),
      }
    }
    if (node.address && node.address.lat && node.address.lng) {
      return { lat: node.address.lat, lng: node.address.lng }
    }
    if (node.latitude && node.longitude) {
      return { lat: node.latitude, lng: node.longitude }
    }

    return null
  }

  static getMarker(node, url, parent = null) {
    if (!node) {
      return null
    }

    return {
      id: node._fl_meta_.fl_id,
      title: node.title,
      url: url,
      location: this.getLocation(node),
      parent: parent ? parent.localTitle : null,
    }
  }

  static getStaticMarkerData(node) {
    return {
      id: node._fl_meta_.fl_id,
      title: node.title,
      location: this.getLocation(node),
    }
  }

  static getImageDirectory() {
    return `./static/maps`
  }

  static createImageUrl(noApiUrl) {
    var parameters = noApiUrl.substr(noApiUrl.indexOf("?") + 1)
    var result = `./static/maps/${decodeURIComponent(parameters).trim(" ")}.png`
    result = result.split(":").join("]")
    result = result.split("|").join(")")
    return result
  }

  static createStaticGoogleMapUrl(location, markers = [], apiKey = true) {
    var parameters = new Map()

    var baseURL = "https://maps.googleapis.com/maps/api/staticmap"

    parameters.set("center", location.lat + "," + location.lng)
    parameters.set("size", "600x400")
    parameters.set("zoom", "14")
    parameters.set("maptype", "roadmap")

    if (markers.length > 0) {
      var markerString = "color:red"
      markers.map(
        (markerData) =>
          (markerString = `${markerString}|${markerData.location.lat},${markerData.location.lng}`)
      )
      parameters.set("markers", markerString)
    }

    if (apiKey) {
      parameters.set("key", process.env.GATSBY_GOOGLE_API)
    }

    var url = baseURL
    var first = true

    parameters.forEach((value, key, map) => {
      url = `${url}${first ? "?" : "&"}${key}=${value}`
      first = false
    })

    return url
  }
}

module.exports = { GoogleMapsUrlHelper }
