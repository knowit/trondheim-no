import React from "react"
import styles from "../style/article.module.css"
import Layout from "../layouts/layout"
import { getLocalWord } from "../helpers/helpers"
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
      {getLocalWord(localization, wordKey, locale) + ": "}
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
        <h2 className={styles.subheading}>
          {getLocalWord(props.localization, "contactInfo", props.locale)}
        </h2>
        <div>{elements}</div>
      </div>
    )
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

export default ({ data, pageContext }) => {
  const node =
    pageContext.schema === "studentArticle" ? data.studentArticle : data.article

  // prettier-ignore
  const location = getLocation(
    node,
    "latitude",
    "longitude"
  ) || getLocation(
    node.address, 
    "lat", 
    "lng"
  ) || getLocation(
    node.latLong,
    "latitude",
    "longitude"
  )

  const markers = [
    {
      id: node._fl_meta_.fl_id,
      title: node.title,
      url: node.path,
      location: location,
      parent: null,
    },
  ]

  const ParsedHTML = () => {
    if (!node.content) {
      return null
    } else {
      return <HTMLContent htmlContent={node.content} resizeImg={false} />
    }
  }

  const OfflineMap = () => {
    const imageNode = node.latLong.googleMapsStaticImage

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
    const copyright = node.copyright
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
    <Layout locale={node.flamelink_locale} localizedPaths={node.localizedPaths}>
      <SEO
        title={node.title}
        locale={node.flamelink_locale}
        keywords={[]}
        pageID={node._fl_meta_.fl_id}
      />

      <div id="outer-container">
        <div id="inner-container">
          <h1 id="article-title">{node.title}</h1>
          <ParsedHTML />
          <ContactInfo
            node={node}
            localization={data.flamelinkArticleLocalizationContent.translations}
            locale={node.flamelink_locale}
          />
          <Online>
            {!!location && (
              <LoadScript>
                <Router basepath={node.path}>
                  <Map
                    path="/"
                    locationMarker={location}
                    markers={location ? markers : null}
                    zoom={15}
                    width="100%"
                    height="400px"
                  />
                </Router>
              </LoadScript>
            )}
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
      ...LocalizationFragment
    }

    article: flamelinkArticleContent(id: { eq: $nodeId }) {
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

    studentArticle: flamelinkStudentArticleContent(id: { eq: $nodeId }) {
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
