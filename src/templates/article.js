import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/article.css"
import Map from "../components/map.js"

const ReactMarkdown = require("react-markdown")

const Article = ({pageContext}) => {
  return (
    <div id="outer-container">
      <div id="inner-container">
        <h2>{pageContext.no.node.title}</h2>
        <ReactMarkdown source={pageContext.no.node.content.content}></ReactMarkdown>
        {/*<Map locationString={pageContext.no.node.address}/>*/}
      </div>
    </div>
  )
}

export default Article
