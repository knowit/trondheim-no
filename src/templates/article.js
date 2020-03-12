import React from "react"
import { StaticQuery, graphql } from "gatsby"
import "../style/article.css"

const ReactMarkdown = require("react-markdown")

const Article = ({pageContext}) => {
  return (
    <div>
      <h2>{pageContext.no.node.title}</h2>
      <ReactMarkdown source={pageContext.no.node.content.content}></ReactMarkdown>
    </div>
  )
}

export default Article
