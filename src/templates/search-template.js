import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'

const Search = ({ pageContext }) => {

  const [query, setQuery] = useState(``)
  const [results, setResults] = useState([])

  useEffect(
    () => {
      if (!query || !window.__LUNR__) {
        setResults([])
        return
      }
      const lunrIndex = window.__LUNR__['en']
      const searchResults = lunrIndex.index.search(query)
      setResults(
        searchResults.map(({ ref }) => {
          return lunrIndex.store[ref]
        })
      )
    },
    [query]
  )


  return (

    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">

          <div>
            <input
              type='text'
              defaultValue={query}
              onChange={event => {
                setQuery(event.target.value)
              }}
            />
            <ul>
              {results.map(({ url, title }) => {
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