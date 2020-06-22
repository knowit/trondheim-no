import React from "react"
import Img from 'gatsby-image'
import { Link } from "gatsby"

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
      </div>
    </div>
  )
}

export default FrontpageColumns