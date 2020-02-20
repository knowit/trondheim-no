import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import "../style/navigation.css"
import { BurgerMenu } from "./menu.js"



export default () => (
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
      <div class="navigation-container">

        <BurgerMenu></BurgerMenu>

        <div class="logo-container">
          <Link id="trondheimno-link" to="/">TRONDHEIM.NO</Link>

          <div class="logo">
            <img alt="logo" src={data.allFlamelinkFrontPageContent.edges[0].node.imageDeck.find(function (img) {
              return img.title === "Logo"
            }).image[0].url}></img>
          </div>
        </div>
      </div>
    )}
  />
)

