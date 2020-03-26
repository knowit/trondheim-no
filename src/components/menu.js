
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
      <div class="menu-container" onClick={this.showMenu}>
        <div class="burger-container">
          <div class="burger-bar"></div>
          <div class="burger-bar"></div>
          <div class="burger-bar"></div>
        </div>
        <div class="menu-text-container">
          {(this.props.layoutContext.locale === 'no') ? 'MENY' : 'MENU'}
        </div>


        {
          this.state.showMenu
            ? (
              <div className="drop-menu-container">
                {this.props.layoutContext.menuData.map(function (node, key) {
                  return (
                    <Link className="drop-menu-item-container"
                      to={(node.locale === 'no') ? `/${node.slug}` : `/en/${node.slug}`}>
                      {node.title}
                    </Link>
                  )
                })}

                <Link
                  className="drop-menu-item-container"
                  to={(this.props.layoutContext.locale === 'no') ? `/en/` : `/`}>

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
