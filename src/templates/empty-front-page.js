import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layouts/layout"
import "../style/empty-front-page.css"



export default ({ data, pageContext }) => {

    const locale = pageContext.locale

    const h1Text = locale === "no" ? "Forhåndsvisning" : "Preview"

    let localizedPaths = [
        {
            locale: "no",
            path: "/"
        },
        {
            locale: "en-US",
            path: "/en"
        }
    ]

    if (pageContext.layout === "student-page") {
        localizedPaths = [
            {
                locale: "no",
                path: "/student"
            },
            {
                locale: "en-US",
                path: "/en/student"
            }
        ]
    }

    return (
        <Layout
        locale={locale}
        localizedPaths={localizedPaths} 
        >

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
                        <b>This page is a placeholder for: </b> {pageContext.layout}
                    </p>

                    <div className="links-container">
                        <h2>Articles</h2>
                            <ul style={{listStyle: "none"}}>
                                    {
                                    data.allFlamelinkArticleContent.edges
                                    .map(node => node.node)
                                    .map(function (node, key) {
                                        return (
                                            <li key={key}>
                                                <Link 
                                            to={node.path}
                                            aria-label={node.title}>
                                                {node.title}
                                            </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                    </div>

                    <div className="links-container">
                        <h2>Custom Pages</h2>
                            <ul style={{listStyle: "none"}}>
                                    {
                                    data.allFlamelinkPageContent.edges
                                    .map(node => node.node)
                                    .map(function (node, key) {
                                        return (
                                            <li key={key}>
                                                <Link 
                                            to={node.path}
                                            aria-label={node.title}>
                                                {node.title}
                                            </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                    </div>

                    <div className="links-container">
                        <h2>Listing Pages</h2>
                            <ul style={{listStyle: "none"}}>
                                    {
                                    data.allFlamelinkListingPageContent.edges
                                    .map(node => node.node)
                                    .map(function (node, key) {
                                        return (
                                            <li key={key}>
                                                <Link 
                                            to={node.path}
                                            aria-label={node.navigationTitle}>
                                                {node.navigationTitle}
                                            </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export const query = graphql`
    query EmptyFrontPageQuery($nodeId: String, $locale: String) {

        flamelinkFrontPageContent(id: { eq: $nodeId }) {
            id
            flamelink_locale
            path
            localizedPaths {
                locale
                path
            }
        }

        allFlamelinkListingPageContent (
            filter: {
                flamelink_locale: { eq: $locale }
            }
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

        allFlamelinkArticleContent (
            filter: {
                flamelink_locale: { eq: $locale }
            }
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

        allFlamelinkPageContent (
            filter: {
                flamelink_locale: { eq: $locale }
            }
        ) {
            edges{
              node{
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