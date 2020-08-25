import React from "react"
import "../style/home.css"
import Layout from "../layouts/layout"
import { Link, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import HTMLContent from "../components/html-content"
import ReactDOMHelper from "../helpers/react-dom-helper"

library.add(fas)

export default ({ data }) => {
  const ImageText = (props) => {
    return <div id="image-text">{props.text}</div>
  }

  const Card = (props) => {
    return (
      <Link to={props.to ? props.to : ""} className={"card-item-container " + props.className}>
        <img src={props.icon.url} alt="icon" />
        <h2>{props.title}</h2>
        {props.subtitle ? <p>{props.subtitle}</p> : null }
      </Link>
    )
  }

  const AttractionsCards = (props) => {
    return (
      <div className="cards-container">
        {props.items.map((item) => {
          return (
            <Card
              className="attractions-background"
              title={item.title}
              subtitle={item.parentListingPage.title}
              to={item.path}
              icon={
                item.frontPageIcon
                  ? item.frontPageIcon[0]
                  : data.flamelinkNewFrontPageContent.attractionsDefaultIcon[0]
              }
            />
          )
        })}
      </div>
    )
  }

  const MapCards = (props) => {
    return (
      <div className="cards-container">
        {props.items.map((item) => {
          return (
            <Card
              className="maps-background"
              title={item.title}
              to={item.mapPath}
              icon={data.flamelinkNewFrontPageContent.mapsDefaultIcon[0]}
            />
          )
        })}
      </div>
    )
  }

  const Attractions = () => {
    return (
      <div id="attractions-container">
        <h2 className="title attractions-background">
          {data.flamelinkNewFrontPageContent.attractionsTitle}
        </h2>
        <AttractionsCards
          items={data.flamelinkNewFrontPageContent.frontPageAttractions}
        />
      </div>
    )
  }

  const Maps = (props) => {
    return (
      <div id="maps-container">
        <h2 className="title maps-background">
          {data.flamelinkNewFrontPageContent.mapsTitle}
        </h2>
        <MapCards items={data.flamelinkNewFrontPageContent.frontPageMaps} />
      </div>
    )
  }

  return (
    <Layout
      locale={data.flamelinkNewFrontPageContent.flamelink_locale}
      localizedPaths={data.flamelinkNewFrontPageContent.localizedPaths}
    >
      <div id="frontpage-container">
        <BackgroundImage
          id="header-image"
          Tag="section"
          fluid={
            data.flamelinkNewFrontPageContent.frontImage[0].localFile
              .childImageSharp.fluid
          }
          alt={data.flamelinkNewFrontPageContent.frontImageAlt}
        >
          <ImageText text={data.flamelinkNewFrontPageContent.frontImageAlt} />
        <div id="chevron-container">
          <FontAwesomeIcon icon="chevron-down" />
        </div>
        </BackgroundImage>
        <div id="overflow-container">
            <Attractions />
            <Maps />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query NewFrontPageQuery($locale: String) {
    flamelinkNewFrontPageContent(flamelink_locale: { eq: $locale }) {
      id
      flamelink_locale
      frontImage {
        localFile {
          name
          childImageSharp {
            fluid {
              base64
              aspectRatio
              src
              srcSet
              sizes
              presentationWidth
              presentationHeight
              originalImg
            }
          }
        }
      }
      frontImageAlt
      attractionsTitle
      attractionsDefaultIcon {
        url
      }
      frontPageAttractions {
        flamelink_id
        title
        path
        parentListingPage {
          title: localTitle
        }
        frontPageIcon {
          url
        }
      }
      mapsTitle
      mapsDefaultIcon {
        url
      }
      frontPageMaps {
        title: mapPageTitle
        mapPath
      }
    }
  }
`
