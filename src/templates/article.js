import React from "react"
import "../style/article.css"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import Img from "gatsby-image"
import { Online, Offline } from "react-detect-offline"
import HTMLContent from "../components/html-content"
import Map from "../components/map.js"
import { Router } from "@reach/router"
import { graphql } from "gatsby"

const listingPageColor = "#F5B891"

function ContactInfo(props) {
  if (!props.node.contactInfo && !props.node.address.address) return ""

  const elements = []
  var locale = props.locale
  var index = 0
  if (props.node.address) {
    if (props.node.address.address) {
      elements.push(
        <div key={index++} className="contactInfo">
          <span>{props.node.address.address}</span>
        </div>
      )
    }
  }
  if (props.node.contactInfo) {
    if (props.node.contactInfo.emailAddress) {
      elements.push(
        <div key={index++} className="contactInfo">
          <a href={"mailto: " + props.node.contactInfo.emailAddress}>
            {props.node.contactInfo.emailAddress}
          </a>
        </div>
      )
    }
    if (props.node.contactInfo.telephoneNumber) {
      elements.push(
        <div key={index++} className="contactInfo">
          <a href={"tel: " + props.node.contactInfo.telephoneNumber}>
            {props.node.contactInfo.telephoneNumber}
          </a>
        </div>
      )
    }
    if (props.node.contactInfo.linkToWebsite) {
      elements.push(
        <div key={index++} className="contactInfo">
          <span className="contactInfoHeader">
          </span>
          <a href={props.node.contactInfo.linkToWebsite}>
            {props.node.contactInfo.linkToWebsite}
          </a>
        </div>
      )
    }
  }

  if (elements.length > 0)
    return (
      <div className="contact-info-container" style={{backgroundColor:listingPageColor}}>
          <div key={index++} className="contactInfo">
          {LocalizationHelper.getLocalWord(
            props.localization,
            "contactInfo",
            locale
          )}:
          </div>
        {elements}
      </div>
    )
  else return ""
}

function OpeningHours(props) {
  const elements = []
  var index = 0
  var locale = props.locale
  if (props.node.openingHours && props.node.openingHours.content) {
    elements.push(
      <h3 key={index++} className="subheading">
        {LocalizationHelper.getLocalWord(
          props.localization,
          "openingHours",
          locale
        )}
      </h3>
    )
    elements.push(
      <div
        key={index++}
        dangerouslySetInnerHTML={{ __html: props.node.openingHours.content }}
      ></div>
    )
  }
  if (elements.length > 0) return <div key={index++}>{elements}</div>
  else return ""
}

