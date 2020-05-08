import React from "react";

import { InfoWindow, Marker } from "@react-google-maps/api";

export default class MapMarker extends React.Component {
  state = {
    mapMarker: null
  };

  onLoad = mapMarker => {
    this.setState({
      mapMarker
    });
  };

  onClick = () => {
    const { isInfoOpen, isSelected, markerData, onClick } = this.props;

    const isOpen = isSelected ? !isInfoOpen : true;

    onClick(isOpen, markerData.id);
  };

  renderInfoWindow = markerId => {
    const { isInfoOpen, isSelected, markerData } = this.props;
    const { mapMarker } = this.state;

    if (!isInfoOpen || !isSelected || !mapMarker) {
      return null;
    }

    return (
      <InfoWindow anchor={mapMarker}>
        <div>I am Marker {markerId}</div>
      </InfoWindow>
    );
  };

  render() {
    const { clusterer, markerData } = this.props;

    return (
      <Marker
        clusterer={clusterer}
        onLoad={this.onLoad}
        onClick={this.onClick}
        position={{
          lat: markerData.lat,
          lng: markerData.lng
        }}
      >
        {this.renderInfoWindow(markerData.id)}
      </Marker>
    );
  }
}