import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Navigation from "../components/navigation"
import "../style/layout.css"

export default ({ children }) => (
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
      <div id="layout-container">
        <Navigation id="navbar"
          logoUrl={data.allFlamelinkFrontPageContent.edges[0].node.imageDeck
            .find(function (img) { return img.title === "Logo" }).image[0].url}
        ></Navigation>

        <div id="children-container">
          {children}
        </div>
      </div>
    )}
  />
)
