import React from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import SortableArticleView from "../components/article-list"

export const query = graphql`
  query ListingPageQuery($nodeId: String) {
    flamelinkListingPageContent (id: {eq: $nodeId}) {
      id
      flamelink_locale
    }
  }
`

const ListingPage = ({ pageContext, data }) => {
  console.log(data)
  const MapButton = () => {
    if (pageContext.node.hasMapPage) {
      return (<Link id="map-button" to={pageContext.mapPath}>{LocalizationHelper.getLocalWord(pageContext.localization, "showOnMap", pageContext.locale)}</Link>)
    }
    else return null
  }
  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">

        <div id="inner-container">
          <div id="articles-header">
            <h2>{pageContext.node.localTitle}</h2>
            <p>{pageContext.node.textOnPage}</p>
            <MapButton />
            <Link
              id="english-button"
              to={pageContext.node.localizedPaths.find(item => item.locale !== pageContext.locale).path}>
              {LocalizationHelper.getLocalWord(pageContext.localization, "changeLanguage", pageContext.locale)}
            </Link>
          </div>

          <SortableArticleView pageContext={pageContext} />

        </div>
      </div>
    </Layout>
  )
}


export default ListingPage;