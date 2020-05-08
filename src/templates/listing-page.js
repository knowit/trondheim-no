import React from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import Img from "gatsby-image"


const ListingPage = ({ pageContext }) => {
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



          <div id="all-tags-container">
            <div class="distinct-tag">
              {LocalizationHelper.getLocalWord(pageContext.localization, "all", pageContext.locale)}
            </div>
            {pageContext.tags.map(function (tag, key) {
              return (
                <div class="distinct-tag">
                  {tag}
                </div>
              )
            })}
          </div>



          <div id="sort-container">
            <div class="distinct-tag">{LocalizationHelper.getLocalWord(pageContext.localization, "standard", pageContext.locale)}</div>
            <div class="distinct-tag">{LocalizationHelper.getLocalWord(pageContext.localization, "title", pageContext.locale)}</div>
            <div class="distinct-tag">{LocalizationHelper.getLocalWord(pageContext.localization, "date", pageContext.locale)}</div>
            <div class="distinct-tag">{LocalizationHelper.getLocalWord(pageContext.localization, "random", pageContext.locale)}</div>
          </div>



          <div id="articles-container">
            {pageContext.articles.map(function (node, key) {
              return (
                <div class="article-container">
                  <Img className="article-thumbnail" fluid={node.thumbnail[0]?.localFile.childImageSharp.fluid} />
                  <div class="article-info-container">
                    <h2><Link to={`${pageContext.parentPath}${pageContext.node.slug}/${node.slug}`}>{node.title}</Link></h2>
                    <div class="tags-container">
                      {node.tags.map(function (tag, key) {
                        return (
                          <div class="tag">
                            <a href="/">{tag}</a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default ListingPage;