import React, { useState } from "react"
import LocalizationHelper from "../helpers/helpers"
import { Link } from "gatsby"
import Img from "gatsby-image"
import "../style/listing-page.css"
import EllipsisText from "react-ellipsis-text"
import ReactDOMHelper from "../helpers/react-dom-helper"

const selectedStyle = { backgroundColor: "grey", color: "white" }
const unSelectedStyle = { backgroundColor: "darkgrey", color: "black" }
const SORT_TYPES = ["standard", "date", "title", "random"]

export default ({
  tags,
  articles,
  subListingPages,
  localization,
  locale,
  defaultThumbnails,
  mapPage,
}) => {
  const [filterTags, setFilterTags] = useState([])
  const [sortBy, setSortBy] = useState("standard")

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
    const reset_label = LocalizationHelper.getLocalWord(
      localization,
      "resetTags",
      locale
    )
    allTags.push(
      <div
        role="button"
        aria-checked={filterTags.length === 0 ? "true" : "false"}
        aria-label={reset_label}
        tabIndex={0}
        onKeyPress={(e) => handleTagToggle("all")}
        key={allTags.length}
        className="distinct-tag"
        style={filterTags.length === 0 ? selectedStyle : unSelectedStyle}
        onClick={(e) => handleTagToggle("all")}
      >
        {LocalizationHelper.getLocalWord(localization, "all", locale)}
      </div>
    )
    tags.forEach((tag) => {
      allTags.push(
        <div
          role="checkbox"
          aria-checked={filterTags.includes(tag) ? "true" : "false"}
          aria-label={tag}
          tabIndex={0}
          onKeyPress={(e) => handleTagToggle(tag)}
          key={allTags.length}
          className="distinct-tag"
          style={filterTags.includes(tag) ? selectedStyle : unSelectedStyle}
          onClick={(e) => handleTagToggle(tag)}
        >
          {tag}
        </div>
      )
    })

    return tags.length ? <div id="all-tags-container">{allTags} </div> : null
  }
  const Sorter = () => {
    const sortTags = []
    const sorting_label = LocalizationHelper.getLocalWord(
      localization,
      "sorting",
      locale
    )
    SORT_TYPES.forEach((s) => {
      var tagName = LocalizationHelper.getLocalWord(localization, s, locale)
      sortTags.push(
        <div
          role="radio"
          aria-checked={sortBy === s ? "true" : "false"}
          aria-label={sorting_label + " " + tagName}
          tabIndex={0}
          onKeyPress={(e) => {
            setSortBy(s)
          }}
          className="distinct-tag"
          key={sortTags.length}
          style={sortBy === s ? selectedStyle : unSelectedStyle}
          onClick={(e) => setSortBy(s)}
        >
          {tagName}
        </div>
      )
    })

    return tags.length ? <div id="sort-container"> {sortTags} </div> : null
  }

  const ArticleList = () => {
    const articleViews = []

    const listingPageDefaultThumbnail = defaultThumbnails.find(
      (node) => node.title === "ListingPage Thumbnails"
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
    if (sortBy === "date") articleViews.sort(compareArticleViewDate)
    if (sortBy === "title") articleViews.sort(compareArticleViewTitle)
    if (sortBy === "random") shuffleArray(articleViews)

    return <div id="articles-container"> {articleViews} </div>
  }

  const ArticleView = ({ article, defaultThumbnail, subList }) => {
    const articleInfo =
      article.content == null
        ? ""
        : ReactDOMHelper.getTextContentFromHtml(article.content.content)
    var thumbnail = defaultThumbnail
    if (mapPage) {
      if (article.mapThumbnail != null) {
        if (article.mapThumbnail.length > 0) {
          thumbnail = article.mapThumbnail[0]?.localFile.childImageSharp.fluid
        }
      }
    } else {
      if (article.thumbnail != null) {
        if (article.thumbnail.length > 0) {
          thumbnail = article.thumbnail[0]?.localFile.childImageSharp.fluid
        }
      }
    }
    const articleHeader = mapPage
      ? article.mapPageTitle
      : subList
      ? article.navigationTitle
      : article.title
    return (
      <Link
        to={mapPage ? article.mapPath : article.path}
        className="article-container"
        aria-label={articleHeader}
      >
        <Img className="article-thumbnail" fluid={thumbnail} />
        <div className="article-info-container">
          <h2 className="article-into-header">{articleHeader}</h2>

          <EllipsisText
            className="article-info-text"
            text={articleInfo}
            length={100}
          />

          <div className="tags-container">
            {article.tags.map(function (tag, key) {
              return (
                <div className="tag" key={tag}>
                  {tag}
                </div>
              )
            })}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="article-list-container">
      <TagFilter />
      <Sorter />
      <ArticleList />
    </div>
  )
}

function compareArticleViewDate(a1, a2) {
  /* Must wait for flamelink to fix gatsby-source-flamelink
    let a1Date = a1.props.pageContext.node._fl_meta_.lastModifiedDate;
    let a2Date = a2.props.pageContext.node._fl_meta_.lastModifiedDate;
    */
  let a1Date = -1,
    a2Date = 1

  if (a1Date < a2Date) return -1
  if (a1Date > a2Date) return 1
  return 0
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

function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
