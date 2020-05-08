import React, { Component } from 'react';
import { GoogleMap, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import styles from "../style/map.module.css"
import { Online, Offline } from "react-detect-offline"
import MapMarker from "./map-marker.js"


class Map extends Component {

    state = {
        isInfoOpen: false,
        selectedMarkerId: null,
        noOfClusters: null
    };

    onClick = (isInfoOpen, selectedMarkerId) => {
        this.setState({
            isInfoOpen,
            selectedMarkerId
        });
    };

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

        baseURL = baseURL + "&size=600x400&zoom=14&maptype=roadmap&markers=color:red|"

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

        const OnlineMap = ({ props }) => {
            return (
                <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_API}>
                    <div style={{ position: "relative" }}>
                        {this.createPersistentGoogleLink()}
                        <GoogleMap
                            id="article-map"
                            center={this.props.location}
                            zoom={this.props.zoom}
                            mapContainerStyle={{
                                height: "400px",
                                width: "100%"
                            }}>
                            <MarkerClusterer gridSize={60}>
                                {clusterer =>
                                    this.props.markers.map(markerData => (
                                        <MapMarker
                                            key={markerData.id}
                                            clusterer={clusterer}
                                            markerData={markerData}
                                            isSelected={markerData.id === this.state.selectedMarkerId}
                                            isInfoOpen={
                                                markerData.id === this.state.selectedMarkerId && this.state.isInfoOpen
                                            }
                                            onClick={this.onClick}
                                        />
                                    ))
                                }
                            </MarkerClusterer>
                        </GoogleMap>
                    </div>
                </LoadScript>
            )
        }


        return (
            <div className={styles.mapContainer}>
                <Online>
                    <OnlineMap />
                </Online>
                <Offline>
                    <img src={this.getGoogleStaticLink()} alt="Static map"></img>
                </Offline>

            </div>
        );
    }
};
export default Map;