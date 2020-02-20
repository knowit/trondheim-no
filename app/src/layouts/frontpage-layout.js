
import React from "react"
import PropTypes from "prop-types"
import Header from "../components/header"
import Navigation from "../components/navigation"
import "../style/frontpage-layout.css"

const FrontpageLayout = ({ children }) => {
  return (
    <>
      <Navigation></Navigation>
      <main id="page-wrap">
        <Header siteTitle="OFFISIELT NETTSTED FOR" />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem 1.45rem`,
          }}
        >
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with
          {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </main>
    </>
  )
}

FrontpageLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FrontpageLayout
