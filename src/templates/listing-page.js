import React from "react"
import "../style/listing-page.css"
import Layout from "../layouts/layout"


const ListingPage = ({ pageContext }) => {
  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">

        <div id="inner-container">

          <div id="articles-header">
            <h2>{pageContext.node.localTitle}</h2>
            <p>{pageContext.node.textOnPage}</p>
            <div id="map-button">Vis stedene i kart</div>
            <div id="english-button">This page in English</div>
          </div>



          <div id="all-tags-container">
            <div class="distinct-tag">
              ALLE
              </div>
            {pageContext.tags.map(function (tag, key) {
              return (
                <div class="distinct-tag">
                  {tag.toUpperCase()}
                </div>
              )
            })}
          </div>



          <div id="sort-container">

            <div class="distinct-tag">STANDARD</div>
            <div class="distinct-tag">TITTEL</div>
            <div class="distinct-tag">DATO</div>
            <div class="distinct-tag">TILFELDIG</div>

          </div>



          <div id="articles-container">
            {pageContext.articles.map(function (node, key) {
              return (
                <div class="article-container">
                  <div class="article-thumbnail" style={{ backgroundImage: "url(" + node.thumbnail[0]?.url + ")" }}></div>
                  <div class="article-info-container">
                    <h2><a href={`/${pageContext.slugLocale}${pageContext.node.slug}/${node.slug}`}>{node.title}</a></h2>
                    <div class="tags-container">
                      {node.tags.map(function (tag, key) {
                        return (
                          <div class="tag">
                            <a>{tag}</a>
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