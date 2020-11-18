import React from "react"
import { Link, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image/withIEPolyfill"
import "../style/student.css"
import HTMLContent from "../components/html-content"
import ReactDOMHelper from "../helpers/react-dom-helper"
import SEO from "../components/seo"
import LinkColumns from "../components/link-columns"

const HeaderImage = ({ bannerImage }) => {
  return (
    <BackgroundImage
      id="student-header-image"
      Tag="section"
      fluid={bannerImage.image[0].localFile.childImageSharp.fluid}
      alt={bannerImage.alt}
    />
  )
}

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
            <Img
              id="student-logo-image"
              fixed={data.node.logoImage[0].localFile.childImageSharp.fixed}
            />
          </div>
        </div>
      </div>
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
          fixed={node.thumbnail[0].localFile.childImageSharp.fixed}
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

  const ListingPages = () => {
    return (
      <div id="student-listing-pages-container">
        <h1>{data.node.navigationText}</h1>
        <div id="student-listing-pages">
          <h1>{data.node.localTitle}</h1>
          <div id="student-listing-pages-grid-container">
            {data.listingPages.edges
              .map((node) => node.node)
              .map((n) => (
                <ListingPage key={n.id} node={n} />
              ))}
            {data.node.additionalListingPages.map((n) => (
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
        <HTMLContent htmlContent={data.node.customContent} />
      </div>
    )
  }

  return (
    <div>
      <SEO
        title="Student"
        locale={data.node.flamelink_locale}
        keywords={["Student"]}
        pageID={data.node.id}
      />
      <Navigation />
      <HeaderImage bannerImage={data.node.bannerImage} />
      <ListingPages />
      <CustomContent />
      <LinkColumns
        linkColumns={data.node.linkColumns}
        columnsBackgroundImage={data.node.columnsBackgroundImage}
        type="student"
      />
    </div>
  )
}

export const query = graphql`
  query StudentPageQuery($nodeId: String, $locale: String) {
    listingPages: allFlamelinkStudentListingPageContent(
      filter: { flamelink_locale: { eq: $locale } }
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
                fixed(width: 300, height: 260, quality: 70) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }

    node: flamelinkStudentPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      navigationText

      localizedPaths {
        locale
        path
      }

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
              fixed(width: 300, height: 260, quality: 90) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }

      logoImage {
        localFile {
          childImageSharp {
            fixed(height: 40, quality: 90) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
      }
      bannerImage {
        alt
        image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1800, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }

      columnsBackgroundImage {
        localFile {
          childImageSharp {
            fluid(maxWidth: 1400, quality: 90) {
              ...GatsbyImageSharpFluid_noBase64
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
              ...GatsbyImageSharpFluid
            }
          }
        }
      }

      linkColumns {
        ...LinkColumnFragment
      }
    }
  }
`
