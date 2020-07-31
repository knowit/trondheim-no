import React from "react"
import NotFound from "../templates/not-found"
import "../style/404.css"

const NotFoundPage = ({ pageContext, location }) => {
  return <NotFound 
  location={location}
  localizedPaths={pageContext.localizedPaths}
  locale={pageContext.locale} />
}

export default NotFoundPage