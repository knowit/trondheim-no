import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import "../style/new-listing-page.css"
import ArticleView from "../components/article-box"
import { Link } from "gatsby"

export default ({ data }) => {
  const locale = data.flamelinkListingPageContent.flamelink_locale
  const localization = data.flamelinkListingPageLocalizationContent.translations
  const defaultThumbnails = data.flamelinkDefaultThumbnailsContent.imageDeck
  const subListingPages = data.allFlamelinkListingPageContent.edges.map(
    (node) => node.node
  )
  const articles = data.allFlamelinkArticleContent.edges.map(
    (node) => node.node
  )

  var tags = []
  data.allFlamelinkArticleContent.edges
    .map((node) => node.node)
    .forEach((node) => {
      if (node.tags) {
        node.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag)
          }
        })
      }
    })

  const MapButton = () => {
    if (data.flamelinkListingPageContent.hasMapPage) {
      return (
        <Link id="map-button" to={data.flamelinkListingPageContent.mapPath}>
          <img
            alt="maps_icon"
            src="https://firebasestorage.googleapis.com/v0/b/byportal-218506.appspot.com/o/flamelink%2Fmedia%2Fmaps_icon.t654A4BV83RLrL3y1SSA.svg?alt=media&token=205b8c7d-a899-455c-b089-e90b6d51e4f6"
          />
          {LocalizationHelper.getLocalWord(localization, "showOnMap", locale)}
        </Link>
      )
    } else return null
  }

  const [filterTags, setFilterTags] = useState([])

  const handleTagToggle = (tag) => {
    let filterTagsTemp = filterTags
    if (tag === "all") filterTagsTemp = []
    else {
      var indexOf = filterTagsTemp.findIndex((e) => e === tag)
      if (indexOf === -1) filterTagsTemp.push(tag)
      else filterTagsTemp.splice(indexOf, 1)
    }
    setFilterTags(filterTagsTemp.slice())
  }

  const TagFilter = () => {
    const allTags = []
    allTags.push(
      <div
        role="button"
        tabIndex={0}
        onKeyPress={(e) => handleTagToggle("all")}
        key={allTags.length}
        className={
          filterTags.length === 0 ? "selectedStyle" : "unSelectedStyle"
        }
        onClick={(e) => handleTagToggle("all")}
      >
        {LocalizationHelper.getLocalWord(localization, "all", locale)}
      </div>
    )
    tags.forEach((tag) => {
      allTags.push(
        <div
          role="button"
          tabIndex={0}
          onKeyPress={(e) => handleTagToggle(tag)}
          key={allTags.length}
          className={
            filterTags.includes(tag) ? "selectedStyle" : "unSelectedStyle"
          }
          onClick={(e) => handleTagToggle(tag)}
        >
          {tag}
        </div>
      )
    })
    return (
      <div id="tag-filter-container">
        <div id="tag-container-text">
          {LocalizationHelper.getLocalWord(
            localization,
            "filterText",
            locale
          ).toUpperCase()}
          :
        </div>
        <div id="all-tags-container">{allTags}</div>
      </div>
    )
  }

  const ArticleList = () => {
    const articleViews = []

    const listingPageDefaultThumbnail = defaultThumbnails.find(
      (node) => node.title === "ListingPage Thumbnail"
    )
    subListingPages.forEach((slp) => {
      slp.tags = []
      if (filterTags.length === 0) {
        articleViews.push(
          <ArticleView
            key={articleViews.length}
            article={slp}
            subList={true}
            defaultThumbnail={
              listingPageDefaultThumbnail
                ? listingPageDefaultThumbnail.image[0].localFile.childImageSharp
                    .fluid
                : null
            }
          />
        )
      }
    })

    const articleDefaultThumbnail = defaultThumbnails.find(
      (node) => node.title === "Article Thumbnail"
    )

    articles.forEach((article) => {
      //Add article to array only if it contains a tag chosen, or ALL is chosen (empty list).
      if (
        filterTags.length === 0 ||
        article.tags.some((r) => filterTags.includes(r))
      ) {
        articleViews.push(
          <ArticleView
            article={article}
            key={article.title}
            defaultThumbnail={
              articleDefaultThumbnail
                ? articleDefaultThumbnail.image[0].localFile.childImageSharp
                    .fluid
                : null
            }
          />
        )
      }
    })
    articleViews.sort(compareArticleViewTitle)
    return <div id="articles-container"> {articleViews} </div>
  }

  return (
    <Layout
      locale={locale}
      localizedPaths={data.flamelinkListingPageContent.localizedPaths}
    >
      <div id="articles-header">
        <div>
          <TagFilter />
        </div>
        <div>
          <MapButton />
        </div>
      </div>
      <ArticleList />
    </Layout>
  )
}

function compareArticleViewTitle(a1, a2) {
  let a1Title = a1.props.subList
    ? a1.props.article.navigationTitle
    : a1.props.article.title
  let a2Title = a2.props.subList
    ? a2.props.article.navigationTitle
    : a2.props.article.title
  a1Title = String(a1Title).toUpperCase()
  a2Title = String(a2Title).toUpperCase()

  if (a1Title < a2Title) return -1
  if (a1Title > a2Title) return 1
  return 0
}

export const query = graphql`
  query ListingPageQuery(
    $nodeId: String
    $nodeFlamelinkId: String
    $locale: String
  ) {
    flamelinkListingPageLocalizationContent(flamelink_locale: { eq: "no" }) {
      id
      translations {
        key
        translations {
          language
          word
        }
      }
    }

    flamelinkListingPageContent(id: { eq: $nodeId }) {
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

    allFlamelinkListingPageContent(
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

    allFlamelinkArticleContent(
      filter: { parentListingPage: { id: { eq: $nodeFlamelinkId } } }
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
