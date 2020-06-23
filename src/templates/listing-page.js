import React from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import SortableArticleView from "../components/article-list"

const ListingPage = ({ pageContext }) => {
  console.log("Listing page")
  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">

        <div id="inner-container">
          <div id="articles-header">
            <h2>{pageContext.node.localTitle}</h2>
            <p>{pageContext.node.textOnPage}</p>
            <Link id="map-button" to={pageContext.mapPath}>{LocalizationHelper.getLocalWord(pageContext.localization, "showOnMap", pageContext.locale)}</Link>
            <Link
              id="english-button"
              to={((pageContext.layoutContext.locale === 'no') ? pageContext.layoutContext.localizedPaths.en : pageContext.layoutContext.localizedPaths.no)}>
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