import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import "../style/map.css"
class Map extends Component {
   render() {
   const Map = withScriptjs(withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { {lat: 63.430529, lng: 10.4005522} }
        defaultZoom = { 17 }
      >
          <Marker position={{lat: 63.430529, lng: 10.4005522}} />
      </GoogleMap>
   )));
   return(
      <div className="mapContainer">
        <Map
          containerElement={ <div style={{ height: `500px`, width: '100%' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBR-Sw6-B0RFZiukEytnASaOYJHiGstnCk&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
        />
      </div>
   );
   }
};
export default Map;
// "https://maps.googleapis.com/maps/api/js?key=" + process.env.GATSBY_GOOGLE_API + "&v=3.exp&libraries=geometry,drawing,places"