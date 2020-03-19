import React from "react"
import "../style/index.css"


const HomePage = ({ pageContext }) => {
  return (
    <div id="outer-container">
      <div id="header-container">


        <div id="header-image"
          style={{
            backgroundImage: "url(" + pageContext.no.node.imageDeck
              .find(function (img, key) { return img.title === "Bybro" }).image[0].url + ")"
          }}>

          <h3>{pageContext.no.node.headerText}</h3>
          <h1>{pageContext.no.node.headerFocusWord}</h1>

        </div>


        <div id="header-subtext"><span>Vinterstemning ved Gamle bybro og bryggene langs Nidelva. Foto: Aziz Nasuti.</span></div>
      </div>

      <div id="content-container">
        <h2>{pageContext.no.node.navigationText}</h2>

        <div id="navigation-menu-container">
          {pageContext.no.listingPages.map(function (node, key) {
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
  )
}

export default HomePage