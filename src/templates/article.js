import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/article.css"

const ReactMarkdown = require("react-markdown")

const Article = ({pageContext}) => {
  return (
    <div id="outer-container">
      <div id="inner-container">
        <h2>{pageContext.no.node.title}</h2>
        <ReactMarkdown source={pageContext.no.node.content.content}></ReactMarkdown>
      </div>
    </div>
    
  )
}

export default Article
