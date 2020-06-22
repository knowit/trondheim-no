import React from "react"
import "../style/index.css"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'
import FrontpageColumns from "../components/frontpage-columns"

export default ({ pageContext }) => {

  return <Layout layoutContext={pageContext.layoutContext}>
    <div id="outer-container">
      <div id="header-container">

        <BackgroundImage id="header-image" Tag="section" fluid={pageContext.node.frontImage[0].localFile.childImageSharp.fluid} alt={pageContext.node.frontImageAlt}>

          <h3>{pageContext.node.headerText}</h3>
          <h1>{pageContext.node.headerFocusWord}</h1>

        </BackgroundImage>


        <div id="header-subtext"><span>{pageContext.node.frontImageAlt}</span></div>
      </div>

      <div id="content-container">
        <h2>{pageContext.node.navigationText}</h2>

        <div id="navigation-menu-container">
          {pageContext.listingPages.map(function (node, key) {
            if (node.thumbnail[0].localFile && node.showOnFrontPage) {
              return (
                <div key={key} className="navigation-box-container">
                  <Img className="navigation-box-thumbnail"
                    fluid={node.thumbnail[0].localFile.childImageSharp.fluid}
                    alt="thumbnail" />
                  <h2><Link className="navigation-box-title" to={`/${pageContext.slug}${(pageContext.slug.length > 0) ? '/' : ''}${node.slug}`}>{node.navigationTitle}</Link></h2>
                  <h4>{node.navigationSubtitle}</h4>
                </div>)
            }
            else {
              return (<div key={key}></div>)
            }


          })}
        </div>

        <div>
          <FrontpageColumns pageContext={pageContext} />
        </div>



      </div>
    </div>
  </Layout>
}