export default ({ data }) => {
  let address =
    data.flamelinkArticleContent.address &&
    data.flamelinkArticleContent.address.address
      ? data.flamelinkArticleContent.address.address
      : null

  let location = {
    lat: 63.4305149,
    lng: 10.3950528,
  }

  if (
    data.flamelinkArticleContent.latLong &&
    data.flamelinkArticleContent.latLong.latitude &&
    data.flamelinkArticleContent.latLong.longitude
  ) {
    location = {
      lat: Number(data.flamelinkArticleContent.latLong.latitude),
      lng: Number(data.flamelinkArticleContent.latLong.longitude),
    }
  }
  if (
    data.flamelinkArticleContent.address &&
    data.flamelinkArticleContent.address.lat &&
    data.flamelinkArticleContent.address.lng
  ) {
    location = {
      lat: data.flamelinkArticleContent.address.lat,
      lng: data.flamelinkArticleContent.address.lng,
    }
  }
  if (
    data.flamelinkArticleContent.latitude &&
    data.flamelinkArticleContent.longitude
  ) {
    location = {
      lat: data.flamelinkArticleContent.latitude,
      lng: data.flamelinkArticleContent.longitude,
    }
  }

  const markers = [
    {
      id: data.flamelinkArticleContent._fl_meta_.fl_id,
      title: data.flamelinkArticleContent.title,
      url: data.flamelinkArticleContent.path,
      location: location,
      parent: null,
    },
  ]

  const ParsedHTML = () => {
    if (!data.flamelinkArticleContent.content) {
      return null
    } else {
      return (
        <HTMLContent
          htmlContent={data.flamelinkArticleContent.content}
          resizeImg={false}
        />
      )
    }
  }

  const OfflineMap = () => {
    const imageNode = data.flamelinkArticleContent.latLong.googleMapsStaticImage

    if (imageNode != null) {
      const styles = {
        width: imageNode.childImageSharp.fluid.presentationWidth,
        height: imageNode.childImageSharp.fluid.presentationHeight,
      }
      return (
        <div className="offline-map-container" style={styles}>
          <Img
            className="offline-map-image"
            fluid={imageNode.childImageSharp.fluid}
            alt={"Map of location"}
            loading="eager"
          ></Img>
        </div>
      )
    } else {
      return <div></div>
    }
  }

  const Copyright = () => {
    const copyright = data.flamelinkArticleContent.copyright
    if (copyright) {
      if (copyright.content) {
        return (
          <div id="copyright-container" style={{ marginTop: "30px" }}>
            <HTMLContent
              htmlContent={{ content: copyright.content, remoteImages: [] }}
              resizeImg={false}
            />
          </div>
        )
      }
    }
    return null
  }

  const Tags = (props) => (
    <div id="tags-container">
      {props.tags.map(function (tag, key) {
        return (
          <div className="tag" key={tag} style={{backgroundColor: listingPageColor}}>
            {tag}
          </div>
        )
      })}
    </div>
  )

  
  return (
    <Layout
      locale={data.flamelinkArticleContent.flamelink_locale}
      localizedPaths={data.flamelinkArticleContent.localizedPaths}
    >
      <div id="outer-container">
        <div id="inner-container">
          <h2 id="article-title">{data.flamelinkArticleContent.title}</h2>
          <div id="article-content-container">
            <div id="html-content">
              <ParsedHTML />
              <OpeningHours
                node={data.flamelinkArticleContent}
                localization={data.flamelinkArticleLocalizationContent.translations}
                locale={data.flamelinkArticleContent.flamelinklocale}
              />
            </div>
            <Tags tags={data.flamelinkArticleContent.tags}/>
          </div>
          <ContactInfo
            node={data.flamelinkArticleContent}
            localization={data.flamelinkArticleLocalizationContent.translations}
            locale={data.flamelinkArticleContent.flamelink_locale}
          />
          <Online>
            <Router basepath={data.flamelinkArticleContent.path}>
              <Map
                path="/"
                locationMarker={location}
                address={address}
                markers={markers}
                zoom={15}
                persistentDisabled={false}
                width="100%"
                height="400px"
              />
            </Router>
          </Online>

          <Offline>
            <OfflineMap></OfflineMap>
          </Offline>
          <Copyright />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ArticleQuery($nodeId: String) {
    flamelinkArticleLocalizationContent(flamelink_locale: { eq: "no" }) {
      id
      translations {
        key
        translations {
          language
          word
        }
      }
    }

    flamelinkArticleContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      slug
      path
      title
      tags

      _fl_meta_ {
        fl_id
      }

      localizedPaths {
        locale
        path
      }

      copyright {
        title
        content
      }

      contactInfo {
        textToShow
        telephoneNumber
        linkToWebsite
        emailAddress
      }

      address {
        address
        lat
        lng
      }

      latLong {
        latitude
        longitude
        googleMapsStaticImage {
          url
          childImageSharp {
            fluid(maxWidth: 600, quality: 70) {
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

      thumbnail {
        localFile {
          name
          childImageSharp {
            fluid(maxWidth: 340, quality: 70) {
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

      content {
        content
        remoteImages {
          url
          childImageSharp {
            fluid(maxWidth: 1200, quality: 75) {
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
    }
  }
`
