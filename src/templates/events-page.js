import React from "react"
import { Router } from "@reach/router"
import "../style/listing-page.css"
import { getLocalWord } from "../helpers/helpers"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import Loader from "react-spinners/ClipLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { Online, Offline } from "react-detect-offline"
import SEO from "../components/seo"
import { request } from "graphql-request"

library.add(fas)

const EVENTS_URL = process.env.GATSBY_TRD_EVENTS_URL
const EVENTS_QUERY_STRING = `
  query EventsQuery($page: Int) {
    events(page: $page) {
      totalCount
      hasMore
      data {
        id
        mode
        venue {
          id
          name
          location {
            longitude
            latitude
          }
          address
        }
        title_nb
        title_en
        eventLink
        startDate
        startTime
        endDate
        regularPrice
        reducedPrice
        priceOption
        categories
        images {
          urlSmall
          caption
          alt
        }
      }
    }
  }
`

const EventInfoRow = (props) => (
  <div className="event-info-row">
    <div className="event-icon">
      <FontAwesomeIcon icon={props.icon} size="xs" />
    </div>
    <span className="event-info-text">{props.text}</span>
  </div>
)

const Location = ({ event }) => (
  <EventInfoRow
    icon="location-arrow"
    text={event.venue ? event.venue.name : ""}
  />
)

const Categories = ({ event }) => (
  <EventInfoRow
    icon="tags"
    text={event.categories
      .map((category) =>
        category
          .split("_")
          .map(
            (word) =>
              `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
          )
          .join(" ")
      )
      .join(",\t")}
  />
)

const getPriceString = (event, localization, locale) =>
  event.priceOption === "non-gratis" &&
  (event.regularPrice != null || event.reducedPrice != null)
    ? `CC: ${event.regularPrice != null ? `${event.regularPrice},-` : ""}${
        event.regularPrice != null && event.reducedPrice != null ? ` / ` : ""
      }${event.reducedPrice != null ? `${event.reducedPrice},-` : ""}`
    : getLocalWord(localization, "free", locale)

const Time = ({ event, localization, locale }) => {
  const date = new Date(event.startDate)
  const dateString = `${date.getDate()}. ${
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ][date.getMonth()]
  }`
  return (
    <EventInfoRow
      icon="clock"
      text={`${dateString} @ ${event.startTime} | ${getPriceString(
        event,
        localization,
        locale
      )}`}
    />
  )
}

const ErrorMessage = ({ locale }) => (
  <p>
    <Online>
      {locale === "no"
        ? "Noe gikk galt! Prøv igjen senere."
        : "Something went wrong! Try again later."}
    </Online>
    <Offline>
      {locale === "no"
        ? "Noe gikk galt! Sørg for at du er koblet til internett og prøv igjen."
        : "Something went wrong! Make sure you are connected to the internet and try again."}
    </Offline>
  </p>
)

const Loading = ({ locale, localization, loadError }) => (
  <div id="events-loading-container">
    {loadError ? null : (
      <div id="events-loading-spinner">
        <Loader />
      </div>
    )}

    {loadError ? (
      <ErrorMessage locale={locale} />
    ) : (
      <p>{getLocalWord(localization, "loading", locale)}</p>
    )}
  </div>
)

const EventList = ({ events, loading, loadError, localization, locale }) =>
  loading ? (
    <Loading
      locale={locale}
      localization={localization}
      loadError={loadError}
    />
  ) : (
    <div id="articles-container">
      {events.map((event, i) => {
        return (
          <a
            href={event.eventLink}
            key={i}
            className="article-container"
            aria-label={event.title_nb}
          >
            <div>
              <img
                className="events-article-thumbnail"
                alt={event.images[0].alt ? event.images[0].alt : event.title_nb}
                src={event.images[0].urlSmall}
              />
            </div>
            <div className="article-info-container">
              <h2>
                <div>{event.title_nb}</div>
              </h2>
              <div className="event-info-container">
                <Location event={event} />
                <Categories event={event} />
                <Time
                  event={event}
                  localization={localization}
                  locale={locale}
                />
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )

// Dynamic content - Rendered client side
class EventsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isLoadingMore: false,
      loadError: false,
      page: 0,
      events: [],
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    this.setState({
      isLoadingMore: true,
    })
    request(EVENTS_URL, EVENTS_QUERY_STRING, { page: this.state.page })
      .then((data) => {
        this.setState({
          loading: false,
          isLoadingMore: false,
          hasMore: data.events.hasMore,
          page: this.state.page + 1,
          events: [...this.state.events, ...data.events.data],
        })
      })
      .catch((err) => {
        console.error(err)
        this.setState({ loading: false, loadError: true })
      })
  }

  render() {
    return (
      <div id="events-content-container">
        <EventList
          events={this.state.events}
          loading={this.state.loading}
          loadError={this.state.loadError}
          localization={this.props.localization}
          locale={this.props.locale}
        />
        {this.state.loading ? null : (
          <div id="events-more-container">
            <button
              id="events-more-button"
              onClick={this.loadData.bind(this)}
              onKeyDown={(event) =>
                event.key === "Enter" ? this.loadData() : null
              }
            >
              {this.state.isLoadingMore ? (
                <Loader />
              ) : (
                getLocalWord(
                  this.props.localization,
                  "more-events",
                  this.props.locale
                )
              )}
            </button>
          </div>
        )}
      </div>
    )
  }
}

// Static content - Rendered server side
export default ({ data }) => {
  return (
    <Layout
      locale={data.node.flamelink_locale}
      localizedPaths={data.node.localizedPaths}
    >
      <SEO
        title={data.node.localTitle}
        locale={data.node.flamelink_locale}
        keywords={[
          data.node.flamelink_locale === "no" ? "Arrangementer" : "Events",
        ]}
        pageID={data.node._fl_meta_.fl_id}
      />

      <div id="outer-container">
        <div id="inner-container">
          <div id="articles-header">
            <h1>{data.node.localTitle}</h1>
            <p>{data.node.textOnPage}</p>
            <Link
              id="english-button"
              to={
                data.node.localizedPaths.find(
                  (item) => item.locale !== data.node.flamelink_locale
                ).path
              }
            >
              {getLocalWord(
                data.localization.translations,
                "changeLanguage",
                data.node.flamelink_locale
              )}
            </Link>
          </div>

          <Router basepath={data.node.path}>
            <EventsView
              path="/"
              localization={data.localization.translations}
              locale={data.node.flamelink_locale}
            />
          </Router>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query EventsPageQuery($nodeId: String) {
    node: flamelinkListingPageContent(id: { eq: $nodeId }) {
      id
      flamelink_locale

      _fl_meta_ {
        fl_id
      }

      localTitle
      textOnPage
      path
      localizedPaths {
        locale
        path
      }
    }

    localization: flamelinkListingPageLocalizationContent(
      flamelink_locale: { eq: "no" }
    ) {
      id
      translations {
        key
        translations {
          language
          word
        }
      }
    }
  }
`
