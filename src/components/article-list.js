import React, { useState } from "react"
import LocalizationHelper from "../helpers/helpers"
import "../style/listing-page.css"
import ArticleView from "./article-box"

const selectedStyle = { backgroundColor: "#f5b891", color: "black", padding: "10px" ,  "font-weight": "bold"}
const unSelectedStyle = { backgroundColor: "#f5b891", color: "black", padding: "10px" }

export default ({
  tags,
  articles,
  subListingPages,
  localization,
  locale,
  defaultThumbnails,
}) => {
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
          role="button"
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
    return (
      <div id="tag-filter-container">
        <div id="tag-container-text">
          VELG FILTER:
        </div>
        <div id="all-tags-container">
          {allTags}
        </div>
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
    <div className="article-list-container">
      <TagFilter />
      {/*<Sorter />*/}
      <ArticleList />
    </div>
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
