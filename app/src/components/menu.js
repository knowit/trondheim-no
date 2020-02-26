
import React from 'react';
import "../style/navigation.css"

export class BurgerMenu extends React.Component {

  constructor() {
    super();

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
          MENY
        </div>


        {
          this.state.showMenu
            ? (
              <div className="drop-menu-container">
                Hello world
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
