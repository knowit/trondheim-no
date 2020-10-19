import React from "react"
import HTMLContent from "../components/html-content"
import "../style/about-study-trondheim.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"

const HeaderImage = ({ headerImage }) => {
  return (
    <div id="about-study-header-container">
      <BackgroundImage
        id="header-image"
        Tag="section"
        fluid={headerImage.frontImage[0].localFile.childImageSharp.fluid}
        alt={headerImage.alt}
      ></BackgroundImage>
    </div>
  )
}

const ContactPerson = ({ person }) => {
  return (
    <div className="contact-person-container">
      <Img
        className="profile-picture"
        fluid={person.picture[0].localFile.childImageSharp.fluid}
        imgStyle={{ "object-position": "50% 12%" }}
        alt="Profile picture"
      />
      <h3 className="person-title">{person.title}</h3>
      <p className="person-contact-info">{person.name}</p>
      <p className="person-contact-info">{person.phoneNumber}</p>
      <p className="person-contact-info">{person.email}</p>
      <p className="person-contact-info">{person.de}</p>
      <div></div>
    </div>
  )
}

const InternalLink = ({ article }) => {
  return (
    <a className="link-container" href={"#" + article.title}>
      <h3 className="link-text">
        {
          article
            .childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink
            .linkText
        }
      </h3>
      {article.childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink
        .linkIcon ? (
        <img
          className="link-icon"
          src={
            article
              .childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink
              .linkIcon[0].url
          }
          alt="LinkIcon"
        />
      ) : null}
    </a>
  )
}

const Article = ({ article, reverse }) => {
  return (
    <div
      id={article.title}
      className="student-article-container"
      style={reverse ? { flexDirection: "row-reverse" } : {}}
    >
      <div className="student-article-content">
        <h3 className="student-article-header">{article.title}</h3>
        <HTMLContent
          htmlContent={{
            content: article.childFlamelinkTextHtmlContentNode.content,
            remoteImages: [],
          }}
        />
      </div>
      <div
        className={
          reverse ? "article-border-box-reverse" : "article-border-box"
        }
      >
        <Img
          className="student-article-thumbnail"
          style={
            reverse
              ? { margin: "-40px auto -1px 40px" }
              : { margin: "-40px auto -1px -40px" }
          }
          fluid={article.thumbnail[0].localFile.childImageSharp.fluid}
          alt="Article thumbnail"
        />
      </div>
    </div>
  )
}

const OtherActivity = ({ article }) => {
  return (
    <div id={article.title} className="other-acitivity-container">
      <Img
        className="other-actitivity-thumbnail"
        fluid={article.thumbnail[0].localFile.childImageSharp.fluid}
        alt="Other Activity thumbnail"
        imgStyle={{ "object-position": "40% 13.49%" }}
      />
      <div className="other-acitivity-content">
        <h3 className="other-activity-header">{article.title}</h3>
        <HTMLContent
          htmlContent={{
            content: article.childFlamelinkTextHtmlContentNode.content,
            remoteImages: [],
          }}
        />
      </div>
    </div>
  )
}

export default ({ data }) => {
  const ContentText = () => {
    return (
      <div id="content-outer-container">
        <div id="content-text-container">
          <HTMLContent
            htmlContent={{
              content: data.flamelinkAboutStudyTrondheimContent.content.content,
              remoteImages: [],
            }}
          />
        </div>
      </div>
    )
  }
  
  const ContactPersons = () => {
    return (
      <div id="contact-persons-container">
        {data.flamelinkAboutStudyTrondheimContent.contactPerson.map(function (
          node,
          iteration
        ) {
          return <ContactPerson person={node} key={iteration} />
        })}
      </div>
    )
  }
  
  const InternalLinks = () => {
    return (
      <div id="links-container">
        {data.flamelinkAboutStudyTrondheimContent.article.map(function (node, iteration) {
          return <InternalLink article={node} key={iteration} />
        })}
      </div>
    )
  }
  
  const Articles = () => {
    return (
      <div id="student-articles-container">
        {data.flamelinkAboutStudyTrondheimContent.article.map(function (node, iteration) {
          return (
            <Article
              article={node}
              key={iteration}
              reverse={iteration % 2 === 1}
            />
          )
        })}
      </div>
    )
  }
  
  const OtherActivities = () => {
    return (
      <div id="other-activities-container">
        {data.flamelinkAboutStudyTrondheimContent.otherActivity.map(function (node, iteration) {
          return <OtherActivity article={node} key={iteration} />
        })}
      </div>
    )
  }
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
            ? "Om study tronheim"
            : "About study study trondheim",
        ]}
      />
      <HeaderImage
        headerImage={data.flamelinkAboutStudyTrondheimContent.bannerImage}
      />
      <ContentText />
      <ContactPersons />
      <div className="u-line"></div>
      <InternalLinks />
      <Articles />
      <h2 id="other-activities-header">
        {data.flamelinkAboutStudyTrondheimContent.flamelink_locale === "no"
          ? "Andre aktiviteter i StudyTronheim"
          : "Other activities"}
      </h2>
      <OtherActivities />
    </div>
  )
}

export const query = graphql`
  query AboutStudyTrondheimQuery($nodeId: String) {
    flamelinkAboutStudyTrondheimContent(id: { eq: $nodeId }) {
      id
      flamelink_locale

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
      content {
        content
      }
      contactPerson {
        title
        name
        phoneNumber
        email
        roleDescription
        picture {
          localFile {
            childImageSharp {
              fluid(maxWidth: 600, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      article {
        id
        title
        thumbnail {
          localFile {
            childImageSharp {
              fluid(maxWidth: 600, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink {
          linkText
          linkIcon {
            url
          }
        }
        childFlamelinkTextHtmlContentNode {
          content
        }
      }
      otherActivity {
        title
        childFlamelinkTextHtmlContentNode {
          content
        }
        thumbnail {
          localFile {
            childImageSharp {
              fluid(maxWidth: 600, quality: 90) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
