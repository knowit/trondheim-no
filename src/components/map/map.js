import React, { useState } from "react"
import { GoogleMap, MarkerClusterer } from "@react-google-maps/api"
import styles from "../../style/map.module.css"
import MapMarker from "./map-marker.js"

export default ({
  address,
  markers,
  locationMarker,
  persistentDisabled,
  zoom,
  height,
  width,
}) => {
  const getGoogleLink = () => {
    const baseURL = "https://www.google.com/maps/search/?api=1"
    if (address) {
      return baseURL + "&query=" + encodeURI(address)
    } else {
      return baseURL + "&query=" + locationMarker.lat + "," + locationMarker.lng
    }
  }

  const createPersistentGoogleLink = () => {
    if (persistentDisabled) return ""
    else {
      return (
        <a
          href={getGoogleLink()}
          style={{
            width: "68px",
            height: "26px",
            cursor: "pointer",
            marginLeft: "5px",
            marginRight: "5px",
            position: "absolute",
            left: "0",
            bottom: "0",
            zIndex: "1000001",
          }}
        >
          {" "}
        </a>
      )
    }
  }

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
      <div style={{ position: "relative" }}>{createPersistentGoogleLink()}</div>
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
