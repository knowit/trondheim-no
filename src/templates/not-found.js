import React from "react"
import Layout from "../layouts/layout"
import { getLocalWord } from "../helpers/helpers"
import { Link, graphql } from "gatsby"
import "../style/404.css"
import ReactCountryFlag from "react-country-flag"

export const query = graphql`
  query NotFoundQuery {
    localization: flamelinkLayoutLocalizationContent(
      flamelink_locale: { eq: "no" }
    ) {
      ...LocalizationFragment
    }
  }
`

export default ({ pageContext, location, data }) => {
  console.log(`NotFound pageContext: ${JSON.stringify(pageContext)}`)
  const locale = pageContext.locale
  const localizedPaths = pageContext.localizedPaths

  const BoldText = ({ text }) => <b className="bold-text">{text}</b>

  const flag = () => (
    <ReactCountryFlag
      className="looking-for-lang-flag"
      countryCode={locale === "no" ? "GB" : "NO"}
      svg
      style={{
        width: "2em",
        height: "1em",
      }}
      title="flag"
    />
  )

  const NotFoundText = () => {
    const url = location.href ? location.href : ""
    const array = getLocalWord(
      data.localization.translations,
      "notFoundText",
      locale
    ).split("[$url]")
    var first = true
    const Line = ({ first, text }) => (
      <span>
        {first ? null : <BoldText text={url} />}
        {text}
      </span>
    )

    return (
      <p>
        {array.map((text, key) => {
          const line = <Line key={key} first={first} text={text} />
          first = false
          return line
        })}
      </p>
    )
  }

  const GoHome = () => {
    const text = getLocalWord(
      data.localization.translations,
      "navigateHome",
      locale
    )
    const url = localizedPaths.find((item) => item.locale === locale).path
    return <Link to={url}>{text}</Link>
  }

  const LookingFor = () => {
    const headerText = getLocalWord(
      data.localization.translations,
      "lookingForLang",
      locale
    )
    const subText = getLocalWord(
      data.localization.translations,
      "navigateLang",
      locale
    )
    const url = locale === "no" ? "/en" : "/"
    return (
      <div className="looking-for-container">
        <h2>{headerText}</h2>
        <Link to={url}>
          {flag()}
          {subText}{" "}
          {locale === "no" ? "www.trondheim.no/en" : "www.trondheim.no"}
        </Link>
      </div>
    )
  }

  return (
    <Layout locale={locale} localizedPaths={localizedPaths}>
      <div id="outer-container">
        <div id="inner-container">
          <div id="not-found-content-container">
            <div className="not-found-container">
              <h1>
                {getLocalWord(
                  data.localization.translations,
                  "notFoundHeader",
                  locale
                )}
              </h1>
              <NotFoundText />
              <GoHome />
            </div>

            <LookingFor />
          </div>
        </div>
      </div>
    </Layout>
  )
}
