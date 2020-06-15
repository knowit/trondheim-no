import React from "react"
import "../style/listing-page.css"

class LSCheckboxes extends React.Component {


  constructor(props) {

    super(props)
  }

  render() {

    var items = []
    var i = 0
    while (i < this.props.checked.length) {
      items.push(
        <label className="map-checkbox-container" key={i}>
          <input
            name={this.props.listingPages[i]}
            type="checkbox"
            checked={this.props.checked[i]}
            onChange={() => {
              this.props.onChange(i, this.props.listingPages[i], !this.props.checked[i])
            }} />
          {this.props.listingPages[i]}
        </label>
      )
      i += 1
    }

    return (
      <form className="map-checkbox-form">
        {items}
      </form>
    )
  }


}


export default LSCheckboxes