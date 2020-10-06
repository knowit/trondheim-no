import React from "react"
import styles from "../style/article.module.css"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import Img from "gatsby-image"
import { Online, Offline } from "react-detect-offline"
import HTMLContent from "../components/html-content"
import Map, { LoadScript } from "../components/map"
import { Router } from "@reach/router"
import { graphql } from "gatsby"
import SEO from "../components/seo"

const ContactInfoSpan = ({ localization, locale, wordKey }) => {
  return (
    <span className={styles.contactInfoHeader}>
      {LocalizationHelper.getLocalWord(localization, wordKey, locale) + ": "}
    </span>
  )
}

const ContactInfo = (props) => {
  if (!props.node.contactInfo && !props.node.address.address) return ""

  const elements = []
  var index = 0
  if (props.node.address) {
    if (props.node.address.address) {
      elements.push(
        <div key={index++} className={styles.contactInfo}>
          <ContactInfoSpan
            localization={props.localization}
            locale={props.locale}
            wordKey={"address"}
          />
          <span>{props.node.address.address}</span>
        </div>
      )
    }
  }
  if (props.node.contactInfo) {
    if (props.node.contactInfo.emailAddress) {
      elements.push(
        <div key={index++} className={styles.contactInfo}>
          <ContactInfoSpan
            localization={props.localization}
            locale={props.locale}
            wordKey={"email"}
          />
          <a href={"mailto: " + props.node.contactInfo.emailAddress}>
            {props.node.contactInfo.emailAddress}
          </a>
        </div>
      )
    }
    if (props.node.contactInfo.telephoneNumber) {
      elements.push(
        <div key={index++} className={styles.contactInfo}>
          <ContactInfoSpan
            localization={props.localization}
            locale={props.locale}
            wordKey={"telephone"}
          />
          <a href={"tel: " + props.node.contactInfo.telephoneNumber}>
            {props.node.contactInfo.telephoneNumber}
          </a>
        </div>
      )
    }
    if (props.node.contactInfo.linkToWebsite) {
      elements.push(
        <div key={index++} className={styles.contactInfo}>
          <ContactInfoSpan
            localization={props.localization}
            locale={props.locale}
            wordKey={"website"}
          />
          <a href={props.node.contactInfo.linkToWebsite}>
            {props.node.contactInfo.textToShow
              ? props.node.contactInfo.textToShow
              : props.node.contactInfo.linkToWebsite}
          </a>
        </div>
      )
    }
  }

  if (elements.length > 0)
    return (
      <div>
        <h3 className={styles.subheading}>
          {LocalizationHelper.getLocalWord(
            props.localization,
            "contactInfo",
            props.locale
          )}
        </h3>
        <div>{elements}</div>
      </div>
    )
  else return ""
}

const OpeningHours = (props) => {
  const elements = []
  var index = 0
  if (props.node.openingHours && props.node.openingHours.content) {
    elements.push(
      <h3 key={index++} className={styles.subheading}>
        {LocalizationHelper.getLocalWord(
          props.localization,
          "openingHours",
          props.locale
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

const getLocation = (obj, latKey, lngKey) => {
  if (obj && obj[latKey] && obj[lngKey]) {
    return {
      lat: Number(obj[latKey]),
      lng: Number(obj[lngKey]),
    }
  }
}

export default ({ data }) => {
  // prettier-ignore
  const location = getLocation(
    data.flamelinkArticleContent,
    "latitude",
    "longitude"
  ) || getLocation(
    data.flamelinkArticleContent.address, 
    "lat", 
    "lng"
  ) || getLocation(
    data.flamelinkArticleContent.latLong,
    "latitude",
    "longitude"
  )

  const defaultLocation = {
    lat: 63.4305149,
    lng: 10.3950528,
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
        width: imageNode.childImageSharp.fixed.width,
        height: imageNode.childImageSharp.fixed.height,
      }
      return (
        <div className="offline-map-container" style={styles}>
          <Img
            className="offline-map-image"
            fixed={imageNode.childImageSharp.fixed}
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

  return (
    <Layout
      locale={data.flamelinkArticleContent.flamelink_locale}
      localizedPaths={data.flamelinkArticleContent.localizedPaths}
    >
      <SEO
        title={data.flamelinkArticleContent.title}
        locale={data.flamelinkArticleContent.flamelink_locale}
        keywords={[]}
      />

      <div id="outer-container">
        <div id="inner-container">
          <h2 id="article-title">{data.flamelinkArticleContent.title}</h2>
          <ParsedHTML />
          <OpeningHours
            node={data.flamelinkArticleContent}
            localization={data.flamelinkArticleLocalizationContent.translations}
            locale={data.flamelinkArticleContent.flamelinklocale}
          />
          <ContactInfo
            node={data.flamelinkArticleContent}
            localization={data.flamelinkArticleLocalizationContent.translations}
            locale={data.flamelinkArticleContent.flamelink_locale}
          />
          <Online>
            <LoadScript>
              <Router basepath={data.flamelinkArticleContent.path}>
                <Map
                  path="/"
                  locationMarker={location ? location : defaultLocation}
                  markers={location ? markers : null}
                  zoom={15}
                  width="100%"
                  height="400px"
                />
              </Router>
            </LoadScript>
          </Online>

          <Offline>
            <OfflineMap />
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
            fixed(width: 320) {
              ...GatsbyImageSharpFixed_noBase64
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
