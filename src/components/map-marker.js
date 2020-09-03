import React, { useState } from "react"

import { InfoWindow, Marker } from "@react-google-maps/api"
import { Link } from "gatsby"

export default ({ clusterer, markerData, isInfoOpen, isSelected, onClick }) => {
  const [mapMarker, setMapMarker] = useState(null)

  const onLoad = (newMapMarker) => {
    setMapMarker(newMapMarker)
  }

  const internalOnClick = () => {
    const isOpen = isSelected ? !isInfoOpen : true

    onClick(isOpen, markerData.id)
  }

  const renderInfoWindow = () => {
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

  return (
    <Marker
      clusterer={clusterer}
      onLoad={onLoad}
      onClick={internalOnClick}
      position={{
        lat: markerData.location.lat,
        lng: markerData.location.lng,
      }}
    >
      {renderInfoWindow(markerData.id)}
    </Marker>
  )
}
