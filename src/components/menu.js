import React, { useState } from "react"
import "../style/layout.css"
import { Link, graphql, StaticQuery } from "gatsby"
import ReactCountryFlag from "react-country-flag"
import { getLocalWord } from "../helpers/helpers"

const Menu = ({ locale, localizedPaths }) => {
  const query = graphql`
    query MenuQuery {
      allMenuDataContent {
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
      allFlamelinkNavbarContent {
        edges {
          node {
            id
            flamelink_locale
            extraMenuOptions {
              uniqueKey
              title
              redirectUrl
            }
          }
        }
      }
      flamelinkLayoutLocalizationContent(flamelink_locale: { eq: "no" }) {
        id
        ...LocalizationFragment
      }
    }
  `
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const closeOnEscape = (event) => {
    if (event.key === "Escape") {
      setShowMenu(false)
    }
  }

  const Overlay = () => {
    return showMenu ? <div id="menu-background-overlay" /> : null
  }

  const lang = localizedPaths.find((item) => item.locale !== locale)
  // If not found, redirect to front page of different locale than current
  const langPath = lang ? lang.path : locale !== "no" ? "/" : "/en"

  const MenuItems = ({ items, externalItems }) => {
    return showMenu ? (
      <div className="drop-menu-container" role="menu">
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
        {externalItems.map(function (node, key) {
          return (
            <a
              key={key}
              role="menuitem"
              className="drop-menu-item-container"
              href={node.redirectUrl}
            >
              {node.title}
            </a>
          )
        })}
        <Link
          className="drop-menu-item-container"
          role="menuitem"
          to={langPath}
        >
          <ReactCountryFlag
            className="drop-menu-item-flag"
            countryCode={locale !== "no" ? "NO" : "GB"}
            svg
            style={{
              width: "1em",
              height: "1em",
            }}
          />

          {locale === "no" ? `English` : `Norsk`}
        </Link>
      </div>
    ) : null
  }

  return (
    <StaticQuery
      query={query}
      render={(data) => {
        const menuData = data.allMenuDataContent.edges.find(
          (node) => node.node.locale === locale
        ).node
        const navbarData = data.allFlamelinkNavbarContent.edges.find(
          (node) => node.node.flamelink_locale === locale
        ).node
        const localization =
          data.flamelinkLayoutLocalizationContent.translations
        return (
          <div
            role="button"
            tabIndex={0}
            onKeyPress={toggleMenu}
            onKeyDown={closeOnEscape}
            className="menu-container"
            onClick={toggleMenu}
          >
            <div className="burger-container">
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
            </div>
            <div className="menu-text-container">
              {getLocalWord(localization, "menu", locale)}
            </div>
            <MenuItems
              items={menuData ? menuData.menuItems : []}
              externalItems={
                navbarData ? navbarData.extraMenuOptions || [] : []
              }
            />
            <Overlay />
          </div>
        )
      }}
    />
  )
}

export default Menu
