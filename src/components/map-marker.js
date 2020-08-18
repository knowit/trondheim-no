import React from "react"

import { InfoWindow, Marker } from "@react-google-maps/api"
import { Link } from "gatsby"

export default class MapMarker extends React.Component {
  state = {
    mapMarker: null,
  }

  onLoad = (mapMarker) => {
    this.setState({
      mapMarker,
    })
  }

  onClick = () => {
    const { isInfoOpen, isSelected, markerData, onClick } = this.props

    const isOpen = isSelected ? !isInfoOpen : true

    onClick(isOpen, markerData.id)
  }

  renderInfoWindow = (markerId) => {
    const { isInfoOpen, isSelected, markerData } = this.props
    const { mapMarker } = this.state

    if (!isInfoOpen || !isSelected || !mapMarker) {
      return null
    }
    return (
      <InfoWindow anchor={mapMarker}>
        <div>
          <Link to={markerData.url}>{markerData.title}</Link>
        </div>
      </InfoWindow>
    )
  }

  render() {
    const { clusterer, markerData } = this.props

    return (
      <Marker
        clusterer={clusterer}
        onLoad={this.onLoad}
        onClick={this.onClick}
        position={{
          lat: markerData.location.lat,
          lng: markerData.location.lng,
        }}
      >
        {this.renderInfoWindow(markerData.id)}
      </Marker>
    )
  }
}
