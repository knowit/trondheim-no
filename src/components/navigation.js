import React from "react"
import { Link } from "gatsby"
import "../style/navigation.css"
import { BurgerMenu } from "./menu.js"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

export default ({ layoutContext }) => {
  const data = useStaticQuery(graphql`
  query {
    file(name: {eq: "q2fmZLZ98KYMebrZqygh_trondheim-rose"}) {
      childImageSharp {
        fixed(width: 125, height: 125) {
          ...GatsbyImageSharpFixed
        }
        fluid{
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
  `)


  return <div className="navigation-container">

    <BurgerMenu layoutContext={layoutContext}></BurgerMenu>

    <div className="logo-container">
      <Link id="trondheimno-link" to={(layoutContext.locale === 'no') ? '/' : `/${layoutContext.locale.split('-')[0]}/`}>TRONDHEIM.NO</Link>

      <div className="logo">
        <Img fluid={data.file.childImageSharp.fluid} alt="Trondheim logo" />
      </div>
    </div>
  </div>
}


