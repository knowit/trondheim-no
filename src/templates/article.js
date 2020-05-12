import React from "react"
import { Link } from "gatsby"
import styles from "../style/article.module.css"
import Map from "../components/map.js"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { MDXRenderer } from "gatsby-mdx-fix"
import { MDXProvider } from "@mdx-js/react"
import { GoogleMapsUrlHelper } from "../helpers/url-helper"

function ContactInfo(props) {

  if (!props.node.contactInfo) return "";

  const elements = [];
  var locale = props.locale;
  if (props.node.contactInfo.emailAddress) {
    elements.push(
      <div className={styles.contactInfo}>
        <span className={styles.contactInfoHeader}>{LocalizationHelper.getLocalWord(props.localization, "email", locale) + ": "}</span>
        <a href={"mailto: " + props.node.contactInfo.emailAddress}>{props.node.contactInfo.emailAddress}</a>
      </div>)
  } if (props.node.contactInfo.telephoneNumber) {
    elements.push(
      <div className={styles.contactInfo}>
        <span className={styles.contactInfoHeader}>{LocalizationHelper.getLocalWord(props.localization, "telephone", locale) + ": "}</span>
        <a href={"tel: " + props.node.contactInfo.telephoneNumber}>{props.node.contactInfo.telephoneNumber}</a>
      </div>)
  } if (props.node.contactInfo.linkToWebsite) {
    elements.push(<div className={styles.contactInfo}>
      <span className={styles.contactInfoHeader}>{LocalizationHelper.getLocalWord(props.localization, "website", locale) + ": "}</span>
      <Link to={props.node.contactInfo.linkToWebsite}>
        {(props.node.contactInfo.textToShow) ?
          props.node.contactInfo.textToShow :
          props.node.contactInfo.linkToWebsite}
      </Link></div>)
  }
  console.log(elements);
  if (elements.length > 0) return <div><h3 className={styles.subheading}>{LocalizationHelper.getLocalWord(props.localization, "contactInfo", locale)}</h3><div>{elements}</div></div>
  else return "";
}

function OpeningHours(props) {
  const elements = [];
  var locale = props.locale;
  if (props.node.openingHours && props.node.openingHours.content) {
    elements.push(<h3 className={styles.subheading}>{LocalizationHelper.getLocalWord(props.localization, "openingHours", locale)}</h3>);
    elements.push(
      <MDXProvider>
        <MDXRenderer title="Article">{props.node.openingHours.childMdx.code.body}</MDXRenderer>
      </MDXProvider>
    )
  }
  if (elements.length > 0) return <div>{elements}</div>
  else return "";
}

const Article = ({ pageContext }) => {

  const location = GoogleMapsUrlHelper.getLocation(pageContext.node)
  const address = GoogleMapsUrlHelper.getAddress(pageContext.node)
  const markers = [location]

  return (

    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">
          <h2>{pageContext.node.title}</h2>
          <MDXProvider>
            <MDXRenderer title="Article">{pageContext.node.content.childMdx.code.body}</MDXRenderer>
          </MDXProvider>
          <OpeningHours node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale} />
          <ContactInfo node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale} />
          <Map location={location} address={address} markers={markers} zoom={15} persistentDisabled={false}
            width="100%" height="400px" />
        </div>
      </div>
    </Layout>
  )
}

export default Article
