import React, { useState } from "react"
import "../style/listing-page.css"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { Link, graphql } from "gatsby"
import GoogleMap from "../components/map.js"
import { Online, Offline } from "react-detect-offline"
import { Router } from "@reach/router"

const defaultLocation = {
  lat: 63.4305149,
  lng: 10.3950528
}

const defaultAddress = "Trondheim, Norway"

function getLocation(node) {

  if (node.latLong && node.latLong.latitude && node.latLong.longitude) {
    return { lat: Number(node.latLong.latitude), lng: Number(node.latLong.longitude) };
  }
  if (node.address && node.address.lat && node.address.lng) {
    return { lat: node.address.lat, lng: node.address.lng };
  }
  if (node.latitude && node.longitude) {
    return { lat: node.latitude, lng: node.longitude }
  }

  return defaultLocation
}

export default ({ pageContext, data }) => {

  console.log(data)
  const layoutContext = {
    locale: data.node.flamelink_locale,
    localizedPaths: data.node.localizedPaths
  }

  const markers = data.articlesLevel0.edges.concat(data.articlesLevel1.edges)
    .map(node => node.node).map(node => {
      return {
        id: node._fl_meta_.fl_id,
        title: node.title,
        url: node.path,
        location: getLocation(node),
        parent: node.parentListingPage.localTitle
      }
    })

  const tempMap = new Map()
  markers.map(marker => tempMap.set(marker.parent, true))
  const [subListingPages, setSubListingPages] = useState(tempMap)
  const updateSubListingPages = (key, value) => {
    setSubListingPages(new Map(subListingPages.set(key, value)))
  }

  const handleChange = (e, toggle = false) => {
    const item = e.target.name;
    const isChecked = (toggle) ? !e.target.checked : e.target.checked
    updateSubListingPages(item, isChecked)
  }


  var items = []

  subListingPages.forEach((value, key, map) => {
    items.push(
      <label className="map-checkbox-container" key={key}>
        <input
          name={key}
          aria-label={key}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          onKeyPress={(e) => { handleChange(e, true) }}></input>
        {key}

      </label>
    )
  })


  const MapComponent = () => {
    return (<span>
      <GoogleMap
        locationMarker={defaultLocation}
        address={defaultAddress}
        markers={markers.filter(marker => subListingPages.get(marker.parent))}
        zoom={13}
        persistentDisabled={false}
        width="100%" height="500px" />

      <div>
        <form className="map-checkbox-form">
          {items}
        </form>
      </div>
      <div id="content-container">
        <h2>{data.node.mapPageTitle}</h2>
        <p>{data.node.mapPageDescription}</p>
        <Link to={data.node.path}>{LocalizationHelper.getLocalWord(data.localization.translations, "viewListingPageList", data.node.flamelink_locale)}</Link>
      </div>
    </span>)
  }

  return (
    <Layout layoutContext={layoutContext}>
      <div id="outer-container">
        <div id="inner-container">
          <Online>
            <Router basepath={pageContext.mapPath}>
              <MapComponent path='/' />
            </Router>
          </Online>

          <Offline>
            <div id="content-container">
              <h2>{data.node.mapPageTitle}</h2>
              <p>{LocalizationHelper.getLocalWord(data.localization.translations, "not-available-offline", data.node.flamelink_locale)}</p>
              <Link to={data.node.path}>{LocalizationHelper.getLocalWord(data.localization.translations, "go-back", data.node.flamelink_locale)}</Link>
            </div>
          </Offline>

        </div>
      </div>
    </Layout>
  )
}


export const query = graphql`
  query ListingPageMapQuery($nodeId: String, $nodeFlamelinkId: String) {

    node: flamelinkListingPageContent (id: {eq: $nodeId}) {
      id
      flamelink_locale
      mapPageTitle
      mapPageDescription
      path
    }

    localization: flamelinkListingPageLocalizationContent (flamelink_locale: {eq: "no"}){
      id
      translations {
        key
        translations{
          language
          word
        }
      }
    }

    articlesLevel0: allFlamelinkArticleContent (filter: { parentListingPage: { id: {eq: $nodeFlamelinkId}}}){
      edges{
        node{
          id
          flamelink_locale
          title
          path

          _fl_meta_{
            fl_id
          }

          address {
            address
            lat
            lng
          }

          parentListingPage{
            id
            localTitle
          }

          latLong {
            latitude
            longitude
            googleMapsStaticImage {
              url
              childImageSharp {
                fluid (maxWidth: 600, quality: 80){
                  base64
                  aspectRatio 
                  src 
                  srcSet 
                  sizes
                  presentationWidth
                  presentationHeight
                  originalImg
                } 
              }
            }
          }
        }
      }
    }


    articlesLevel1: allFlamelinkArticleContent (filter: { parentListingPage: {parentListingPage: { id: {eq: $nodeFlamelinkId}}}}){
      edges{
        node{
          id
          flamelink_locale
          title
          path

          _fl_meta_{
            fl_id
          }

          address {
            address
            lat
            lng
          }

          parentListingPage{
            id
            localTitle
          }

          latLong {
            latitude
            longitude
            googleMapsStaticImage {
              url
              childImageSharp {
                fluid (maxWidth: 600, quality: 80){
                  base64
                  aspectRatio 
                  src 
                  srcSet 
                  sizes
                  presentationWidth
                  presentationHeight
                  originalImg
                } 
              }
            }
          }
        }
      }
    }


    subListingPages: allFlamelinkListingPageContent (filter: {parentListingPage: {id: {eq: $nodeFlamelinkId}}}){
      edges{
        node{
          id
          flamelink_id
          flamelink_locale
          path
          localTitle
          navigationTitle
        }
      }
    }
  }
`