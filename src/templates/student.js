import React from "react"
import { Link } from "gatsby"
import BackgroundImage from 'gatsby-background-image'
import Img from "gatsby-image/withIEPolyfill"
import "../style/student.css"
import HTMLContent from "../components/html-content"
import ReactDOMHelper from "../helpers/react-dom-helper"


export default ({ pageContext }) => {
  const Navigation = () => {
    return (<div id="student-header-container">
      <div id="student-header-content">
        <div id="languages-container">
          {pageContext.node.localizedPaths
            .sort((a, b) => b.locale.split('-')[0].toUpperCase() > a.locale.split('-')[0].toUpperCase() ? 1 : -1)
            .map(item => (item.locale === pageContext.node.flamelink_locale)
              ? <div key={item.locale} className="language-item">
                {item.locale.split('-')[0].toUpperCase()}
              </div>
              : <div key={item.locale} className="language-item">
                <Link
                  className="language-item-link"
                  to={item.path}>
                  {item.locale.split('-')[0].toUpperCase()}
                </Link>
              </div>)}
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
    return (<div id="student-custom-content-container">
      <HTMLContent htmlContent={pageContext.studentPageNode.customContent} />
    </div>)
  }

  const LinkColumns = () => {

    const Column = ({ node }) => {

      const Content = () => ReactDOMHelper.parseToReact(node.content.content)

      const Ref = ({ children }) => {
        if (node.linkType === 'listingPage' || node.linkType === 'page') {
          const path = node.linkType === 'listingPage' ? node.listingPage.path : node.page.path
          return (<Link className="student-column-link" to={path}>{children}</Link>)
        }
        else if (node.linkType === 'url') {
          return (<a className="student-column-link" href={node.url}>{children}</a>)
        }
        else return children
      }

      const size = 56

      const imgSize = {
        width: size * node.icon[0].localFile.childImageSharp.fluid.presentationWidth / node.icon[0].localFile.childImageSharp.fluid.presentationHeight,
        height: `${size}px`
      }

      return (<div className="student-column-item-container">
        <div className="student-column-image-container">
          <Ref >
            {node.icon ? <Img className="student-column-image"
              fluid={node.icon[0].localFile.childImageSharp.fluid}
              alt="thumbnail"
              style={imgSize}
            /> : null}
          </Ref>
        </div>
        <div className="student-column-info-container">
          <h3>
            <Ref>
              {node.title}
            </Ref>
          </h3>
          <h4 >
            <Ref>
              <Content />
            </Ref>
          </h4>
        </div>
      </div>)
    }


    const backgroundStyle = {
      backgroundImage: `url(${pageContext.studentPageNode.columnsBackgroundImage[0].localFile.childImageSharp.fluid.src})`
    }

    var index = 0;

    return (

      <div id="student-columns-container" style={backgroundStyle}>
        <div id="student-columns-overlay">
          {pageContext.studentPageNode.linkColumns.map(node => {
            return (
              <Column
                key={index++}
                node={node} />)
          })}
        </div>
      </div>
    )
  }

  return (<div>
    <Navigation />
    <HeaderImage />
    <SubListingPages />
    <CustomContent />
    <LinkColumns />
  </div>)

}