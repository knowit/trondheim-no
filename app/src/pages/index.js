import React from "react"
import { Link } from "gatsby"
import SEO from "../components/seo"
import "../style/index.css"
import FrontpageLayout from "../layouts/frontpage-layout"

const IndexPage = () => (
  <div id="outer-container">
    <FrontpageLayout>
      <Link to="/">Go back to the homepage</Link>
    </FrontpageLayout>
  </div>
)

export default IndexPage
