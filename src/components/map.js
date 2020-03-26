import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import styles from "../style/map.module.css"
import axios from "axios"

class Map extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const MapView = withScriptjs(withGoogleMap(props => (
            <GoogleMap
                defaultCenter = {this.props.location}
                defaultZoom = { 17 }
            >
                <Marker position={this.props.location} />
            </GoogleMap>
        )));
    return(
        <div className={styles.mapContainer}>
            <MapView
            containerElement={ <div style={{ height: `400px`, width: '100%' }} /> }
            mapElement={ <div style={{ height: `100%` }} /> }
            googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + process.env.GATSBY_GOOGLE_API + "&v=3.exp&libraries=geometry,drawing,places"}
            loadingElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
    }
};
export default Map;