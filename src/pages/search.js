import React from 'react'
import Search from "../templates/search-template"

const SearchPage = ({ pageContext, location }) => {

  return (
    <Search pageContext={pageContext} location={location} />
  )
}

export default SearchPage