
import React from 'react';
import "../style/navigation.css"
import { Link } from 'gatsby';
import ReactCountryFlag from "react-country-flag"
import LocalizationHelper from "../helpers/helpers"

export class BurgerMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

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


        {
          this.state.showMenu
            ? (
              <div className="drop-menu-container">
                <Link
                  key={0}
                  className="drop-menu-item-container"
                  to={this.props.layoutContext.homePath}>
                  {LocalizationHelper.getLocalWord(this.props.layoutContext.localization, 'home', this.props.layoutContext.locale)}
                </Link>
                {this.props.layoutContext.menuData.map(function (node, key) {
                  return (
                    <Link
                      key={key}
                      className="drop-menu-item-container"
                      to={node.path}>
                      {node.title}
                    </Link>
                  )
                })}

                <Link
                  className="drop-menu-item-container"
                  to={(this.props.layoutContext.locale === 'no') ? this.props.layoutContext.localizedPaths.en : this.props.layoutContext.localizedPaths.no}>

                  <ReactCountryFlag
                    className="drop-menu-item-flag"
                    countryCode={(this.props.layoutContext.locale !== 'no') ? 'NO' : 'GB'}
                    svg
                    style={{
                      width: '1em',
                      height: '1em',
                    }}
                    title="flag" />

                  {(this.props.layoutContext.locale === 'no') ? `English` : `Norsk`}

                </Link>
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}
