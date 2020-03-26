import React from "react"
import Navigation from "../components/navigation"
import "../style/layout.css"

export default ({ children, layoutContext }) => (
  <div id="layout-container">
    <Navigation id="navbar" layoutContext={layoutContext}></Navigation>
    <div id="children-container">
      {children}
    </div>
  </div>
)
