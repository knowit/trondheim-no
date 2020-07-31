import React from "react"
import { Router } from "@reach/router"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import Loader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons"
import { Online, Offline } from "react-detect-offline"

library.add(fas)

export const query = graphql`
  query EventsPageQuery($nodeId: String) {
    node: flamelinkListingPageContent (id: {eq: $nodeId}) {
      id
      flamelink_locale
      localTitle
      textOnPage
      path
      localizedPaths {
        locale
        path
      }
    }

    localization: flamelinkListingPageLocalizationContent (flamelink_locale: {eq: "no"}){
      id
      translations {
        key
        translations{
          language
          word
        }
      }
    }
  }
`

const trdEventsUrl = `https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents?numEvents=20`

// Rendered at client

class EventsView extends React.Component {

  constructor(props) {
    super(props)
    this.state = { loading: true, loadError: false, events: [] }
  }

  componentDidMount() {
    console.log("Fetching events from trdevents.no...")
    fetch(trdEventsUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Fetch complete!")
        this.setState({ loading: false, events: data })
      }).catch(error => {
        console.log(error)
        this.setState({ loadError: true })
      })
  }

  render() {
    const categoriesString = (event) => event.categories
      .map(category =>
        singleCategoryString(category)
      )
      .join(',\t')

    const singleCategoryString = (fullText) => fullText
      .split('_')
      .map(word =>
        `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
      )
      .join(' ')

    const monthName = (month) => {
      const monthArray = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
      return monthArray[month]
    }

    const timeString = (event) => {
      const date = new Date(event.startDate)
      const dateString = `${date.getDate()}. ${monthName(date.getMonth())}`

      const ticketString = `CC: ${event.regularPrice},- ${(event.reducedPrice && event.reducedPrice.length !== 0) ? `/ ${event.reducedPrice},-` : ''}`
      const freeString = LocalizationHelper.getLocalWord(this.props.localization, "free", this.props.locale)

      const priceString = `${event.priceOption === 'non-gratis' ? ticketString : freeString}`

      return `${dateString} @ ${event.startTime} | ${priceString}`
    }

    const EventInfoRow = (props) => (
      <div className="event-info-row">
        <div className="event-icon">
          <FontAwesomeIcon icon={props.icon} size="xs" />
        </div>
        <span className="event-info-text">{props.text}</span>
      </div>
    )


    const Location = ({ event }) => (
      <EventInfoRow icon="location-arrow" text={event.venueObj ? event.venueObj.name : ''} />
    )

    const Categories = ({ event }) => (
      <EventInfoRow icon="tags" text={categoriesString(event)} />
    )

    const Time = ({ event }) => (
      <EventInfoRow icon="clock" text={timeString(event)} />
    )

    const ErrorMessage = () => (
      <p>
        <Online>
          {this.props.locale === 'no'
            ? 'Noe gikk galt! Prøv igjen senere.'
            : 'Something went wrong! Try again later.'}
        </Online>
        <Offline>
          {this.props.locale === 'no'
            ? 'Noe gikk galt! Sørg for at du er koblet til internett og prøv igjen.'
            : 'Something went wrong! Make sure you are connected to the internet and try again.'}
        </Offline>
      </p>
    )

    const Loading = () => (
      <div id="events-loading-container">
        {this.state.loadError ? (null) : (
          <div id="events-loading-spinner">
            <Loader loading={this.state.loading} />
          </div>
        )}

        {this.state.loadError
          ? (<ErrorMessage />)
          : (<p>
            {LocalizationHelper
              .getLocalWord(this.props.localization, "loading", this.props.locale)}
          </p>
          )}

      </div>
    )



    const Content = () => {
      return (
        this.state.loading

          ? (<Loading />)

          : (<div id="articles-container">
            {this.state.events.map(event => {
              return (
                <div key={event.id} className="article-container">
                  <a href={event.eventLink}>
                    <img className="article-thumbnail" alt={event.title_nb} src={event.imageURL} />
                  </a>
                  <div className="article-info-container">
                    <h2><a href={event.eventLink}>{event.title_nb}</a></h2>
                    <div className="event-info-container">
                      <Location event={event} />
                      <Categories event={event} />
                      <Time event={event} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>)
      )
    }

    return (
      <div id="events-content-container">
        <Content />
        {this.state.loading ? null
          : (
            <div id="events-more-container">
              <a id="events-more-button" href="https://trdevents.no" target="_blank" rel="noreferrer">
                {LocalizationHelper.getLocalWord(this.props.localization, "more-events", this.props.locale)}
              </a>
            </div>
          )}
      </div>
    )
  }
}



// Rendered server side

export default ({ data }) => {

  return (
    <Layout
      locale={data.node.flamelink_locale}
      localizedPaths={data.node.localizedPaths}>

      <div id="outer-container">

        <div id="inner-container">
          <div id="articles-header">
            <h2>{data.node.localTitle}</h2>
            <p>{data.node.textOnPage}</p>
            <Link
              id="english-button"
              to={data.node.localizedPaths.find(item => item.locale !== data.node.flamelink_locale).path}>
              {LocalizationHelper.getLocalWord(data.localization.translations, "changeLanguage", data.node.flamelink_locale)}
            </Link>
          </div>


          <Router basepath={data.node.path}>
            <EventsView path='/'
              localization={data.localization.translations}
              locale={data.node.flamelink_locale} />
          </Router>

        </div>
      </div>
    </Layout>
  )
}
