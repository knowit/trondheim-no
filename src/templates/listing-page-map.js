import React from "react"
import "../style/listing-page.css"
import Layout from "../layouts/layout"
import Map from "../components/map.js"


// Default location
function GetLocation(pageContext) {
  return {
    lat: 63.4305149,
    lng: 10.3950528
  }
}

// Default address
function GetAddress(pageContext) {
  return "Trondheim, Norway"
}

const ListingPageMap = ({ pageContext }) => {

  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">
          <Map location={GetLocation(pageContext)} address={GetAddress(pageContext)} markers={pageContext.markers} zoom={13} persistentDisabled={false} />
        </div>
      </div>
    </Layout>
  )
}

export default ListingPageMap