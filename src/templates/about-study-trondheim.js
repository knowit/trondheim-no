import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/about-study-trondheim.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"
import Img from "gatsby-image"

export default ({ data }) => {
  const ParsedHTML = () => {
    if (!data.node.content) {
      return null
    } else {
      return (
        <HTMLContent
          htmlContent={data.node.content}
          resizeImg={true}
          dropShadow={true}
        />
      )
    }
  }
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
          .map(function (node, key) {
            if (node.profilePicture) {
              return (
                <ContactPerson person={node}/>
              )
            } else {
              return null
            }
          })}
      </div>
    )
  }
  const InternalLinks = () => {
    return (
      <div id="profiles-container">
        linker her
      </div>
    )
  }
  const Articles = () => {
    return (
      <div id="profiles-container">
        artikler her
      </div>
    )
  }
  const OtherActivities = () => {
    return (
      <div id="profiles-container">
        Andre aktiviteter her
      </div>
    )
  }
  console.log(data)
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
      <InternalLinks/>
      <Articles/>
      <OtherActivities/>
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
    }
  }
`
