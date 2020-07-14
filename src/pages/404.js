import React from "react"
import NotFound from "../templates/not-found"
import "../style/404.css"

const NotFoundPage = ({ pageContext, location }) => {
  return pageContext.layoutContext != null
    ? (<NotFound pageContext={pageContext} location={location} />)
    : null
}

export default NotFoundPage