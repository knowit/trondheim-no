import React from "react"
import "../style/index.css"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'

const FrontpageColumns = ({ pageContext }) => {

  const backgroundStyle = {
    backgroundImage: `url(${pageContext.node.backdropImage[0].localFile.childImageSharp.fluid.src})`

  }

  return (
    <div id="frontpage-columns-container" style={backgroundStyle}>
      <div id="frontpage-columns-overlay">
        {pageContext.listingPages.map((node, key) => {
          if (node.showOnFrontpageColumns) {
            return (
              <div key={key} className="frontpage-column-item-container">
                <div className="frontpage-column-image-container"><Img className="frontpage-column-image"
                  fluid={node.thumbnail[0].localFile.childImageSharp.fluid}
                  alt="thumbnail" /></div>
                <div className="frontpage-column-info-container">
                  <h2><Link className="frontpage-column-title" to={`/${pageContext.slug}${(pageContext.slug.length > 0) ? '/' : ''}${node.slug}`}>{node.navigationTitle.toUpperCase()}</Link></h2>
                  <h4>{node.navigationSubtitle}</h4>
                </div>
              </div>
            )
          }
          else return null
        })}

        {pageContext.columnContent.map(node => {
          if (node.icon) {
            return (
              <div key={node.flamelink_id} className="frontpage-column-item-container">
                <div className="frontpage-column-image-container"><Img className="frontpage-column-image"
                  fluid={node.icon[0].localFile.childImageSharp.fluid}
                  alt="thumbnail" /></div>
                <div className="frontpage-column-info-container">
                  <h2><Link className="frontpage-column-title" to={node.redirectUrl}>{node.title.toUpperCase()}</Link></h2>
                  <h4>{node.subTitle}</h4>
                </div>
              </div>
            )
          }
          else return null
        })}

      </div>
    </div>
  )
}

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