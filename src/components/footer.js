import React, { useState } from "react"
import "../style/layout.css"
import { graphql, StaticQuery, navigate } from "gatsby"
import { getLocalWord } from "../helpers/helpers"

export default ({ locale, localization }) => {
  const gqlquery = graphql`
    query FooterQuery {
      allFlamelinkPageContent(filter: { showInFooter: { eq: true } }) {
        nodes {
          title
          slug
          flamelink_locale
        }
      }
    }
  `

  const [query, setQuery] = useState("")

  const search = getLocalWord(localization, "search", locale)
  const searchInput = getLocalWord(localization, "searchInput", locale)

  return (
    <>
      <StaticQuery
        query={gqlquery}
        render={(data) => {
          const links = data.allFlamelinkPageContent.nodes.filter(
            (n) => n.flamelink_locale === locale
          )
          return (
            <div id="footer-links-container">
              <ul>
                {links.map(({ title, slug }) => {
                  const s = slug[0] === "/" ? slug : `/${slug}`
                  const localizedSlug = locale === "no" ? s : `/en${s}`
                  return (
                    <li key={title}>
                      <a href={localizedSlug}>{title}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        }}
      />
      <div id="search-container">
        <form
          id="search-form"
          action={`${
            locale === "no" ? "/" : `/${locale.split("-")[0]}/`
          }search`}
          onSubmit={(event) => {
            event.preventDefault()
            navigate(
              `${
                locale === "no" ? "/" : `/${locale.split("-")[0]}/`
              }search?query=${query}`
            )
          }}
        >
          <input
            type="text"
            id="search-input"
            name="query"
            aria-label={searchInput}
            value={query}
            placeholder={`${search}...`}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" id="search-button" aria-label="search-button">
            <span id="search-button-word">{search}</span>
          </button>
        </form>
      </div>
    </>
  )
}
