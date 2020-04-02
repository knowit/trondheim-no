import React from "react"
import "../style/index.css"
import Layout from "../layouts/layout"
import { Link, useStaticQuery, graphql } from "gatsby"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'

export default ({ pageContext }) => {
  const data = useStaticQuery(graphql`
  query {
    file(name: {eq: "x3lAb4wv7wo0axknRyR1_forsidebilde"}) {
      childImageSharp {
        fixed(width: 125, height: 125) {
          ...GatsbyImageSharpFixed
        }
        fluid (quality: 90){
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
  `)

  return <Layout layoutContext={pageContext.layoutContext}>
    <div id="outer-container">
      <div id="header-container">


        <BackgroundImage id="header-image" fluid={data.file.childImageSharp.fluid} alt="Bybro">

          <h3>{pageContext.node.headerText}</h3>
          <h1>{pageContext.node.headerFocusWord}</h1>

        </BackgroundImage>


        <div id="header-subtext"><span>Vinterstemning ved Gamle bybro og bryggene langs Nidelva. Foto: Aziz Nasuti.</span></div>
      </div>

      <div id="content-container">
        <h2>{pageContext.node.navigationText}</h2>

        <div id="navigation-menu-container">
          {pageContext.listingPages.map(function (node, { key }) {
            return (
              <div class="navigation-box-container">
                <Img className="navigation-box-thumbnail"
                  fluid={node.thumbnail[0].localFile.childImageSharp.fluid}
                  alt="thumbnail" />
                <h2><Link class="navigation-box-title" to={`/${pageContext.slug}${(pageContext.slug.length > 0) ? '/' : ''}${node.slug}`}>{node.navigationTitle}</Link></h2>
                <h4>{node.navigationSubtitle}</h4>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  </Layout>
}