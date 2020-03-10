import React from "react"
import "../style/listing-page.css"


const ListingPage = ({ pageContext }) => {
  return (
    <div id="outer-container">

      <div id="inner-container">

        <div id="articles-header">
          <h2>{pageContext.no.node.localTitle}</h2>
          <p>{pageContext.no.node.textOnPage}</p>
          <div id="map-button">Vis stedene i kart</div>
          <div id="english-button">This page in English</div>
        </div>



        <div id="all-tags-container">
          <div class="distinct-tag">
            ALLE
              </div>
          {pageContext.no.tags.map(function (tag, key) {
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
          {pageContext.no.articles.map(function (node, key) {
            return (
              <div class="article-container">
                <div class="article-thumbnail" style={{ backgroundImage: "url(" + node.node.thumbnail[0].url + ")" }}></div>
                <div class="article-info-container">
                  <h2><a href={node.node.parentContent.slug + "/" + node.node.slug}>{node.node.title}</a></h2>
                  <div class="tags-container">
                    {node.node.tags.map(function (tag, key) {
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
  )
}

export default ListingPage;