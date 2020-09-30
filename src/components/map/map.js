import React, { useState } from "react"
import { GoogleMap, MarkerClusterer } from "@react-google-maps/api"
import styles from "../../style/map.module.css"
import MapMarker from "./map-marker.js"

export default ({
  markers,
  locationMarker,
  zoom,
  height,
  width,
}) => {
  if (!locationMarker) return ""

  const Cluster = () => {
    const [isInfoOpen, setInfoOpen] = useState(false)
    const [selectedMarkerId, setSelectedMarkerId] = useState(null)
    const onClick = (newIsInfoOpen, newSelectedMarkerId) => {
      setInfoOpen(newIsInfoOpen)
      setSelectedMarkerId(newSelectedMarkerId)
    }
    return (
      <MarkerClusterer gridSize={1}>
        {(clusterer) =>
          markers.map((markerData) => (
            <MapMarker
              key={markerData.id}
              clusterer={clusterer}
              markerData={markerData}
              isSelected={markerData.id === selectedMarkerId}
              isInfoOpen={markerData.id === selectedMarkerId && isInfoOpen}
              onClick={onClick}
            />
          ))
        }
      </MarkerClusterer>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <GoogleMap
        id="article-map"
        center={locationMarker}
        zoom={zoom}
        mapContainerStyle={{
          height,
          width,
        }}
      >
        <Cluster />
      </GoogleMap>
    </div>
  )
}
