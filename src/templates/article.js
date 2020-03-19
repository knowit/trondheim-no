import React from "react"
import { Link } from "gatsby"
import "../style/article.css"
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
  if(props.node.contactInfo.emailAddress){
    elements.push(<p key="email">{props.node.contactInfo.emailAddress}</p>)
  }if(props.node.contactInfo.telephoneNumber){
    elements.push(<p key="phone">{props.node.contactInfo.telephoneNumber}</p>)
  }if(props.node.contactInfo.linkToWebsite){
    elements.push(<p key="link">
      <Link to={props.node.contactInfo.linkToWebsite}>
      {(props.node.contactInfo.textToShow) ? 
      props.node.contactInfo.textToShow :
      props.node.contactInfo.linkToWebsite}
      </Link></p>)
  }
  console.log(elements);
  if(elements.length > 0) return <div><h4>{getLocalWord(props.localization,"contactInfo","no")}</h4><div>{elements}</div></div>
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
        {/*<Map locationString={pageContext.no.node.address}/>*/}
      </div>
    </div>
  )
}

export default Article
