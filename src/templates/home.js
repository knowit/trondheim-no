import React from "react"
import "../style/index.css"
import Layout from "../layouts/layout"
import { Link } from "gatsby"


const HomePage = ({ pageContext }) => {
  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="header-container">


          <div id="header-image"
            style={{
              backgroundImage: "url(" + pageContext.node.imageDeck
                .find(function (img, key) { return img.title === "Bybro" }).image[0]?.url + ")"
            }} crossOrigin="anonymous">

            <h3>{pageContext.node.headerText}</h3>
            <h1>{pageContext.node.headerFocusWord}</h1>

          </div>


          <div id="header-subtext"><span>Vinterstemning ved Gamle bybro og bryggene langs Nidelva. Foto: Aziz Nasuti.</span></div>
        </div>

        <div id="content-container">
          <h2>{pageContext.node.navigationText}</h2>

          <div id="navigation-menu-container">
            {pageContext.listingPages.map(function (node, { key }) {
              return (
                <div class="navigation-box-container">
                  <div class="navigation-box-thumbnail" style={{
                    backgroundImage: "url(" + node.thumbnail[0]?.url + ")"
                  }}></div>
                  <h2><Link class="navigation-box-title" to={`/${pageContext.slug}${(pageContext.slug.length > 0) ? '/' : ''}${node.slug}`}>{node.navigationTitle}</Link></h2>
                  <h4>{node.navigationSubtitle}</h4>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default HomePage