import React from "react"


const ArticlePage = ({ pageContext }) => {
  return (
    <div id="outer-container">
      {pageContext.no.node.title}
    </div>
  )
}

export default ArticlePage

