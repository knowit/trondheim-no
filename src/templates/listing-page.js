import React from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import SortableArticleView from "../components/article-list"



export default ({ data }) => {

  const locale = data.flamelinkListingPageContent.flamelink_locale
  const localization = data.flamelinkListingPageLocalizationContent.translations
  const layoutContext = {
    locale: locale,
    localizedPaths: data.flamelinkListingPageContent.localizedPaths
  }

  var tags = []
  data.allFlamelinkArticleContent.edges.map(node => node.node).map(node => {
    if (node.tags) {
      node.tags.map(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
  })

  const MapButton = () => {
    if (data.flamelinkListingPageContent.hasMapPage) {
      return (<Link id="map-button" to={data.flamelinkListingPageContent.mapPath}>{LocalizationHelper.getLocalWord(localization, "showOnMap", locale)}</Link>)
    }
    else return null
  }
  return (
    <Layout
      layoutContext={layoutContext}
      locale={locale}
      localizedPaths={data.flamelinkListingPageContent.localizedPaths}>

      <div id="outer-container">

        <div id="inner-container">
          <div id="articles-header">
            <h2>{data.flamelinkListingPageContent.localTitle}</h2>
            <p>{data.flamelinkListingPageContent.textOnPage}</p>
            <MapButton />
            <Link
              id="english-button"
              to={data.flamelinkListingPageContent.localizedPaths.find(item => item.locale !== locale).path}>
              {LocalizationHelper.getLocalWord(localization, "changeLanguage", locale)}
            </Link>
          </div>

          <SortableArticleView
            data={data}
            tags={tags}
            localization={localization}
            articles={data.allFlamelinkArticleContent.edges.map(node => node.node)}
            subListingPages={data.allFlamelinkListingPageContent.edges.map(node => node.node)}
            locale={locale}
            defaultThumbnails={data.flamelinkDefaultThumbnailsContent.imageDeck} />

        </div>
      </div>
    </Layout>
  )
}


export const query = graphql`
  query ListingPageQuery($nodeId: String, $nodeFlamelinkId: String, $locale: String) {

    flamelinkListingPageLocalizationContent (flamelink_locale: {eq: "no"}){
      id
      translations {
        key
        translations {
          language
          word
        }
      }
    }

    flamelinkListingPageContent (id: {eq: $nodeId}) {
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

    allFlamelinkListingPageContent (filter: {parentListingPage: {id: {eq: $nodeFlamelinkId}}}){
        edges{
          node{
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

    allFlamelinkArticleContent (filter: {parentListingPage: {id: {eq: $nodeFlamelinkId}}}) {
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
                fluid (maxWidth: 340, quality: 70) {
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


    flamelinkDefaultThumbnailsContent (flamelink_locale: {eq: $locale}) {
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