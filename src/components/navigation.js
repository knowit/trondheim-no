import React from "react"
import { Link } from "gatsby"
import "../style/navigation.css"
import { BurgerMenu } from "./menu.js"


export default ({ layoutContext }) => (
  <div class="navigation-container">

    <BurgerMenu layoutContext={layoutContext}></BurgerMenu>

    <div class="logo-container">
      <Link id="trondheimno-link" to={(layoutContext.locale === 'no') ? '/' : `/${layoutContext.locale.split('-')[0]}/`}>TRONDHEIM.NO</Link>

      <div class="logo">
        <img alt="logo" src={layoutContext.logoUrl}></img>
      </div>
    </div>
  </div>
)