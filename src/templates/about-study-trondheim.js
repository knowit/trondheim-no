import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/about-study-trondheim.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"
import articleList from "../components/article-list"

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
        <h3>
          <div className="person-title">
            {person.title}
          </div>
        </h3>
        <p className="person-name">
          {person.name}
        </p>
        <p className="person-tlf">
          {person.phoneNumber}
        </p>
        <p className="person-email">
          {person.email}
        </p>
        <p className="person-description">
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
        {article.articleLink.linkIcon ? (
          <Img
            className="student-column-image"
            fluid={article.articleLink.linkIcon.localFile.childImageSharp.fluid}
            alt="LinkIcon"
          />
        ) : null}
        <p className="internal-link-text">{article.articleLink.linkText}</p>
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
  const Article = ({article}) => {
    return (
      <div id={article.title} className="student-article-container">
        <div class="student-article-content">
          <HTMLContent
              htmlContent={{content: article.content, remoteImages: [] }}
            />
        </div>
        <Img
          className="student-article-thumbnail"
          fluid={
            article.thumbnail[0].localFile.childImageSharp.fluid
          }
          alt="Article thumbnail"
        />
      </div>
    )
  }
  const Articles = ({articles}) => {
    return (
      <div id="student-articles-container">
        {articles.map(function (node, iteration) {
              return (
                <Article article={node} key={iteration}/>
              )
            }
          )}
      </div>
    )
  }
  const OtherActivity = ({article}) => {
    return (
      <div id={article.title} className="other-acitivity-container">
        <div class="other-acitivity-content">
          <HTMLContent
              htmlContent={{content: article.content, remoteImages: [] }}
            />
        </div>
        <Img
          className="other-acitivity-thumbnail"
          fluid={
            article.thumbnail[0].localFile.childImageSharp.fluid
          }
          alt="Other Activity thumbnail"
        />
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
    <div id="outer-container">
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
      <h3>Other Activities</h3>
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
              fluid(maxWidth: 2400, quality: 90) {
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
              fluid(maxWidth: 1200, quality: 90) {
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
              fluid(maxWidth: 1200, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
