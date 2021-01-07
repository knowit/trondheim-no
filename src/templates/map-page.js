import React from "react"
import "../style/listing-page.css"
import { getLocalWord } from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import SortableArticleView from "../components/article-list"
import SEO from "../components/seo"

export default ({ data }) => {
  const locale = data.flamelinkListingPageContent.flamelink_locale
  const localization = data.flamelinkListingPageLocalizationContent.translations

  return (
    <Layout
      locale={locale}
      localizedPaths={data.flamelinkListingPageContent.localizedPaths}
    >
      <SEO
        title={locale === "no" ? "Kart" : "Maps"}
        locale={locale}
        keywords={[locale === "no" ? "Kart" : "Maps"]}
        pageID={data.flamelinkListingPageContent._fl_meta_.fl_id}
      />

      <div id="outer-container">
        <div id="inner-container">
          <div id="articles-header">
            <h1>{data.flamelinkListingPageContent.localTitle}</h1>
            <p>{data.flamelinkListingPageContent.textOnPage}</p>
            <Link
              id="english-button"
              to={
                data.flamelinkListingPageContent.localizedPaths.find(
                  (item) => item.locale !== locale
                ).path
              }
            >
              {getLocalWord(localization, "changeLanguage", locale)}
            </Link>
          </div>
          <SortableArticleView
            data={data}
            tags={[]}
            localization={localization}
            articles={[]}
            subListingPages={data.allFlamelinkListingPageContent.edges.map(
              (node) => node.node
            )}
            locale={locale}
            defaultThumbnails={data.flamelinkDefaultThumbnailsContent.imageDeck}
            mapPage={true}
          />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query MapPageQuery($nodeId: String, $locale: String) {
    flamelinkListingPageLocalizationContent(flamelink_locale: { eq: "no" }) {
      ...LocalizationFragment
    }

    flamelinkListingPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale

      _fl_meta_ {
        fl_id
      }

      path
      slug
      localTitle
      textOnPage
      localizedPaths {
        locale
        path
      }
    }

    allFlamelinkListingPageContent(
      filter: {
        showOnMapListingPage: { eq: true }
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
          mapPath
          mapPageTitle
          mapThumbnail {
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

    flamelinkDefaultThumbnailsContent(flamelink_locale: { eq: "no" }) {
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
