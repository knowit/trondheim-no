import React from "react"
import "../style/home.css"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"
import LinkColumns from "../components/link-columns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import HTMLContent from "../components/html-content"
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
          <LinkColumns
            linkColumns={data.flamelinkFrontPageContent.linkColumns}
            columnsBackgroundImage={
              data.flamelinkFrontPageContent.columnsBackgroundImage
            }
            type="frontpage"
          />
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

      linkColumns {
        ...LinkColumnFragment
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
    }
  }
`
