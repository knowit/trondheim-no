import React from "react"
import { Link } from "gatsby"
import "../style/navigation.css"
import { BurgerMenu } from "./menu.js"
import Img from "gatsby-image"

export default ({ layoutContext }) => {

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


