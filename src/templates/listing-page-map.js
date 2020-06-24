import React from "react"
import "../style/listing-page.css"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { Link } from "gatsby"
import GoogleMap from "../components/map.js"

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

class ListingPageMap extends React.Component {

  constructor(props) {
    super(props)

    var subListingPages = new Map();

    props.pageContext.markers.map(marker => {
      if (marker.parent != null) {
        subListingPages.set(marker.parent, true)
      }
      return null
    })

    this.state = {
      subListingPages: subListingPages
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, toggle = false) {
    const item = e.target.name;
    const isChecked = (toggle) ? !e.target.checked : e.target.checked
    this.setState(prevState => ({ subListingPages: prevState.subListingPages.set(item, isChecked) }));

  }

  render() {

    var items = []
    var markers = []

    this.state.subListingPages.forEach((value, key, map) => {
      items.push(
        <label className="map-checkbox-container" key={key}>
          <input
            name={key}
            aria-label={key}
            type="checkbox"
            checked={value}
            onChange={this.handleChange}
            onKeyPress={(e) => { this.handleChange(e, true) }}></input>
          {key}

        </label>
      )
    })

    this.props.pageContext.markers.map(marker => {
      if (this.state.subListingPages.get(marker.parent)) {
        markers.push(marker)
      }
      return null
    })

    return (
      <Layout layoutContext={this.props.pageContext.layoutContext}>
        <div id="outer-container">
          <div id="inner-container">
            <GoogleMap location={GetLocation(this.props.pageContext)} address={GetAddress(this.props.pageContext)} markers={markers} zoom={13} persistentDisabled={false}
              width="100%" height="500px" />


            <div>
              <form className="map-checkbox-form">
                {items}
              </form>
            </div>


            <div id="content-container">
              <h2>{this.props.pageContext.node.mapPageTitle}</h2>
              <p>{this.props.pageContext.node.mapPageDescription}</p>
              <Link to={this.props.pageContext.listingPagePath}>{LocalizationHelper.getLocalWord(this.props.pageContext.localization, "viewListingPageList", this.props.pageContext.locale)}</Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

}


export default ListingPageMap