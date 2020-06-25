import React from "react"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { Link } from 'gatsby';
import { locale } from "core-js";

const NotFound = ({ pageContext, location }) => {

  const BoldText = ({ text }) => (
    <b className="bold-text">{text}</b>
  )

  const NotFoundText = () => {
    const url = location.href ? location.href : '';
    const array = LocalizationHelper.getLocalWord(pageContext.layoutContext.localization, 'notFoundText', pageContext.locale).split('[$url]')
    var first = true
    const Line = ({ first, text }) => (<span>
      {(first) ? null : <BoldText text={url} />}{text}
    </span>)

    return (<p>
      {array.map((text, key) => {
        const line = <Line key={key} first={first} text={text} />
        first = false
        return (line)
      })}
    </p>)
  }

  const GoHome = () => {
    const text = LocalizationHelper.getLocalWord(pageContext.layoutContext.localization, 'navigateHome', pageContext.locale)
    const url = pageContext.layoutContext.localizedPaths[pageContext.locale.split('-')[0]]
    return (<Link to={url}>{text}</Link>)
  }

  const LookingFor = () => {
    const headerText = LocalizationHelper.getLocalWord(pageContext.layoutContext.localization, 'lookingForLang', pageContext.locale)
    const subText = LocalizationHelper.getLocalWord(pageContext.layoutContext.localization, 'navigateLang', pageContext.locale)
    const url = (pageContext.locale === 'no') ? '/en' : '/'
    return (
      <span>
        <h2>{headerText}</h2>
        <Link to={url}>{subText} {(pageContext.locale === 'no') ? 'www.trondheim.no/en' : 'www.trondheim.no'}</Link>
      </span>
    )
  }


  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">
          <h1>{LocalizationHelper.getLocalWord(pageContext.layoutContext.localization, 'notFoundHeader', pageContext.locale)}</h1>
          <NotFoundText />
          <GoHome />
          <LookingFor />
        </div>
      </div>
    </Layout>
  )
}

export default NotFound