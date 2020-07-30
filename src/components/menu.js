import React, { useState } from 'react';
import "../style/layout.css"
import { Link, graphql, StaticQuery } from 'gatsby';
import ReactCountryFlag from "react-country-flag"
import LocalizationHelper from "../helpers/helpers"


const Menu = ({ layoutContext }) => {

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
    }
    `
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const Overlay = () => {
    return showMenu ? (<div id="menu-background-overlay" />) : null
  }

  const MenuItems = ({ items }) => {
    return showMenu
      ? (
        <div className="drop-menu-container">
          {items.map(function (node, key) {
            return (
              <Link
                key={key}
                role="menuitem"
                className="drop-menu-item-container"
                to={node.path}>
                {node.title}
              </Link>
            )
          })}
          <Link
            className="drop-menu-item-container"
            role="menuitem"
            to={layoutContext.localizedPaths.find(item => item.locale !== layoutContext.locale).path}>

            <ReactCountryFlag
              className="drop-menu-item-flag"
              countryCode={(layoutContext.locale !== 'no') ? 'NO' : 'GB'}
              svg
              style={{
                width: '1em',
                height: '1em',
              }}
            />

            {(layoutContext.locale === 'no') ? `English` : `Norsk`}

          </Link>
        </div>
      )
      : (
        null
      )
  }

  return (
    <StaticQuery query={query}
      render={(data) => {
        const menuData = data.allMenuDataContent.edges.find(node => node.node.locale === layoutContext.locale).node
        return (
          <div role="menu" tabIndex={0} onKeyPress={toggleMenu} className="menu-container" onClick={toggleMenu}>
            <div className="burger-container">
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
            </div>
            <div className="menu-text-container">
              {LocalizationHelper.getLocalWord(layoutContext.localization, 'menu', layoutContext.locale)}
            </div>
            <MenuItems items={menuData ? menuData.menuItems : []} />
            <Overlay />
          </div>
        )
      }
      }
    />
  );
}


export default Menu