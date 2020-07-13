import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from "../layouts/layout"
import "../style/search.css"
import EllipsisText from "react-ellipsis-text"

const Search = ({ pageContext }) => {

  const [query, setQuery] = useState(``)
  const [results, setResults] = useState([])
  const [quantity, setQuantity] = useState('all')
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(
    () => {
      if (!query || !window.__LUNR__) {
        setResults([])
        return
      }
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

  const antall = [
    5, 10, 20, 50, 100
  ]

  const splitSearchResults = () => {
    var pageLength = quantity
    var pages = []
    var currentPage = []
    var index = 1

    if (quantity === 'all') {
      pages.push(results.map(r => {
        return { index: index++, value: r }
      }))
    }

    else {
      results.map(r => {
        currentPage.push({ index: index++, value: r })
        if (currentPage.length >= pageLength) {
          pages.push(currentPage)
          currentPage = []
        }
      })
      if (currentPage.length > 0) {
        pages.push(currentPage)
      }
    }
    return pages
  }

  const SearchResultItem = ({ url, title, content, index }) => (
    <div className="search-result-item">
      <b>{index}: <Link to={url}>{title}</Link></b>
      <p>
        <EllipsisText className="search-result-content-text" text={content} length={200} />
      </p>
    </div>
  )


  const SearchResultsPage = ({ page }) => {
    return (
      <div>
        {page.map(r => (
          <SearchResultItem
            key={r.index}
            url={r.value.url}
            title={r.value.title}
            content={r.value.content}
            index={r.index} />
        ))}
      </div>
    )
  }

  const SearchResults = () => {
    const pages = splitSearchResults()
    const page = pages[pageNumber] ? pages[pageNumber] : []
    var index = 0
    return (
      <div>
        <SearchResultsPage page={page} />
        {quantity === 'all' || pages.length <= 1 ? null : (
          <div>
            {pages.map(p => {
              return {
                index: index++,
                value: p
              }
            }).map(p => {
              return (
                <button key={p.index} onClick={e => setPageNumber(p.index)}>
                  {p.index + 1}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }





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

          <div>
            Vis antall:
            <select
              value={quantity}
              onChange={e => setQuantity(e.target.value)}>
              {antall.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option key={'all'} value={'all'}>Alle</option>
            </select>
          </div>

          <SearchResults />

        </div>
      </div>
    </Layout>
  )

}

export default Search