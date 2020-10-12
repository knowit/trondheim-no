import React from "react"
import HTMLContent from "../components/html-content"
import Layout from "../layouts/layout"
import "../style/about-study-trondheim.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"

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
  const HeaderImage = ({ bannerImage }) => {
    return (
      <div id="header-container">
        <BackgroundImage
          id="header-image"
          Tag="section"
          fluid={bannerImage.frontImage[0].localFile.childImageSharp.fluid}
          alt={bannerImage.alt}
        >
        </BackgroundImage>
      </div>
    )
  }
  const ContentText = () => {
    console.log(<HTMLContent
      htmlContent={data.flamelinkAboutStudyTrondheimContent.children[1].internal.content}
      resizeImg={true}
      dropShadow={true}
    />)
    return (
      <div id="content-text-container">
        <HTMLContent
          htmlContent={data.flamelinkAboutStudyTrondheimContent.children[0].internal.content}
        />
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
        bannerImage={data.flamelinkAboutStudyTrondheimContent.children[2]}
      />
      {data.flamelinkAboutStudyTrondheimContent.children[1].internal.content}
      <ContentText
        />
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
      
      children {
        internal{
          content
        }
        ... on FlamelinkAboutStudyTrondheimContentFieldBannerImage {
          alt
          frontImage {
            localFile {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
