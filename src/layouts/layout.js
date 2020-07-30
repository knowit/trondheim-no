import React, { useState } from "react"
import "../style/layout.css"
import { Helmet } from 'react-helmet'
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import BurgerMenu from "../components/menu.js"
import LocalizationHelper from '../helpers/helpers'


export default ({ children, layoutContext }) => {

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      flamelinkLayoutLocalizationContent(flamelink_locale: {eq: "no"}) {
        id
        translations {
          id
          key
          translations {
            id
            language
            word
          }
        }
      }
      allFlamelinkNavbarContent {
        edges {
          node {
            id
            flamelink_locale
            navbarText
            logo {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 120, quality: 70) {
                    base64
                    aspectRatio 
                    src 
                    srcSet 
                    sizes
                    presentationWidth
                    presentationHeight
                    originalImg
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  const [query, setQuery] = useState('')
  const localization = data.flamelinkLayoutLocalizationContent.translations
  const navbar = data.allFlamelinkNavbarContent.edges
    .find(node => node.node.flamelink_locale === layoutContext.locale).node

  // For when layoutcontext is replaced by individual variables
  const locale = layoutContext.locale
  const localizedPaths = layoutContext.localizedPaths

  const search = LocalizationHelper.getLocalWord(localization, 'search', locale)

  const Navigation = () => {
    return <div className="navigation-container">

      <div className="navigation-content-container">

        <BurgerMenu
          locale={locale}
          localizedPaths={localizedPaths} />

        <div className="logo-container">
          <Link id="trondheimno-link" to={(locale === 'no') ? '/' : `/${locale.split('-')[0]}/`}>

            <div className="logo-text">{navbar.navbarText}</div>

            <div className="logo">
              <Img fluid={navbar.logo[0].localFile.childImageSharp.fluid} alt="Trondheim logo" />
            </div>

          </Link>
        </div>
      </div>
    </div>
  }

  return (
    <div id="layout-container">
      <Helmet
        title="Trondheim.no">
        <html lang={locale} />
        <meta name="description" content="The official website for Trondheim." />
      </Helmet>
      <Navigation id="navbar" />
      <div id="children-container">
        {children}
      </div>
      <footer id="footer-container">

        <form id="search-container" action={`${(locale === 'no') ? '/' : `/${locale.split('-')[0]}/`}search`}>
          <input type="text" id="search-input" name="query" value={query} placeholder={`${search}...`} onChange={e => setQuery(e.target.value)}></input>

          <Link id='search-button' to={`${(locale === 'no') ? '/' : `/${locale.split('-')[0]}/`}search?query=${query}`}>
            <span id="search-button-word">
              {search}
            </span>

          </Link>
        </form>

      </footer>
    </div>
  )
}
