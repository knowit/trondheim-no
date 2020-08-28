import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import "../style/article-card.css"

export default ({ article, defaultThumbnail, subList, listingPageColor }) => {
  var thumbnail = defaultThumbnail

  if (article.thumbnail != null) {
    if (article.thumbnail.length > 0) {
      thumbnail = article.thumbnail[0]?.localFile.childImageSharp.fluid
    }
  }

  return (
    <Link className="article-container" to={article.path} style={{backgroundColor:listingPageColor}}>
      <Img className="article-thumbnail" fluid={thumbnail} />
      <h2>{subList ? article.navigationTitle : article.title}</h2>
      <div className="tags-container">
        {article.tags.map(function (tag, key) {
          return (
            <div className="tag" key={tag}>
              {tag}
            </div>
          )
        })}
      </div>
    </Link>
  )
}
