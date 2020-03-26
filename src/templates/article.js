import React from "react"
import { Link } from "gatsby"
import styles from "../style/article.module.css"
import Map from "../components/map.js"

const ReactMarkdown = require("react-markdown")

function getLocalWord(localizationArray, key, locale) {
  for(let i = 0 ; i<localizationArray.length; i++){
    if(localizationArray[i].key.toLowerCase() === key.toLowerCase()){
      for (let j = 0; j < localizationArray[i].translations.length; j++) {
        const element = localizationArray[i].translations[j];
        if(element.language.toLowerCase() === locale.toLowerCase()){
          return element.word;
        }
      }
    }
  }
  return "Word not found";
}

function ContactInfo(props) {
  const elements = [];
  var locale = props.locale;
  if(props.node.contactInfo.emailAddress){
    elements.push(
      <div className={styles.contactInfo}>
        <span className={styles.contactInfoHeader}>{getLocalWord(props.localization, "email", locale) + ": "}</span>
        <a href={"mailto: " + props.node.contactInfo.emailAddress}>{props.node.contactInfo.emailAddress}</a>
      </div>)
  }if(props.node.contactInfo.telephoneNumber){
    elements.push(
      <div className={styles.contactInfo}>
        <span className={styles.contactInfoHeader}>{getLocalWord(props.localization, "telephone", locale) + ": "}</span>
        <a href={"tel: " + props.node.contactInfo.telephoneNumber}>{props.node.contactInfo.telephoneNumber}</a>
      </div>)
  }if(props.node.contactInfo.linkToWebsite){
    elements.push(<div className={styles.contactInfo}>
      <span className={styles.contactInfoHeader}>{getLocalWord(props.localization, "website", locale) + ": "}</span>
      <Link to={props.node.contactInfo.linkToWebsite}>
      {(props.node.contactInfo.textToShow) ? 
      props.node.contactInfo.textToShow :
      props.node.contactInfo.linkToWebsite}
      </Link></div>)
  }
  console.log(elements);
  if(elements.length > 0) return <div><h3 className={styles.subheading}>{getLocalWord(props.localization,"contactInfo",locale)}</h3><div>{elements}</div></div>
  else return "";
}

function OpeningHours(props) {
  const elements = [];
  var locale = props.locale;
  if(props.node.openingHours && props.node.openingHours.content){
    elements.push(<h3 className={styles.subheading}>{getLocalWord(props.localization,"openingHours",locale)}</h3>);
    elements.push(<ReactMarkdown source={props.node.openingHours.content}></ReactMarkdown>)
  }
  if(elements.length>0) return <div>{elements}</div>
  else return "";
}

const Article = ({pageContext}) => {
  console.log(pageContext);
  return (
    <div id="outer-container">
      <div id="inner-container">
        <h2>{pageContext.node.title}</h2>
        <ReactMarkdown source={pageContext.node.content.content}></ReactMarkdown>
        <OpeningHours node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale}/>
        <ContactInfo node={pageContext.node} localization={pageContext.localization} locale={pageContext.locale}/>
        <Map location={{lat: pageContext.node.address.lat, lng: pageContext.node.address.lng}} address={pageContext.node.address.address} persistentDisabled={false} />
      </div>
    </div>
  )
}

export default Article
