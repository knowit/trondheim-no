import React from "react"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { Link, StaticQuery, graphql } from 'gatsby';
import "../style/404.css"
import ReactCountryFlag from "react-country-flag"

const NotFound = ({ location, locale, localizedPaths }) => {

  const query = graphql`
    query NotFoundQuery {
      localization: flamelinkLayoutLocalizationContent (flamelink_locale: {eq: "no"}) {
        id
        translations {
          key
          translations {
            language
            word
          }
        }
      }
    }
  `

  return (
    <StaticQuery query={query}
      render={(data) => {


        const BoldText = ({ text }) => (
          <b className="bold-text">{text}</b>
        )
      
        const flag = () => (
          <ReactCountryFlag className="looking-for-lang-flag"
            countryCode={(locale === 'no') ? 'GB' : 'NO'}
            svg
            style={{
              width: '2em',
              height: '1em',
            }}
            title="flag" />
        )

        const NotFoundText = () => {
          const url = location.href ? location.href : '';
          const array = LocalizationHelper.getLocalWord(data.localization.translations, 'notFoundText', locale).split('[$url]')
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
          const text = LocalizationHelper.getLocalWord(data.localization.translations, 'navigateHome', locale)
          const url = localizedPaths.find(item => item.locale === locale).path
          return (<Link to={url}>{text}</Link>)
        }
      

        const LookingFor = () => {
          const headerText = LocalizationHelper.getLocalWord(data.localization.translations, 'lookingForLang', locale)
          const subText = LocalizationHelper.getLocalWord(data.localization.translations, 'navigateLang', locale)
          const url = (locale === 'no') ? '/en' : '/'
          return (
            <div className="looking-for-container">
              <h2>{headerText}</h2>
              <Link to={url}>{flag()}{subText} {(locale === 'no') ? 'www.trondheim.no/en' : 'www.trondheim.no'}</Link>
            </div>
          )
        }

        return (
          <Layout
            layoutContext={{}}
            locale={locale}
            localizedPaths={localizedPaths} >
            <div id="outer-container">
              <div id="inner-container">

                <div id="not-found-content-container">
                  <div className="not-found-container">
                    <h1>{LocalizationHelper.getLocalWord(data.localization.translations, 'notFoundHeader', locale)}</h1>
                    <NotFoundText />
                    <GoHome />
                  </div>

                  <LookingFor />
                </div>

              </div>
            </div>
          </Layout>
        )
      }} />
  )
}

export default NotFound