import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export default ({ title = null, keywords = [], locale = "no" }) => {
  const data = useStaticQuery(
    graphql`
    query {
      allFlamelinkSeoContent {
        edges {
          node {
            id
            flamelink_locale
            title
            description
            author
            keywords {
              keyword
            }
            siteUrl
          }
        }
      }
    }
    `
  )

  const seo = data.allFlamelinkSeoContent.edges.map(node => node.node).find(node => node.flamelink_locale === locale)
  const lang = locale.split("-")[0]

  return (
    <Helmet
      htmlAttributes={{
        lang: lang,
      }}
      title={title ? title :seo.title}
      titleTemplate={title ? `%s | ${seo.title}` : "%s"}
      meta={[
        {
          name: "description",
          content:seo.description,
        },
        {
          name: "keywords",
          content:seo.keywords.map(keyword => keyword.keyword).concat(keywords).join(",")
        },
      ]}
    />
  )
}
