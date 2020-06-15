
import React from 'react';
import "../style/navigation.css"
import { Link } from 'gatsby';
import ReactCountryFlag from "react-country-flag"

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


  render() {
    return (
      <div role="menu" tabIndex={0} onKeyPress={this.handleKeyPress} className="menu-container" onClick={this.showMenu}>
        <div className="burger-container">
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
          <div className="burger-bar"></div>
        </div>
        <div className="menu-text-container">
          {(this.props.layoutContext.locale === 'no') ? 'MENY' : 'MENU'}
        </div>


        {
          this.state.showMenu
            ? (
              <div className="drop-menu-container">
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
