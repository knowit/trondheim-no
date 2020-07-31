import React from 'react'
import Search from "../templates/search-template"

const SearchPage = ({ pageContext, location }) => {

  return (
    <Search
    location={location}
    locale={pageContext.locale}
    localizedPaths={pageContext.localizedPaths} />
  )
}

export default SearchPage