import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/listing-page.css"


const ListingPage = () => (
  <StaticQuery
    query={graphql`
    query {
      allFlamelinkArticleContent(filter: {parentContent: {slug: {eq: "severdig"}}}) {
        edges {
          node {
            slug
            parentContent {
              slug
              localTitle
            }
            openingHours
            tags
            thumbnail {
              url
            }
            title
          }
        }
      }
      allFlamelinkListingPageContent(filter: {slug: {eq: "severdig"}}) {
        edges {
          node {
            slug
            localTitle
            textOnPage
          }
        }
      }
    }
    
    
  `}
    render={data => (
      <div id="outer-container">
        <div id="inner-container">

          <div id="articles-header">
            <h2>{data.allFlamelinkListingPageContent.edges[0].node.localTitle}</h2>
            <p>{data.allFlamelinkListingPageContent.edges[0].node.textOnPage}</p>
          </div>

          <div id="articles-container">

            {data.allFlamelinkArticleContent.edges.map(function (node, key) {
              console.log(node)
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
    )}
  />
)

export default ListingPage