
import React from 'react';
import "../style/navigation.css"

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
          MENY
        </div>


        {
          this.state.showMenu
            ? (
              <div className="drop-menu-container">
                {this.props.menuData.map(function (node, key) {
                  console.log(node)
                  return (
                    <div class="drop-menu-item-container">
                      <a href={node.node.slug}>{node.node.navigationTitle}</a>
                    </div>
                  )
                })}
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
