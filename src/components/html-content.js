
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

        console.log(JSON.stringify(imageNode))

        var styles = {}

        if (props.style) {
          styles = props.style
        }

        if (!resizeImg) {
          styles.width = imageNode.childImageSharp.fluid.presentationWidth
          styles.height = imageNode.childImageSharp.fluid.presentationHeight
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
        return <div></div>
      }
    })

  return reactComponent
}

export default HTMLContent