import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import "../style/map.css"
import axios from "axios"

class Map extends Component {

    constructor(props) {
        super(props);
    }

    getLocation(locationString){
        console.log("locationString: " + locationString);
        
        URL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ locationString + "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + process.env.GATSBY_GOOGLE_API; 
        axios.get(URL)
        .then(response => {
            this.location = response.data.candidates[0];
            console.log(this.location);
        })
        .catch(error => {
            console.log("Error Thrown");
            console.log(error.message);
        })
    }


    render() {
        //FIXME: This might not return in time for the position to be set after.
        this.getLocation(this.props.locationString);
        const MapView = withScriptjs(withGoogleMap(props => (
            <GoogleMap
                defaultCenter = { this.location.geometry.location}
                defaultZoom = { 17 }
            >
                <Marker position={this.location.geometry.location} />
            </GoogleMap>
        )));
    return(
        <div className="mapContainer">
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