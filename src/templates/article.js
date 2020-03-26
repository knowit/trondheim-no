import React from "react"
import { Link } from "gatsby"
import styles from "../style/article.module.css"
import Map from "../components/map.js"

const ReactMarkdown = require("react-markdown")

function getLocalWord(localizationArray, key, locale) {
  for(let i = 0 ; i<localizationArray.length; i++){
    if(localizationArray[i].key === key){
      for (let j = 0; j < localizationArray[i].translations.length; j++) {
        const element = localizationArray[i].translations[j];
        if(element.language === locale){
          return element.word;
        }
      }
    }
  }
  return "Word not found";
}

function ContactInfo(props) {
  const elements = [];
  var locale = "no";
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

const Article = ({pageContext}) => {
  console.log(pageContext);
  return (
    <div id="outer-container">
      <div id="inner-container">
        <h2>{pageContext.no.node.title}</h2>
        <ReactMarkdown source={pageContext.no.node.content.content}></ReactMarkdown>
        <ContactInfo node={pageContext.no.node} localization={pageContext.localization}/>
        <Map location={{lat: pageContext.no.node.address.lat, lng: pageContext.no.node.address.lng}}/>
      </div>
    </div>
  )
}

export default Article
