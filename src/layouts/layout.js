import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Navigation from "../components/navigation"
import "../style/layout.css"

export default ({ children }) => (
  <StaticQuery
    query={graphql`
  query {
    allFlamelinkListingPageContent (filter: { flamelink_locale: { eq: "no" } }) {
      edges {
        node {
          id
          slug
          localTitle
          navigationTitle
        }
      }
    }
    allFlamelinkFrontPageContent (filter: { flamelink_locale: { eq: "no" } }) {
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
      <div id="layout-container">
        <Navigation id="navbar"
          logoUrl={data.allFlamelinkFrontPageContent.edges[0].node.imageDeck
            .find(function (img) { return img.title === "Logo" }).image[0].url}

          menuData={data.allFlamelinkListingPageContent.edges}
        ></Navigation>

        <div id="children-container">
          {children}
        </div>
      </div>
    )}
  />
)
