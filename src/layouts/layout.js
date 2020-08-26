import React from "react"
import "../style/layout.css"
import { Helmet } from "react-helmet"
import { Link, graphql, useStaticQuery } from "gatsby"

export default ({ children, locale, localizedPaths }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      localization: flamelinkLayoutLocalizationContent(
        flamelink_locale: { eq: "no" }
      ) {
        id
        translations {
          id
          key
          translations {
            id
            language
            word
          }
        }
      }
      navbar: allFlamelinkNavbarContent {
        edges {
          node {
            id
            flamelink_locale
            navbarText
            extraMenuOptions {
              uniqueKey
              title
              redirectUrl
            }
            logo {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 120, quality: 70) {
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
      menu: allMenuDataContent {
        edges {
          node {
            id
            locale
            menuItems {
              locale
              title
              slug
              path
            }
          }
        }
      }
    }
  `)

  const menuItems = data.menu.edges.find((it) => it.node.locale === locale).node
    .menuItems

  const Navigation = ({ items }) => {
    return (
      <div className="navigation-container">
        {items.map(function (node, key) {
          return (
            <Link
              key={key}
              role="menuitem"
              className="drop-menu-item-container"
              to={node.path}
            >
              {node.title}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div id="layout-container">
      <Helmet title="Trondheim.no">
        <html lang={locale} />
        <meta
          name="description"
          content="The official website for Trondheim."
        />
      </Helmet>
      <Navigation id="navbar" items={menuItems} />
      <div id="children-container">{children}</div>
    </div>
  )
}
