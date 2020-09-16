import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export default ({ title = null, keywords = [], locale = "no" }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            keywords
            siteUrl
          }
        }
      }
    `
  )

  const lang = locale.split("-")[0]

  return (
    <Helmet
      htmlAttributes={{
        lang: lang,
      }}
      title={title ? title : site.siteMetadata.title}
      titleTemplate={title ? `%s | ${site.siteMetadata.title}` : "%s"}
      meta={[
        {
          name: "description",
          content: site.siteMetadata.description,
        },
        {
          name: "keywords",
          content: site.siteMetadata.keywords.concat(keywords).join(","),
        },
      ]}
    />
  )
}
