import React, { useState } from 'react';
import "../style/layout.css"
import { Link, graphql, StaticQuery } from 'gatsby';
import ReactCountryFlag from "react-country-flag"
import LocalizationHelper from "../helpers/helpers"

/*
class BurgerMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    //event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  toggleMenu(e) {
    if (this.state.showMenu) {
      this.closeMenu()
    }
    else {
      this.showMenu(e)
    }
  }


  render() {

    const Overlay = () => {
      return this.state.showMenu ? (<div id="menu-background-overlay" />) : null
    }

    const Menu = () => {
      return this.state.showMenu
        ? (
          <div className="drop-menu-container">
            <Link
              key={0}
              role="menuitem"
              className="drop-menu-item-container"
              to={this.props.layoutContext.homePath}>
              {LocalizationHelper.getLocalWord(this.props.layoutContext.localization, 'home', this.props.layoutContext.locale)}
            </Link>
            {this.props.layoutContext.menuData.map(function (node, key) {
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

            <ExtraMenuOptions />

            <Link
              className="drop-menu-item-container"
              role="menuitem"
              to={this.props.layoutContext.localizedPaths.find(item => item.locale !== this.props.layoutContext.locale).path}>

              <ReactCountryFlag
                className="drop-menu-item-flag"
                countryCode={(this.props.layoutContext.locale !== 'no') ? 'NO' : 'GB'}
                svg
                style={{
                  width: '1em',
                  height: '1em',
                }}
              />

              {(this.props.layoutContext.locale === 'no') ? `English` : `Norsk`}

            </Link>
          </div>
        )
        : (
          null
        )
    }

    const ExtraMenuOptions = () => {
      if (this.props.layoutContext.navbar.childrenFlamelinkNavbarContentFieldExtraMenuOptionsItem) {
        return (<span>
          {this.props.layoutContext.navbar.childrenFlamelinkNavbarContentFieldExtraMenuOptionsItem.map(function (node, key) {
            return (
              <a
                key={key}
                role="menuitem"
                className="drop-menu-item-container"
                href={node.redirectUrl} target="_blank" rel="noreferrer">
                {node.title}
              </a>
            )
          })}
        </span>)
      }
      else return null
    }

    return (
      <div role="menu" tabIndex={0} onKeyPress={this.toggleMenu.bind(this)} className="menu-container" onClick={this.showMenu}>
        <div className="burger-container">
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
        <div className="menu-text-container">
          {LocalizationHelper.getLocalWord(this.props.layoutContext.localization, 'menu', this.props.layoutContext.locale)}
        </div>
        <Menu />
        <Overlay />
      </div>
    );
  }
}
*/

const Menu = () => {

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
    console.log(items)
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
        </div>
      )
      : (
        null
      )
  }

  return (
    <StaticQuery query={query}
      render={(data) => {
        return (
          <div role="menu" tabIndex={0} onKeyPress={toggleMenu} className="menu-container" onClick={toggleMenu}>
            <div className="burger-container">
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
              <div className="burger-bar"></div>
            </div>
            <div className="menu-text-container">
              MENY
            </div>
            <MenuItems items={data.allMenuDataContent.edges[0].node.menuItems} />
            <Overlay />
          </div>
        )
      }
      }
    />
  );

}

export default Menu