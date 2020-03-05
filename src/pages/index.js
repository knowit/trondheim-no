import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/index.css"


const IndexPage = () => (
  <StaticQuery
    query={graphql`
    query {
      allFlamelinkListingPageContent (filter: { flamelink_locale: { eq: "no" } }) {
        edges {
          node {
            id
            navigationTitle
            navigationSubtitle
            slug
            thumbnail {
              url
            }
          }
        }
      }
      allFlamelinkFrontPageContent {
        edges {
          node {
            id
            imageDeck {
              title
              image {
                url
              }
            }
          }
        }
      }
    }
  `}
    render={data => (
      <div id="outer-container">

        <div id="header-container">
          <div id="header-image"
            style={{
              backgroundImage: "url(" + data.allFlamelinkFrontPageContent.edges[0].node.imageDeck
                .find(function (img) { return img.title === "Bybro" }).image[0].url + ")"
            }}>

            <h3>OFFISIELT NETTSTED FOR</h3>
            <h1>TRONDHEIM</h1>

          </div>

          <div id="header-subtext"><span>Vinterstemning ved Gamle bybro og bryggene langs Nidelva. Foto: Aziz Nasuti.</span></div>
        </div>

        <div id="content-container">
          <h2>Bli bedre kjent i Trondheim</h2>

          <div id="navigation-menu-container">
            {data.allFlamelinkListingPageContent.edges.map(function (node, key) {
              return (
                <div class="navigation-box-container">
                  <div class="navigation-box-thumbnail" style={{
                    backgroundImage: "url(" + node.node.thumbnail[0].url + ")"
                  }}></div>
                  <h2><a class="navigation-box-title" href={"/" + node.node.slug}>{node.node.navigationTitle}</a></h2>
                  <h4>{node.node.navigationSubtitle}</h4>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    )}
  />
)

export default IndexPage
