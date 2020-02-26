import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/index.css"


const IndexPage = () => (
  <StaticQuery
    query={graphql`
  query {
    allFlamelinkFrontPageContent {
      edges {
        node {
          imageDeck {
            image {
              url
            }
            title
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

            <h3><span>OFFISIELT NETTSTED FOR</span></h3>
            <h1><span>TRONDHEIM</span></h1>

          </div>

          <div id="header-subtext"><span>Vinterstemning ved Gamle bybro og bryggene langs Nidelva. Foto: Aziz Nasuti.</span></div>

        </div>
      </div>
    )}
  />
)

export default IndexPage
