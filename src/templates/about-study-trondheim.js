import React from "react"
import HTMLContent from "../components/html-content"
import "../style/about-study-trondheim.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"

export default ({ data }) => {
  const HeaderImage = ({ headerImage }) => {
    return (
      <div id="header-container">
        <BackgroundImage
          id="header-image"
          Tag="section"
          fluid={headerImage.frontImage[0].localFile.childImageSharp.fluid}
          alt={headerImage.alt}
        >
        </BackgroundImage>
      </div>
    )
  }
  const ContentText = () => {
    return (
      <div id="content-outer-container">
        <div id="content-text-container">
          <HTMLContent
            htmlContent={{ content: data.flamelinkAboutStudyTrondheimContent.content.content, remoteImages: [] }}
          />
        </div>
      </div>
    )
  }
  const ContactPerson = ({person}) => {
    return (
      <div className="contact-person-container">
        <Img
          className="profile-picture"
          fluid={
            person.profilePicture[0].localFile.childImageSharp.fluid
          }
          alt="Profile picture"
        />
        <h3 className="person-title">
            {person.title}
        </h3>
        <p className="person-contact-info">
          {person.name}
        </p>
        <p className="person-contact-info">
          {person.phoneNumber}
        </p>
        <p className="person-contact-info">
          {person.email}
        </p>
        <p className="person-contact-info">
          {person.de}  
        </p> 
      </div>
    )
  }
  const ContactPersons = () => {
    return (
      <div id="contact-persons-container">
        {data.flamelinkAboutStudyTrondheimContent.contactPersons
          .map(function (node, iteration) {
              return (
                <ContactPerson person={node} key={iteration}/>
              )
            }
          )}
      </div>
    )
  }
  const InternalLink = ({article}) => {
    return(
      <a className="link-container" href={"#"+article.title}>
        {article.articleLink.linkIcon && article.articleLink.linkIcon.localFile ? (
          <Img
            className="link-icon"
            fluid={article.articleLink.linkIcon.localFile.childImageSharp.fluid}
            alt="LinkIcon"
          />
        ) : null}
        <h3 className="link-text">{article.articleLink.linkText}</h3>
      </a>
    )
  }
  const InternalLinks = ({articles}) => {
    return(
      <div id="links-container">
        {articles.map(function (node, iteration) {
              return (
                <InternalLink article={node} key={iteration}/>
              )
            }
          )}
      </div>
    )
  }
  const Article = ({article, reverse}) => {
    return (
      <div id={article.title} className="student-article-container" style={reverse ? {flexDirection: "row-reverse"} : {}}>
        <div className="student-article-content">
          <h3 className="student-article-header">
            {article.title}
          </h3>
          <HTMLContent
              htmlContent={{content: article.content, remoteImages: [] }}
            />
        </div>
        <div className="article-border-box">
          <Img
            className="student-article-thumbnail"
            style={reverse ? {margin: "-40px auto -1px 40px"} : {margin: "-40px auto -1px -40px"}}
            fluid={
              article.thumbnail[0].localFile.childImageSharp.fluid
            }
            alt="Article thumbnail"
          />
        </div>
      </div>
    )
  }
  const Articles = ({articles}) => {
    return (
      <div id="student-articles-container">
        {articles.map(function (node, iteration) {
              return (
                <Article article={node} key={iteration} reverse={iteration%2===1}/>
              )
            }
          )}
      </div>
    )
  }
  const OtherActivity = ({article}) => {
    return (
      <div id={article.title} className="other-acitivity-container">
        <Img
          className="other-actitivity-thumbnail"
          fluid={
            article.thumbnail[0].localFile.childImageSharp.fluid
          }
          alt="Other Activity thumbnail"
        />
        <div className="other-acitivity-content">
          <h3 className="other-activity-header">
            {article.title}
          </h3>
          <HTMLContent
              htmlContent={{content: article.content, remoteImages: [] }}
            />
        </div>
      </div>
    )
  }
  const OtherActivities = ({articles}) => {
    return (
      <div id="other-activities-container">
        {articles.map(function (node, iteration) {
              return (
                <OtherActivity article={node} key={iteration}/>
              )
            }
          )}
      </div>
    )
  }
  const articles = data.flamelinkAboutStudyTrondheimContent.articles.filter(o => !o.otherActivities)
  const otherActivities = data.flamelinkAboutStudyTrondheimContent.articles.filter(o => o.otherActivities)
  return (
    <div id="about-study-outer-container">
      <SEO
        title={
          data.flamelinkAboutStudyTrondheimContent.flamelink_locale === "no"
            ? "Om study Trondheim"
            : "About study Trondheim"
        }
        locale={data.flamelinkAboutStudyTrondheimContent.flamelink_locale}
        keywords={[
          data.flamelinkAboutStudyTrondheimContent.flamelink_locale === "no"
            ? "Hjem"
            : "Home",
        ]}
      />
      <HeaderImage
        headerImage={data.flamelinkAboutStudyTrondheimContent.bannerImage}
      />
      <ContentText/>
      <ContactPersons/>
      <InternalLinks articles={articles}/>
      <Articles articles={articles}/>
      <h2 id="other-activities-header">
        Other Activities
      </h2>
      <OtherActivities articles={otherActivities}/>
    </div>
  )
}

export const query = graphql`
  query AboutStudyTrondheimQuery($nodeId: String) {
    flamelinkAboutStudyTrondheimContent(id: { eq: $nodeId }) {
      id
      flamelink_locale
      path
      
      localizedPaths {
        locale
        path
      }
      bannerImage {
        frontImage {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1800, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      content{
        content
      }
      contactPersons {
        title
        name
        email
        phoneNumber
        profilePicture {
          localFile {
            childImageSharp {
              fluid(maxWidth: 600, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      articles {
        title
        otherActivities
        content
        articleLink {
          linkText
        }
        thumbnail{
          localFile {
            childImageSharp {
              fluid(maxWidth: 400, quality: 80) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
