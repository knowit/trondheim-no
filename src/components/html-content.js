
import React from "react"
import ReactDOMHelper from "../helpers/react-dom-helper"
import Img from "gatsby-image"

const HTMLContent = ({ htmlContent, resizeImg, dropShadow }) => {

  const reactComponent = ReactDOMHelper.buildReactComponent(htmlContent.content,
    (props, index) => {
      const imageNode = htmlContent.remoteImages ? htmlContent.remoteImages.find(n => {
        return n.url === props.src
      }) : null

      if (imageNode) {
        var styles = {}

        if (props.style) {
          styles = props.style
        }

        if (!resizeImg) {
          styles.maxWidth = imageNode.childImageSharp.fluid.presentationWidth
          styles.maxHeight = imageNode.childImageSharp.fluid.presentationHeight
        }
        else {
          styles.maxWidth = styles.width
          styles.maxHeight = styles.height
          styles.width = 'auto'
          styles.height = 'auto'
        }

        if (dropShadow) {
          styles.boxShadow = '0px 3px 5px lightgrey'
        }
        styles.margin = '1em 0'

        return <div key={index} className="article-content-image-container" style={styles}>
          <Img
            className='article-content-image'
            fluid={imageNode.childImageSharp.fluid}
            alt={props.alt}>
          </Img>
        </div>
      }
      else {
        return null
      }
    })

  return reactComponent
}

export default HTMLContent