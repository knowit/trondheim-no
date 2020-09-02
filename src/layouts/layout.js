import React, { useState } from "react"
import "../style/layout.css"
import { Helmet } from "react-helmet"
import { Link, graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import className from "classnames"

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
        nodes {
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

      allFlamelinkSidebarMainMenuNavigation {
        nodes {
          id
          flamelink_locale
          items {
            uuid
            title
            url
            root
            flamelink_children {
              uuid
              title
              url
              root
            }
          }
        }
      }

      allFlamelinkSidebarSecondaryMenuNavigation {
        nodes {
          id
          flamelink_locale
          items {
            uuid
            title
            url
            root
          }
        }
      }
    }
  `)

  const menuItems = data.menu.edges.find((it) => it.node.locale === locale).node
    .menuItems

  const sidebarMainMenu = data.allFlamelinkSidebarMainMenuNavigation.nodes.find(
    (it) => it.flamelink_locale === locale
  ).items

  const sidebarSecondaryMenu = data.allFlamelinkSidebarSecondaryMenuNavigation.nodes.find(
    (it) => it.flamelink_locale === locale
  ).items

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

  const NavItem = ({ item }) => {
    const SubItems = ({ show }) => {
      if (item.flamelink_children && item.flamelink_children.length && !!show) {
        return (
          <div className="child-item-container">
            {item.flamelink_children.map((it) => {
              return (
                <Link to={it.url} className="child-nav">
                  {it.title}
                </Link>
              )
            })}
          </div>
        )
      }
      return null
    }

    const [isPartial, setIsPartial] = useState(false)
    const isPartiallyActive = ({ isPartiallyCurrent }) => {
      setIsPartial(isPartiallyCurrent)
    }

    const cn = className({
      active: isPartial,
      "nav-item-container": true,
    })

    return (
      <div className={cn}>
        <Link getProps={isPartiallyActive} to={item.url}>
          {item.title}
        </Link>
        <SubItems show={isPartial} />
      </div>
    )
  }

  const Menu = ({ id, items }) => {
    return (
      <div id={id} className="navigation-container">
        {items.map((item) => {
          return <NavItem item={item} />
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
      <header id="header">
        <button>menu</button>
        <p>TRONDHEIM</p>
      </header>
      <div id="menu-container">
        <Menu id="menu" items={sidebarMainMenu} />
        <Menu id="secondary-menu" items={sidebarSecondaryMenu} />
        <div id="sidebar-bottom">
          <Img
            fluid={
              data.navbar.nodes.find((it) => it.flamelink_locale === locale)
                .logo[0].localFile.childImageSharp.fluid
            }
          ></Img>
        </div>
      </div>
      <div id="layout-content-container">{children}</div>
    </div>
  )
}
