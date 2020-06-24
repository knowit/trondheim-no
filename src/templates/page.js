import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/page.css"

const Page = ({ pageContext }) => {
  return (<Layout layoutContext={pageContext.layoutContext}>
    <div id="outer-container">
      <div id="inner-container">
        <h1 id="page-title">{pageContext.node.title}</h1>
        <div><HTMLContent htmlContent={pageContext.node.content} resizeImg={true} dropShadow={true} /></div>
      </div>
    </div>
  </Layout>)
}

export default Page