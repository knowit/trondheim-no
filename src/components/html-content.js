
import React from "react"
import ReactDOMHelper from "../helpers/react-dom-helper"
import Img from "gatsby-image"

const HTMLContent = ({ htmlContent }) => {

  const reactComponent = ReactDOMHelper.buildReactComponent(htmlContent,
    (props, index) => {
      const imageNode = pageContext.node.content.remoteImages.find(n => {
        return n.url === props.src
      })

      if (imageNode) {

        const styles = {

          width: imageNode.childImageSharp.fluid.presentationWidth,
          height: imageNode.childImageSharp.fluid.presentationHeight,
          margin: '1em 0'

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