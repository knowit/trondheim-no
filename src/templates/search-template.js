import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from "../layouts/layout"
import "../style/search.css"
import EllipsisText from "react-ellipsis-text"
import { Router } from "@reach/router"

class SearchComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
      quantity: 'all',
      pageNumber: 0,
      antall: [5, 10, 20, 50, 100]
    }

    this.setQuery = this.setQuery.bind(this)
    this.setResults = this.setResults.bind(this)
    this.setQuantity = this.setQuantity.bind(this)
    this.setPageNumber = this.setPageNumber.bind(this)
  }

  setQuery(query) {
    if (!query || !window.__LUNR__) {
      console.log("error")
      this.setResults([])
      this.state.query = ''
      return
    }
    this.state.query = query
    const lunrIndex = window.__LUNR__[this.props.pageContext.locale.split('-')[0]]
    const searchResults = lunrIndex.index.search(query)
    this.setResults(
      searchResults.map(({ ref }) => {
        return lunrIndex.store[ref]
      })
    )
  }

  setResults(results) {
    this.setState({ results: results })
  }

  setQuantity(quantity) {
    this.setState({ quantity: quantity })
  }

  setPageNumber(number) {
    this.setState({ pageNumber: number })
  }

  componentDidMount() {
    const url = new URL(this.props.location.href)

    const quantity = url.searchParams.get('quantity')
    const query = url.searchParams.get('query')
    const page = url.searchParams.get('page')

    if (query) {
      this.setQuery(query)
    }
    if (quantity) {
      this.setQuantity(quantity)
    }
    if (page && page > 0) {
      this.setPageNumber(page - 1)
    }
  }

  splitSearchResults() {
    var pageLength = this.state.quantity
    var pages = []
    var currentPage = []
    var index = 1

    if (this.state.quantity === 'all') {
      pages.push(this.state.results.map(r => {
        return { index: index++, value: r }
      }))
    }

    else {
      this.state.results.map(r => {
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


  render() {

    const SearchResultQuantityText = ({ children }) => (
      <div id="search-result-quantity-container">
        <span>{`${this.props.pageContext.locale === 'no' ? 'Antall' : 'Total'}: `}</span>
        {children}
        <span>{this.props.pageContext.locale === 'no' ? ' resultater funnet.' : ' results found.'}</span>
      </div>
    )

    const SearchResultQuantity = () => (
      <div id="search-result-quantity-number-container" >
        <div id="search-result-quantity-number">
          {this.state.results.length}
        </div>
      </div>
    )

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
      const pages = this.splitSearchResults()
      const page = pages[this.state.pageNumber] ? pages[this.state.pageNumber] : []
      var index = 0
      return (
        <div>
          <SearchResultsPage page={page} />
          {this.state.quantity === 'all' || pages.length <= 1 ? null : (
            <div>
              {pages.map(p => {
                return {
                  index: index++,
                  value: p
                }
              }).map(p => {
                return (
                  <button key={p.index} onClick={e => this.setPageNumber(p.index)}>
                    {p.index + 1}
                  </button>
                )
              })}
            </div>
          )}
        </div>)
    }


    return (
      <div >

        <div id="search-input-container">
          <input
            type='text'
            defaultValue={this.state.query}
            onChange={event =>
              this.setQuery(event.target.value)
            }
          />
        </div>

        <SearchResultQuantityText>
          <SearchResultQuantity />
        </SearchResultQuantityText>

        <div>
          Vis antall:
              <select
            value={this.state.quantity}
            onChange={e => this.setQuantity(e.target.value)}>
            {this.state.antall.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
            <option key={'all'} value={'all'}>Alle</option>
          </select>
        </div>

        <SearchResults />

      </div>
    )
  }
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
            <SearchComponent path={'/'} pageContext={pageContext} location={location} />
          </Router>

        </div>
      </div>
    </Layout>

  )
}



