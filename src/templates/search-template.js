import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from "../layouts/layout"
import "../style/search.css"
import EllipsisText from "react-ellipsis-text"
import { Router } from "@reach/router"

const Search = ({ pageContext, location }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [quantity, setQuantity] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [locationHref, setLocationHref] = useState(location.href)
  const antall = [5, 10, 20, 50, 100]
  const locale = pageContext.locale.split('-')[0]


  // Only re-run if query changes
  useEffect(() => {
    if (!query || !window.__LUNR__) {
      setResults([])
      setQuery('')
      return
    }

    const lunrIndex = window.__LUNR__[locale]
    const searchResults = lunrIndex.index.search(query)
    setResults(
      searchResults.map(({ ref }) => {
        return lunrIndex.store[ref]
      })
    )

    if (quantity === 'all' || quantity === 'alle' || pageNumber < 0) {
      setPageNumber(0)
    }
    else if (pageNumber !== 0) {
      const maxPage = Math.ceil(results.length / quantity)
      if (pageNumber >= maxPage) {
        setPageNumber(maxPage - 1)
      }
    }
  }, [query])

  // Make sure page number is valid upon change
  useEffect(() => {
    if (quantity === 'all' || quantity === 'alle' || pageNumber < 0) {
      setPageNumber(0)
    }
    else if (pageNumber != 0) {
      const maxPage = Math.ceil(results.length / quantity)
      if (pageNumber >= maxPage) {
        setPageNumber(maxPage - 1)
      }
    }
  }, [quantity, pageNumber])

  const maxPageNumber = () => {
    return Math.ceil(results.length / quantity)
  }

  // Only re-run if locationHref changes
  useEffect(() => {
    const url = new URL(locationHref)

    const urlQuantity = url.searchParams.get('quantity')
    const urlQuery = url.searchParams.get('query')
    const urlPage = url.searchParams.get('page')

    if (urlQuery != null) {
      setQuery(urlQuery)
      const lunrIndex = window.__LUNR__[locale]
      const searchResults = lunrIndex.index.search(urlQuery)
      setResults(
        searchResults.map(({ ref }) => {
          return lunrIndex.store[ref]
        })
      )
    }
    if (urlQuantity != null) {
      setQuantity(urlQuantity)
    }
    if (urlPage != null) {
      setPageNumber(urlPage - 1)
    }
  },
    [locationHref])




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
        return null
      })
      if (currentPage.length > 0) {
        pages.push(currentPage)
      }
    }
    return pages
  }

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

  const SearchResultItem = ({ url, title, content, index }) => (
    <div className="search-result-item">
      <b>{index}.
      <Link to={url}>
          <EllipsisText className="search-result-content-text" text={title} length={100} />
        </Link>
      </b>
      <p>
        <EllipsisText className="search-result-content-text" text={content} length={250} />
      </p>
    </div>
  )

  const SearchResultsPage = ({ page }) => {
    return (
      <div>
        {
          (quantity !== 'all')
            ? (<div id="page-number-text">
              {pageContext.locale === 'no' ? 'Side ' : 'Page '}
              {pageNumber + 1}
              {pageContext.locale === 'no' ? ' av ' : ' of '}
              {maxPageNumber()}
            </div>)
            : (<br />)
        }
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
          <div id="search-page-buttons-container">
            {
              pageNumber > 0
                ? (
                  <button key={'first'} className="other-page-button"
                    onClick={e => setPageNumber(0)}>
                    {pageContext.locale === 'no' ? 'Første' : 'First'}
                  </button>
                ) : null
            }
            {
              pageNumber > 0
                ? (
                  <button key={'previous'} className="other-page-button"
                    onClick={e => setPageNumber(pageNumber - 1)}>
                    {pageContext.locale === 'no' ? 'Forrige' : 'Previous'}
                  </button>
                ) : null
            }
            {pages.map(p => {
              return {
                index: index++,
                value: p
              }
            }).map(p => {
              return (
                <button key={p.index}
                  id={pageNumber === p.index ? 'selected-page-button' : null}
                  className="page-num-button"
                  onClick={e => setPageNumber(p.index)}>
                  {p.index + 1}
                </button>
              )
            })}
            {
              pageNumber < maxPageNumber() - 1
                ? (
                  <button key={'next'} className="other-page-button"
                    onClick={e => setPageNumber(pageNumber + 1)}>
                    {pageContext.locale === 'no' ? 'Neste' : 'Next'}
                  </button>
                ) : null
            }
            {
              pageNumber < maxPageNumber() - 1
                ? (
                  <button key={'last'} className="other-page-button"
                    onClick={e => setPageNumber(maxPageNumber() - 1)}>
                    {pageContext.locale === 'no' ? 'Siste' : 'Last'}
                  </button>
                ) : null
            }
          </div>
        )}
      </div>)
  }



  return (
    <div id="search-component-container" >

      <div id="search-input-container">
        <input
          type='text'
          defaultValue={query}
          onChange={event =>
            setQuery(event.target.value)
          }
        />
      </div>

      <SearchResultQuantityText>
        <SearchResultQuantity />
      </SearchResultQuantityText>

      <div id="search-quantity-select">
        <span>
          {pageContext.locale === 'no' ? 'Vis antall:' : 'Display quantity:'}
        </span>
        <select
          value={quantity}
          onChange={e => setQuantity(e.target.value)}>
          {antall.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
          <option key={'all'} value={'all'}>
            {pageContext.locale === 'no' ? 'Alle' : 'All'}
          </option>
        </select>
      </div>

      <SearchResults />

    </div>
  )


}


const path = (locale) => (
  locale === 'no' ? '/search' : '/en/search'
)

export default ({ pageContext, location }) => {
  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">

          <Router basepath={path(pageContext.locale)}>
            <Search path={'/'} pageContext={pageContext} location={location} />
          </Router>

        </div>
      </div>
    </Layout>

  )
}



