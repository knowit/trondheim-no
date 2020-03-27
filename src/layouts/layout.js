import React from "react"
import Navigation from "../components/navigation"
import "../style/layout.css"
import { Helmet } from 'react-helmet'

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
