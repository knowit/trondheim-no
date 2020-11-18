import React from "react"
import "../style/listing-page.css"
import { getLocalWord } from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import SortableArticleView from "../components/article-list"
import SEO from "../components/seo"

export default ({ data, pageContext }) => {
  const childListingPages =
    pageContext.schema === "studentListingPage"
      ? data.childStudentListingPages.edges
      : data.childListingPages.edges

  const childArticles =
    pageContext.schema === "studentListingPage"
      ? data.childStudentArticles.edges
      : data.childArticles.edges

  const node =
    pageContext.schema === "studentListingPage" ? data.studentNode : data.node

  const locale = node.flamelink_locale
  const localization = data.flamelinkListingPageLocalizationContent.translations

  var tags = []
  childArticles
    .map((node) => node.node)
    .forEach((node) => {
      if (node.tags) {
        node.tags.forEach((tag) => {
          if (!tags.includes(tag.toLowerCase())) {
            tags.push(tag.toLowerCase())
          }
        })
      }
    })

  const MapButton = () => {
    if (node.hasMapPage) {
      return (
        <Link id="map-button" to={node.mapPath}>
          {getLocalWord(localization, "showOnMap", locale)}
        </Link>
      )
    } else return null
  }

  const LanguageButton = () => {
    const otherLang = node.localizedPaths.find((item) => item.locale !== locale)
    return otherLang ? (
      <Link id="english-button" to={otherLang.path}>
        {getLocalWord(localization, "changeLanguage", locale)}
      </Link>
    ) : null
  }

  return (
    <Layout locale={locale} localizedPaths={node.localizedPaths}>
      <SEO
        title={node.localTitle}
        locale={node.flamelink_locale}
        keywords={[node.navigationTitle]}
        pageID={node.id}
      />

      <div id="outer-container">
        <div id="inner-container">
          <div id="articles-header">
            <h2>{node.localTitle}</h2>
            <p>{node.textOnPage}</p>
            <MapButton />
            <LanguageButton />
          </div>

          <SortableArticleView
            data={data}
            tags={tags}
            localization={localization}
            articles={childArticles.map((node) => node.node)}
            subListingPages={childListingPages.map((node) => node.node)}
            locale={locale}
            defaultThumbnails={data.flamelinkDefaultThumbnailsContent.imageDeck}
          />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ListingPageQuery(
    $nodeId: String
    $nodeFlamelinkId: String
    $locale: String
  ) {
    flamelinkListingPageLocalizationContent(flamelink_locale: { eq: "no" }) {
      ...LocalizationFragment
    }

    node: flamelinkListingPageContent(id: { eq: $nodeId }) {
      id
      flamelink_id
      flamelink_locale
      path
      mapPath
      slug
      hasMapPage
      localTitle
      textOnPage
      localizedPaths {
        locale
        path
      }
    }

    studentNode: flamelinkStudentListingPageContent(id: { eq: $nodeId }) {
      id
      flamelink_id
      flamelink_locale
      path
      mapPath
      slug
      hasMapPage
      localTitle
      textOnPage
      localizedPaths {
        locale
        path
      }
    }

    childListingPages: allFlamelinkListingPageContent(
      filter: {
        parentListingPage: { id: { eq: $nodeId } }
        flamelink_locale: { eq: $locale }
      }
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

    childStudentListingPages: allFlamelinkStudentListingPageContent(
      filter: {
        parentListingPage: { id: { eq: $nodeFlamelinkId } }
        flamelink_locale: { eq: $locale }
      }
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

    childArticles: allFlamelinkArticleContent(
      filter: {
        parentListingPage: { id: { eq: $nodeFlamelinkId } }
        flamelink_locale: { eq: $locale }
      }
    ) {
      edges {
        node {
          id
          flamelink_locale
          slug
          tags
          title
          path

          parentListingPage {
            id
            localTitle
          }

          thumbnail {
            localFile {
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

    childStudentArticles: allFlamelinkStudentArticleContent(
      filter: {
        parentListingPage: { id: { eq: $nodeFlamelinkId } }
        flamelink_locale: { eq: $locale }
      }
    ) {
      edges {
        node {
          id
          flamelink_locale
          slug
          tags
          title
          path

          parentListingPage {
            id
            localTitle
          }

          thumbnail {
            localFile {
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

    flamelinkDefaultThumbnailsContent(flamelink_locale: { eq: $locale }) {
      id
      flamelink_locale
      imageDeck {
        title
        image {
          localFile {
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
      }
    }
  }
`
