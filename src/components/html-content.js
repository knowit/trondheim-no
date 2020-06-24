
import React from "react"
import ReactDOMHelper from "../helpers/react-dom-helper"
import Img from "gatsby-image"

const HTMLContent = ({ htmlContent, resizeImg, dropShadow }) => {

  const reactComponent = ReactDOMHelper.buildReactComponent(htmlContent.content,
    (props, index) => {
      const imageNode = htmlContent.remoteImages.find(n => {
        return n.url === props.src
      })

      if (imageNode) {

        var styles = {
          width: imageNode.childImageSharp.fluid.presentationWidth,
          height: imageNode.childImageSharp.fluid.presentationHeight,
          margin: '1em 0',
        }

        if (resizeImg) {
          styles.width = `${props.width}px`
          styles.height = `${props.height}px`
        }

        if (dropShadow) {
          styles.boxShadow = '0px 3px 5px lightgrey'
        }

        return <div key={index} className="article-content-image-container" style={styles}>
          <Img
            className='article-content-image'
            fluid={imageNode.childImageSharp.fluid}
            alt={props.alt}>
          </Img>
        </div>
      }
      else {
        return <div></div>
      }
    })

  return reactComponent
}

export default HTMLContent