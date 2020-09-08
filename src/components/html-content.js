import React from "react"
import ReactDOMHelper from "../helpers/react-dom-helper"
import Img from "gatsby-image"
import Iframe from "react-iframe"
import { Online } from "react-detect-offline"

const HTMLContent = ({ htmlContent, resizeImg, dropShadow }) => {
  const reactComponent = ReactDOMHelper.buildReactComponent(
    htmlContent.content,
    (props, index) => {
      const imageNode = htmlContent.remoteImages
        ? htmlContent.remoteImages.find((n) => {
            return n.url === props.src
          })
        : null

      if (imageNode) {
        var styles = {}

        if (props.style) {
          styles = props.style
        }

        if (!resizeImg) {
          styles.maxWidth = imageNode.childImageSharp.fluid.presentationWidth
          styles.maxHeight = imageNode.childImageSharp.fluid.presentationHeight
        } else {
          styles.maxWidth = styles.width
          styles.maxHeight = styles.height
          styles.width = "auto"
          styles.height = "auto"
        }

        if (dropShadow) {
          styles.boxShadow = "0px 3px 5px lightgrey"
        }
        styles.margin = "1em 0"

        return (
          <div
            key={index}
            className="article-content-image-container"
            style={styles}
          >
            <Img
              className="article-content-image"
              fluid={imageNode.childImageSharp.fluid}
              alt={props.alt}
            ></Img>
          </div>
        )
      } else {
        return null
      }
    },
    (htmlNode, index) => {
      const props = htmlNode.props

      return (
        <div
          key={index}
          style={{
            width: props.width ? props.width : "100%",
            height: props.height ? props.height : "100%",
            border: "1px solid rgb(219, 219, 219)",
          }}
        >
          <Online>
            <Iframe
              url={props.src}
              height="100%"
              width="100%"
              className="react-iframe"
              display={props.display ? props.display : "initial"}
              position={props.position ? props.position : "relative"}
              frameBorder={props.frameBorder ? props.frameBorder : "0"}
            />
          </Online>
        </div>
      )
    }
  )

  return reactComponent
}

export default HTMLContent
