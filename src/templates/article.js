import React from "react"
import { Link } from "gatsby"
import styles from "../style/article.module.css"
import Map from "../components/map.js"
import Layout from "../layouts/layout"
import LocalizationHelper from "../helpers/helpers"
import { GoogleMapsUrlHelper } from "../helpers/url-helper"
import Img from "gatsby-image"
import ReactDOMHelper from "../helpers/react-dom-helper"


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
  if (elements.length > 0) return <div><h3 className={styles.subheading}>{LocalizationHelper.getLocalWord(props.localization, "contactInfo", locale)}</h3><div>{elements}</div></div>
  else return "";
}

function OpeningHours(props) {
  const elements = [];
  var locale = props.locale;
  if (props.node.openingHours && props.node.openingHours.content) {
    elements.push(<h3 className={styles.subheading}>{LocalizationHelper.getLocalWord(props.localization, "openingHours", locale)}</h3>);
    elements.push(
      <div dangerouslySetInnerHTML={{ __html: props.node.openingHours.content }}></div>
    )
  }
  if (elements.length > 0) return <div>{elements}</div>
  else return "";
}



const Article = ({ pageContext }) => {

  const location = GoogleMapsUrlHelper.getLocation(pageContext.node)
  const address = GoogleMapsUrlHelper.getAddress(pageContext.node)


  const HTMLContent = ({ htmlContent }) => {


    const element = ReactDOMHelper.parseToReact(htmlContent)
    const reactComponent = ReactDOMHelper.buildReactComponent(htmlContent,
      (props, index) => {
        const imageNode = pageContext.node.content.remoteImages.find(n => { return n.url === props.src })
        if (imageNode) {

          const styles = {

            width: imageNode.childImageSharp.fluid.presentationWidth,
            height: imageNode.childImageSharp.fluid.presentationHeight,
            margin: '1em 0'

          }

          return <div className="article-content-image-container" style={styles}>
            <Img
              className='article-content-image'
              key={index}
              fluid={imageNode.childImageSharp.fluid}
              alt={props.alt}>
            </Img>
          </div>

        }
        else {
          return <div></div>
        }
      })


    console.log(element)

    return reactComponent
  }


  return (

    <Layout layoutContext={pageContext.layoutContext}>
      <div id="outer-container">
        <div id="inner-container">
          <h2>{pageContext.node.title}</h2>
          <HTMLContent htmlContent={pageContext.node.content.content}></HTMLContent>
          <OpeningHours node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale} />
          <ContactInfo node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale} />
          <Map location={location} address={address} markers={pageContext.markers} zoom={15} persistentDisabled={false}
            width="100%" height="400px" />
        </div>
      </div>
    </Layout>
  )
}

export default Article
