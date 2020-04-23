import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import styles from "../style/map.module.css"
import { Online, Offline } from "react-detect-offline"
import { Image } from "gatsby-image"

class Map extends Component {

    getGoogleLink() {
        var address = this.props.address;
        var location = this.props.location;
        var baseURL = "https://www.google.com/maps/search/?api=1"
        if (this.props.address) {
            return baseURL + "&query=" + encodeURI(address);
        } else {
            return baseURL + "&query=" + location.lat + "," + location.lng;
        }
    }

    getGoogleStaticLink() {
        var address = this.props.address;
        var location = this.props.location;
        var baseURL = "https://maps.googleapis.com/maps/api/staticmap?"

        if (this.props.address) {
            baseURL = baseURL + "center=" + encodeURI(address);
        } else {
            baseURL = baseURL + "center=" + location.lat + "," + location.lng;
        }

        baseURL = baseURL + "&size=600x400&zoom=15&maptype=roadmap&markers=color:red|"

        if (this.props.address) {
            baseURL = baseURL + encodeURI(address);
        } else {
            baseURL = baseURL + location.lat + "," + location.lng;
        }
        return baseURL + "&key=" + process.env.GATSBY_GOOGLE_API
    }

    createPersistentGoogleLink() {
        if (this.props.persistentDisabled) return "";
        else {
            return <a href={this.getGoogleLink()} style={{ width: '68px', height: '26px', cursor: 'pointer', marginLeft: '5px', marginRight: '5px', position: "absolute", left: "0", bottom: "0", zIndex: "1000001" }}></a>
        }
    }

    render() {

        if (!this.props.location) return "";



        const OnlineMap = withScriptjs(withGoogleMap(props => (

            <div style={{ position: "relative" }}>
                {this.createPersistentGoogleLink()}
                <GoogleMap
                    defaultCenter={this.props.location}
                    defaultZoom={17}
                >
                    <Marker position={this.props.location} />
                </GoogleMap>
            </div>

        )))


        return (
            <div className={styles.mapContainer}>
                <Online>
                    <OnlineMap
                        containerElement={<div style={{ height: `400px`, width: '100%' }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + process.env.GATSBY_GOOGLE_API + "&v=3.exp&libraries=geometry,drawing,places"}
                        loadingElement={<div style={{ height: `100%` }} />}
                    />
                </Online>
                <Offline>
                    <img src={this.getGoogleStaticLink()}></img>
                </Offline>

            </div>
        );
    }
};
export default Map;