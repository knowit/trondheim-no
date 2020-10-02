import React from "react"
import "../style/home.css"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import HTMLContent from "../components/html-content"
import ReactDOMHelper from "../helpers/react-dom-helper"
import SEO from "../components/seo"

library.add(fas)

const HeaderBanner = ({ headerText, headerFocusWord, bannerImage }) => {
  return (
    <div id="header-container">
      <BackgroundImage
        id="header-image"
        Tag="section"
        fluid={bannerImage.frontImage[0].localFile.childImageSharp.fluid}
        alt={bannerImage.alt}
      >
        <h3>{headerText}</h3>
        <h1>{headerFocusWord}</h1>
      </BackgroundImage>

      <div id="header-subtext">
        <span>{bannerImage.caption}</span>
      </div>
    </div>
  )
}

export default ({ data }) => {
  const FrontpageColumns = () => {
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
              className="frontpage-column-link"
              to={path}
            >
              {children}
            </Link>
          )
        } else if (node.linkType === "url") {
          return (
            <a
              tabIndex={tabable ? "0" : "-1"}
              className="frontpage-column-link"
              href={node.url}
            >
              {children}
            </a>
          )
        } else return children
      }

      return (
        <div className="frontpage-column-item-container">
          <div className="frontpage-column-image-container">
            <Ref>
              {node.icon ? (
                <Img
                  className="frontpage-column-image"
                  fluid={node.icon[0].localFile.childImageSharp.fluid}
                  alt="thumbnail"
                />
              ) : null}
            </Ref>
          </div>
          <div className="frontpage-column-info-container">
            <h2>
              <Ref tabable="true">{node.title}</Ref>
            </h2>
            <h3>
              <Ref>
                <Content />
              </Ref>
            </h3>
          </div>
        </div>
      )
    }

    const backgroundStyle = {
      backgroundImage: `url(${data.flamelinkFrontPageContent.columnsBackgroundImage[0].localFile.childImageSharp.fluid.src})`,
    }

    var index = 0

    return (
      <div id="frontpage-columns-container" style={backgroundStyle}>
        <div id="frontpage-columns-overlay">
          {data.flamelinkFrontPageContent.linkColumns.map((node) => {
            return <Column key={index++} node={node} />
          })}
        </div>
      </div>
    )
  }

  const FrontpageCards = () => {
    const Card = (props) => {
      return (
        <div
          className="frontpage-card"
          style={{ backgroundColor: props.backgroundColor, color: props.color }}
        >
          <div className="frontpage-card-icon">
            <FontAwesomeIcon
              icon={props.icon.name}
              color={props.icon.color}
              size={"2x"}
            />
          </div>
          <div className="frontpage-card-content">
            <h2
              className="frontpage-card-title"
              style={{ color: props.textColor }}
            >
              {props.title}
            </h2>
            <div className="frontpage-card-links-container">
              {props.links.map((link, key) => {
                return (
                  <a
                    className="frontpage-card-link"
                    key={key}
                    href={link.url}
                    style={{ color: props.textColor }}
                  >
                    {link.text}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div id="frontpage-cards-container">
        {data.flamelinkFrontPageContent.bottomCards.map((item, key) => {
          const icon = {
            name: item.iconName,
            color: item.iconColor,
          }
          return (
            <Card
              key={key}
              title={item.title}
              icon={icon}
              links={item.links}
              backgroundColor={item.backgroundColor}
              textColor={item.textColor}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Layout
      locale={data.flamelinkFrontPageContent.flamelink_locale}
      localizedPaths={data.flamelinkFrontPageContent.localizedPaths}
    >
      <SEO
        title={
          data.flamelinkFrontPageContent.flamelink_locale === "no"
            ? "Hjem"
            : "Home"
        }
        locale={data.flamelinkFrontPageContent.flamelink_locale}
        keywords={[
          data.flamelinkFrontPageContent.flamelink_locale === "no"
            ? "Hjem"
            : "Home",
        ]}
      />

      <div id="outer-container">
        <HeaderBanner
          headerText={data.flamelinkFrontPageContent.headerText}
          headerFocusWord={data.flamelinkFrontPageContent.headerFocusWord}
          bannerImage={data.flamelinkFrontPageContent.bannerImage}
        />

        <div id="content-container">
          <h2>{data.flamelinkFrontPageContent.navigationText}</h2>

          <div id="navigation-menu-container">
            {data.allFlamelinkListingPageContent.edges
              .map((node) => node.node)
              .map(function (node, key) {
                if (node.thumbnail) {
                  return (
                    <Link
                      to={node.path}
                      key={key}
                      className="navigation-box-container"
                      aria-label={node.navigationTitle}
                    >
                      <Img
                        className="navigation-box-thumbnail"
                        fluid={
                          node.thumbnail[0].localFile.childImageSharp.fluid
                        }
                        alt="thumbnail"
                      />
                      <h2>
                        <div className="navigation-box-title">
                          {node.navigationTitle}
                        </div>
                      </h2>
                      <h3>{node.navigationSubtitle}</h3>
                    </Link>
                  )
                } else {
                  return null
                }
              })}
          </div>
          <FrontpageColumns />
          <div id="custom-content-container">
            <HTMLContent
              htmlContent={data.flamelinkFrontPageContent.customContent}
            />
          </div>
          <FrontpageCards />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query FrontPageQuery($nodeId: String, $locale: String) {
    allFlamelinkListingPageContent(
      filter: {
        showOnFrontPage: { eq: true }
        flamelink_locale: { eq: $locale }
      }
    ) {
      edges {
        node {
          id
          flamelink_locale
          showOnFrontPage
          path
          navigationTitle
          navigationSubtitle

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

    flamelinkFrontPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      path
      localizedPaths {
        locale
        path
      }

      headerFocusWord
      headerText
      navigationText

      bannerImage {
        caption
        alt
        frontImage {
          localFile {
            childImageSharp {
              fluid(maxWidth: 2400, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }

      customContent {
        content
        remoteImages {
          url
          childImageSharp {
            fluid(maxWidth: 1200, quality: 80) {
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

      bottomCards {
        title
        textColor
        backgroundColor
        iconName
        iconColor
        links {
          text
          url
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
              fluid(maxWidth: 1200, quality: 80) {
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

      frontImageAlt
      frontImage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 2400, quality: 90) {
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
            fluid(maxWidth: 600, quality: 70) {
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
`
