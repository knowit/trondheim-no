import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import styles from "../style/map.module.css"

class Map extends Component {

    getGoogleLink(trueIfAddress) {
        var address = this.props.address;
        var location = this.props.location;
        var baseURL = "https://www.google.com/maps/search/?api=1"
        if (trueIfAddress) {
            return baseURL + "&query=" + encodeURI(address);
        } else {
            return baseURL + "&query=" + location.lat + "," + location.lng;
        }
    }

    createPersistentGoogleLink() {
        if (this.props.persistentDisabled) return "";
        else {
            return <a href={this.getGoogleLink(true)} style={{ width: '68px', height: '26px', cursor: 'pointer', marginLeft: '5px', marginRight: '5px', position: "absolute", left: "0", bottom: "0", zIndex: "1000001" }}></a>
        }
    }

    render() {
        const MapView = withScriptjs(withGoogleMap(props => (
            <div style={{ position: "relative" }}>
                {this.createPersistentGoogleLink()}
                <GoogleMap
                    defaultCenter={this.props.location}
                    defaultZoom={17}
                >
                    <Marker position={this.props.location} />
                </GoogleMap>
            </div>
        )));
        return (
            <div className={styles.mapContainer}>
                <MapView
                    containerElement={<div style={{ height: `400px`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + process.env.GATSBY_GOOGLE_API + "&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={<div style={{ height: `100%` }} />}
                />
            </div>
        );
    }
};
export default Map;