import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from "../layouts/layout"
import "../style/search.css"

const Search = ({ pageContext }) => {

  const [query, setQuery] = useState(``)
  const [results, setResults] = useState([])

  useEffect(
    () => {
      if (!query || !window.__LUNR__) {
        setResults([])
        return
      }
      console.log(pageContext)
      const lunrIndex = window.__LUNR__[pageContext.locale.split('-')[0]]
      const searchResults = lunrIndex.index.search(query)
      setResults(
        searchResults.map(({ ref }) => {
          return lunrIndex.store[ref]
        })
      )
    },
    [query]
  )


  const SearchResultQuantityText = ({ children }) => (
    <div id="search-result-quantity-container">
      <span>{`${pageContext.locale === 'no' ? 'Antall' : 'Total'}: `}</span>
      {children}
      <span>{pageContext.locale === 'no' ? ' resultater funnet.' : ' results found.'}</span>
    </div>
  )

  const SearchResultQuantity = () => (
    <div id="search-result-quantity-number-container" >
      <div id="search-result-quantity-number">
        {results.length}
      </div>
    </div>
  )


  return (

    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">

          <div id="search-input-container">
            <input
              type='text'
              defaultValue={query}
              onChange={event => {
                setQuery(event.target.value)
              }}
            />
          </div>

          <SearchResultQuantityText>
            <SearchResultQuantity />
          </SearchResultQuantityText>

          <div id="search-result-quantity-container">

          </div>

          <div>
            <ul>
              {results.map(({ url, title }) => {
                console.log(results)
                return (
                  <li key={url}>
                    <Link to={url}>{title}</Link>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>
      </div>
    </Layout>
  )

}

export default Search