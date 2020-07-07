import React from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import Loader from "react-spinners/ClipLoader";

class EventsView extends React.Component {

  constructor(props) {
    super(props)
    this.state = { loading: true }
    this.loadingComplete = this.loadingComplete.bind(this)
  }

  loadingComplete() {
    this.setState({ loading: false })
  }

  render() {

    const Content = () => {
      return (
        this.state.loading

          ? (<div id="events-loading-container">
            <div id="events-loading-spinner">
              <Loader loading={this.state.loading} />
            </div>

            <p>{LocalizationHelper.getLocalWord(this.props.pageContext.localization, "loading", this.props.pageContext.locale)}</p>
          </div>)

          : (<div id="events-data-container">

          </div>)
      )
    }

    return (
      <div id="events-content-container">
        <Content />
      </div>
    )
  }

}


const EventsPage = ({ pageContext }) => {

  return (
    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">

        <div id="inner-container">
          <div id="articles-header">
            <h2>{pageContext.node.localTitle}</h2>
            <p>{pageContext.node.textOnPage}</p>
            <Link
              id="english-button"
              to={pageContext.node.localizedPaths.find(item => item.locale !== pageContext.locale).path}>
              {LocalizationHelper.getLocalWord(pageContext.localization, "changeLanguage", pageContext.locale)}
            </Link>
          </div>

          <EventsView pageContext={pageContext} />

        </div>
      </div>
    </Layout>
  )
}


export default EventsPage;