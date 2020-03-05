import React from "react"
import { Link } from "gatsby"
import "../style/navigation.css"
import { BurgerMenu } from "./menu.js"

export default class Navigation extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="navigation-container">

        <BurgerMenu menuData={this.props.menuData}></BurgerMenu>

        <div class="logo-container">
          <Link id="trondheimno-link" to="/">TRONDHEIM.NO</Link>

          <div class="logo">
            <img alt="logo" src={this.props.logoUrl}></img>
          </div>
        </div>
      </div>
    )
  }

}


