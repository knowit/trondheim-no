import React from "react"
import NotFound from "../templates/not-found"

const NotFoundPage = ({ pageContext, location }) => {
  return pageContext.layoutContext != null
    ? (<NotFound pageContext={pageContext} location={location} />)
    : (<div>404 not found</div>)
}

export default NotFoundPage