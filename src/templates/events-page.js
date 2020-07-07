import React, { useState, useEffect } from "react"
import "../style/listing-page.css"
import LocalizationHelper from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link } from "gatsby"
import Loader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons"

library.add(fas)

const EventsView = ({ pageContext }) => {

  const [state, setState] = useState({ loading: true })
  useEffect(() => {
    fetch(`https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents?numEvents=20`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setState({ loading: false, events: data })
      })
  })


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

    const ticketString = `CC: ${event.regularPrice},- ${(event.reducedPrice && event.reducedPrice.length != 0) ? `/ ${event.reducedPrice},-` : ''}`
    const freeString = LocalizationHelper.getLocalWord(pageContext.localization, "free", pageContext.locale)

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

  const Content = () => {
    return (
      state.loading

        ? (<div id="events-loading-container">
          <div id="events-loading-spinner">
            <Loader loading={state.loading} />
          </div>

          <p>{LocalizationHelper.getLocalWord(pageContext.localization, "loading", pageContext.locale)}</p>
        </div>)

        : (<div id="articles-container">
          {state.events.map(event => {
            return (
              <div key={event.id} className="article-container">
                <a href={event.eventLink}>
                  <img className="article-thumbnail" src={event.imageURL} />
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
    </div>
  )
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