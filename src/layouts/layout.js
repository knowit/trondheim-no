import React from "react"
import "../style/layout.css"
import { Helmet } from 'react-helmet'
import { Link } from "gatsby"
import Img from "gatsby-image"
import LocalizationHelper from "../helpers/helpers"
import { BurgerMenu } from "../components/menu.js"

const Footer = ({ layoutContext }) => {
  const search = LocalizationHelper.getLocalWord(layoutContext.localization, 'search', layoutContext.locale)
  return (
    <footer id="footer-container">

      <form id="search-container">
        <input type="text" id="search-input" name="search-input" placeholder={`${search}...`}></input>
        <input id="search-button" type="submit" value={search} />
      </form>

    </footer>
  )
}

const Navigation = ({ layoutContext }) => {
  return <div className="navigation-container">

    <div className="navigation-content-container">
      <BurgerMenu layoutContext={layoutContext}></BurgerMenu>

      <div className="logo-container">
        <Link id="trondheimno-link" to={layoutContext.homePath}>

          <div className="logo-text">{layoutContext.navbar.navbarText}</div>

          <div className="logo">
            <Img fluid={layoutContext.navbar.logo[0].localFile.childImageSharp.fluid} alt="Trondheim logo" />
          </div>

        </Link>
      </div>
    </div>


  </div>
}

export default ({ children, layoutContext }) => {
  return (
    <div id="layout-container">
      <Helmet
        title="Trondheim.no">
        <html lang={layoutContext.locale} />
        <meta name="description" content="The official website for Trondheim." />
      </Helmet>
      <Navigation id="navbar" layoutContext={layoutContext}></Navigation>
      <div id="children-container">
        {children}
      </div>
      <Footer id="footer" layoutContext={layoutContext} />
    </div>
  )
}
