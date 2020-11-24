import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layouts/layout"
import "../style/empty-front-page.css"

export default ({ data, pageContext }) => {
  const locale = pageContext.locale

  const h1Text = locale === "no" ? "Forhåndsvisning" : "Preview"

  let localizedPaths =
    pageContext.schema === "studentPage"
      ? (localizedPaths = data.studentPage.localizedPaths)
      : [
          {
            locale: "no",
            path: "/",
          },
          {
            locale: "en-US",
            path: "/en",
          },
        ]

  return (
    <Layout locale={locale} localizedPaths={localizedPaths}>
      <div id="outer-container">
        <div id="inner-container">
          <h1>{h1Text}</h1>
          <p>
            <br />
            <b>Status:</b> {pageContext.status}
            <br />
            <b>Locale:</b> {pageContext.locale}
            <br />
            <br />
            <b>This page is a placeholder for: </b> {pageContext.schema}
          </p>

          <div className="links-container">
            <h2>Custom Pages</h2>
            <ul style={{ listStyle: "none" }}>
              {data.pages.edges
                .map((node) => node.node)
                .map(function (node, key) {
                  return (
                    <li key={key}>
                      <Link to={node.path} aria-label={node.title}>
                        {node.title}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div className="links-container">
            <h2>Listing Pages</h2>
            <ul style={{ listStyle: "none" }}>
              {data.listingPages.edges
                .map((node) => node.node)
                .map(function (node, key) {
                  return (
                    <li key={key}>
                      <Link to={node.path} aria-label={node.navigationTitle}>
                        {node.navigationTitle}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div className="links-container">
            <h2>Articles</h2>
            <ul style={{ listStyle: "none" }}>
              {data.articles.edges
                .map((node) => node.node)
                .map(function (node, key) {
                  return (
                    <li key={key}>
                      <Link to={node.path} aria-label={node.title}>
                        {node.title}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div className="links-container">
            <h2>Student Listing Pages</h2>
            <ul style={{ listStyle: "none" }}>
              {data.studentListingPages.edges
                .map((node) => node.node)
                .map(function (node, key) {
                  return (
                    <li key={key}>
                      <Link to={node.path} aria-label={node.navigationTitle}>
                        {node.navigationTitle}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div className="links-container">
            <h2>Student Articles</h2>
            <ul style={{ listStyle: "none" }}>
              {data.studentArticles.edges
                .map((node) => node.node)
                .map(function (node, key) {
                  return (
                    <li key={key}>
                      <Link to={node.path} aria-label={node.title}>
                        {node.title}
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query EmptyFrontPageQuery($nodeId: String, $locale: String) {
    frontPage: flamelinkFrontPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      path
      localizedPaths {
        locale
        path
      }
    }

    studentPage: flamelinkStudentPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      path
      localizedPaths {
        locale
        path
      }
    }

    listingPages: allFlamelinkListingPageContent(
      filter: { flamelink_locale: { eq: $locale } }
    ) {
      edges {
        node {
          id
          flamelink_locale
          path
          navigationTitle
        }
      }
    }

    studentListingPages: allFlamelinkStudentListingPageContent(
      filter: { flamelink_locale: { eq: $locale } }
    ) {
      edges {
        node {
          id
          flamelink_locale
          path
          navigationTitle
        }
      }
    }

    articles: allFlamelinkArticleContent(
      filter: { flamelink_locale: { eq: $locale } }
    ) {
      edges {
        node {
          id
          flamelink_locale
          title
          path
        }
      }
    }

    studentArticles: allFlamelinkStudentArticleContent(
      filter: { flamelink_locale: { eq: $locale } }
    ) {
      edges {
        node {
          id
          flamelink_locale
          title
          path
        }
      }
    }

    pages: allFlamelinkPageContent(
      filter: { flamelink_locale: { eq: $locale } }
    ) {
      edges {
        node {
          id
          flamelink_id
          flamelink_locale
          path
          title
        }
      }
    }
  }
`
