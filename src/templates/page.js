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
    <Layout
      locale={data.node.flamelink_locale}
      localizedPaths={data.node.localizedPaths}
    >
      <SEO
        title={data.node.title}
        locale={data.node.flamelink_locale}
        pageID={data.node._fl_meta_.fl_id}
      />

      <div id="outer-container">
        <div id="inner-container">
          <h1 id="page-title">{data.node.title}</h1>
          <div id="page-content-container">
            <ParsedHTML />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query PageQuery($nodeId: String) {
    node: flamelinkPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale

      _fl_meta_ {
        fl_id
      }

      path
      title

      localizedPaths {
        locale
        path
      }

      content {
        content
        remoteImages {
          url
          childImageSharp {
            fluid(maxWidth: 1200, quality: 80) {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }
    }
  }
`
