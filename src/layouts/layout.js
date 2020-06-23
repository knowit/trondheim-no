import React from "react"
import "../style/layout.css"
import { Helmet } from 'react-helmet'
import { Link } from "gatsby"
import { BurgerMenu } from "../components/menu.js"
import Img from "gatsby-image"

const Navigation = ({ layoutContext }) => {

  return <div className="navigation-container">

    <BurgerMenu layoutContext={layoutContext}></BurgerMenu>

    <div className="logo-container">
      <Link id="trondheimno-link" to={(layoutContext.locale === 'no') ? '/' : `/${layoutContext.locale.split('-')[0]}/`}>

        <div className="logo-text">TRONDHEIM.NO</div>

        <div className="logo">
          <Img fluid={layoutContext.logoImage.localFile.childImageSharp.fluid} alt="Trondheim logo" />
        </div>

      </Link>
    </div>
  </div>
}

export default ({ children, layoutContext }) => (
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
  </div>
)
