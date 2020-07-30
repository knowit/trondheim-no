import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/page.css"
import { graphql } from "gatsby"

export const query = graphql`
  query PageQuery($nodeId: String) {
    flamelinkPageContent (id: {eq: $nodeId}) {
      id
      flamelink_locale
    }
  }
`

const Page = ({ pageContext, data }) => {
  console.log(data)

  const ParsedHTML = () => {
    if (!pageContext.node.content) {
      return null
    }
    else {
      return (
        <HTMLContent htmlContent={pageContext.node.content} resizeImg={true} dropShadow={true} />
      )
    }
  }

  return (<Layout layoutContext={pageContext.layoutContext}>
    <div id="outer-container">
      <div id="inner-container">
        <h1 id="page-title">{pageContext.node.title}</h1>
        <div id="page-content-container">
          <ParsedHTML />
        </div>
      </div>
    </div>
  </Layout>)
}

export default Page