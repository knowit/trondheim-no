import React from "react"
import { Link, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image/withIEPolyfill"
import "../style/student.css"
import HTMLContent from "../components/html-content"
import ReactDOMHelper from "../helpers/react-dom-helper"
import SEO from "../components/seo"

export default ({ data }) => {
  const Navigation = () => {
    return (
      <div id="student-header-container">
        <div id="student-header-content">
          <div id="languages-container">
            {data.node.localizedPaths
              .sort((a, b) =>
                b.locale.split("-")[0].toUpperCase() >
                a.locale.split("-")[0].toUpperCase()
                  ? 1
                  : -1
              )
              .map((item) =>
                item.locale === data.node.flamelink_locale ? (
                  <div key={item.locale} className="language-item">
                    {item.locale.split("-")[0].toUpperCase()}
                  </div>
                ) : (
                  <div key={item.locale} className="language-item">
                    <Link className="language-item-link" to={item.path}>
                      {item.locale.split("-")[0].toUpperCase()}
                    </Link>
                  </div>
                )
              )}
          </div>

          <div id="student-logo-container">
            <h2>
              {data.studentPageNode.headerText}{" "}
              <b>{data.studentPageNode.headerFocusWord}</b>
            </h2>
            <div id="student-logo-image">
              <Img
                id="student-logo-image"
                fluid={
                  data.studentPageNode.logoImage[0].localFile.childImageSharp
                    .fluid
                }
              ></Img>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const HeaderImage = () => {
    return (
      <BackgroundImage
        id="student-header-image"
        Tag="section"
        fluid={
          data.studentPageNode.frontImage[0].localFile.childImageSharp.fluid
        }
        alt={data.studentPageNode.frontImageAlt}
      ></BackgroundImage>
    )
  }

  const ListingPage = ({ node }) => {
    return (
      <Link
        to={node.path}
        className="student-listing-page-card"
        aria-label={node.navigationTitle}
      >
        <Img
          className="student-listing-page-card-thumbnail"
          fluid={node.thumbnail[0].localFile.childImageSharp.fluid}
        ></Img>
        <div className="student-listing-page-info-container">
          <h3>
            <div>{node.navigationTitle}</div>
          </h3>
          <p>{node.navigationSubtitle}</p>
        </div>
      </Link>
    )
  }

  const SubListingPages = () => {
    return (
      <div id="student-listing-pages-container">
        <div id="student-listing-pages">
          <h1>{data.node.localTitle}</h1>
          <div id="student-listing-pages-grid-container">
            {data.subListingPages.edges
              .map((node) => node.node)
              .map((n) => (
                <ListingPage key={n.id} node={n} />
              ))}
            {data.studentPageNode.additionalListingPages.map((n) => (
              <ListingPage key={n.id} node={n} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const CustomContent = () => {
    return (
      <div id="student-custom-content-container">
        <HTMLContent htmlContent={data.studentPageNode.customContent} />
      </div>
    )
  }

  const LinkColumns = () => {
    const Column = ({ node }) => {
      const Content = () => ReactDOMHelper.parseToReact(node.content.content)

      const Ref = ({ children, tabable }) => {
        if (node.linkType === "listingPage" || node.linkType === "page") {
          const path =
            node.linkType === "listingPage"
              ? node.listingPage.path
              : node.page.path
          return (
            <Link
              tabIndex={tabable ? "0" : "-1"}
              className="student-column-link"
              to={path}
            >
              {children}
            </Link>
          )
        } else if (node.linkType === "url") {
          return (
            <a
              tabIndex={tabable ? "0" : "-1"}
              className="student-column-link"
              href={node.url}
            >
              {children}
            </a>
          )
        } else return children
      }

      const size = 56

      const imgSize = {
        width:
          (size *
            node.icon[0].localFile.childImageSharp.fluid.presentationWidth) /
          node.icon[0].localFile.childImageSharp.fluid.presentationHeight,
        height: `${size}px`,
      }

      return (
        <div className="student-column-item-container">
          <div className="student-column-image-container">
            <Ref>
              {node.icon ? (
                <Img
                  className="student-column-image"
                  fluid={node.icon[0].localFile.childImageSharp.fluid}
                  alt="thumbnail"
                  style={imgSize}
                />
              ) : null}
            </Ref>
          </div>
          <div className="student-column-info-container">
            <h3>
              <Ref tabable="true">{node.title}</Ref>
            </h3>
            <h4>
              <Ref tabable="true">
                <Content />
              </Ref>
            </h4>
          </div>
        </div>
      )
    }

    const backgroundStyle = {
      backgroundImage: `url(${data.studentPageNode.columnsBackgroundImage[0].localFile.childImageSharp.fluid.src})`,
    }

    var index = 0

    return (
      <div id="student-columns-container" style={backgroundStyle}>
        <div id="student-columns-overlay">
          {data.studentPageNode.linkColumns.map((node) => {
            return <Column key={index++} node={node} />
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <SEO
        title="Student"
        locale={data.studentPageNode.flamelink_locale}
        keywords={["Student"]}
      />
      <Navigation />
      <HeaderImage />
      <SubListingPages />
      <CustomContent />
      <LinkColumns />
    </div>
  )
}

export const query = graphql`
  query StudentPageQuery(
    $nodeId: String
    $nodeFlamelinkId: String
    $locale: String
  ) {
    node: flamelinkListingPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      localizedPaths {
        locale
        path
      }
    }

    subListingPages: allFlamelinkListingPageContent(
      filter: { parentListingPage: { id: { eq: $nodeFlamelinkId } } }
    ) {
      edges {
        node {
          id
          flamelink_id
          flamelink_locale
          path

          localTitle
          navigationTitle

          thumbnail {
            localFile {
              name
              childImageSharp {
                fluid(maxWidth: 340, quality: 70) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  sizes
                  presentationWidth
                  presentationHeight
                  originalImg
                }
              }
            }
          }
        }
      }
    }

    studentPageNode: flamelinkStudentPageContent(
      flamelink_locale: { eq: $locale }
    ) {
      id
      flamelink_locale
      headerText
      headerFocusWord

      additionalListingPages {
        id
        _fl_meta_ {
          fl_id
          schema
        }
        flamelink_id
        flamelink_locale
        navigationTitle
        navigationSubtitle
        path
        thumbnail {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 340, quality: 90) {
                base64
                aspectRatio
                src
                srcSet
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
      }

      logoImage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 120, quality: 90) {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }

      frontImage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1800, quality: 90) {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }

      columnsBackgroundImage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1400, quality: 90) {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }

      customContent {
        content
        remoteImages {
          url
          childImageSharp {
            fluid(quality: 90) {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }

      linkColumns {
        title
        subTitle
        linkType
        url
        listingPage {
          navigationTitle
          navigationSubtitle
          path
        }
        page {
          title
          subTitle
          path
        }
        content {
          content
          remoteImages {
            url
            childImageSharp {
              fluid(maxWidth: 1200, quality: 70) {
                base64
                aspectRatio
                src
                srcSet
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        icon {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 240, quality: 70) {
                base64
                aspectRatio
                src
                srcSet
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
      }
    }
  }
`
