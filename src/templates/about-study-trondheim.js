import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/page.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"

export default ({ data }) => {
  const ParsedHTML = () => {
    if (!data.node.content) {
      return null
    } else {
      return (
        <HTMLContent
          htmlContent={data.node.content}
          resizeImg={true}
          dropShadow={true}
        />
      )
    }
  }
  return (
      <div id="outer-container">
        test
      </div>
  )
}

export const query = graphql`
  query AboutStudyTrondheimQuery($nodeId: String) {
    node: flamelinkAboutStudyTrondheimContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      path
      
      localizedPaths {
        locale
        path
      }
      
      bannerImage {
        alt
        frontImage {
          localFile {
            childImageSharp {
              fluid(maxWidth: 2400, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
