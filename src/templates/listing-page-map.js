import React from "react"
import "../style/listing-page.css"
import Layout from "../layouts/layout"
import Map from "../components/map.js"
import LocalizationHelper from "../helpers/helpers"
import { Link } from "gatsby"

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
          <Map location={GetLocation(pageContext)} address={GetAddress(pageContext)} markers={pageContext.markers} zoom={14} persistentDisabled={false}
            width="100%" height="500px" />
          <div id="content-container">
            <h2>{pageContext.node.mapPageTitle}</h2>
            <p>{pageContext.node.mapPageDescription}</p>
            <Link to={pageContext.listingPagePath}>{LocalizationHelper.getLocalWord(pageContext.localization, "viewListingPageList", pageContext.locale)}</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ListingPageMap