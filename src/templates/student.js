import React from "react"
import { Link } from "gatsby"
import BackgroundImage from 'gatsby-background-image'
import Img from 'gatsby-image'
import "../style/student.css"
import HTMLContent from "../components/html-content"

export default ({ pageContext }) => {
  const Navigation = () => {
    return (<div id="student-header-container">
      <div id="student-header-content">
        <div id="languages-container">
          {pageContext.node.localizedPaths
            .sort((a, b) => b.locale.split('-')[0].toUpperCase() > a.locale.split('-')[0].toUpperCase() ? 1 : -1)
            .map(item => <Link
              key={item.locale}
              className="language-item"
              to={item.path}>
              {item.locale.split('-')[0].toUpperCase()}
            </Link>)}
        </div>

        <div id="student-logo-container">
          <h2>{pageContext.studentPageNode.headerText} <b>{pageContext.studentPageNode.headerFocusWord}</b></h2>
          <div id="student-logo-image">
            <Img id="student-logo-image" fluid={pageContext.studentPageNode.logoImage[0].localFile.childImageSharp.fluid}></Img>
          </div>

        </div>
      </div>
    </div>)
  }

  const HeaderImage = () => {
    return (
      <BackgroundImage id="student-header-image" Tag="section"
        fluid={pageContext.studentPageNode.frontImage[0].localFile.childImageSharp.fluid}
        alt={pageContext.studentPageNode.frontImageAlt}>
      </BackgroundImage>
    )
  }

  const ListingPage = ({ node }) => {
    return (<div className="student-listing-page-card">
      <Img className="student-listing-page-card-thumbnail" fluid={node.thumbnail[0].localFile.childImageSharp.fluid}></Img>
      <div className="student-listing-page-info-container">
        <h3><Link to={node.path}>{node.navigationTitle}</Link></h3>
        <p>{node.navigationSubtitle}</p>
      </div>

    </div>)
  }

  const SubListingPages = () => {
    return (<div id="student-listing-pages-container">
      <div id="student-listing-pages">
        <h1>{pageContext.node.localTitle}</h1>
        <div id="student-listing-pages-grid-container">
          {pageContext.subListingPages.map(n => <ListingPage key={n.id} node={n} />)}
          {pageContext.studentPageNode.additionalListingPages.map(n => <ListingPage key={n.id} node={n} />)}
        </div>
      </div>
    </div>)
  }

  const CustomContent = () => {
    return (<HTMLContent htmlContent={pageContext.studentPageNode.customContent}/>)
  }

  const Links = () => {
    return (<div></div>)
  }

  return (<div>
    <Navigation />
    <HeaderImage />
    <SubListingPages />
    <CustomContent />
    <Links />
    Student page
  </div>)

}