import React from "react"
import HTMLContent from "../components/html-content"
import styles from "../style/about-study-trondheim.module.css"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Image from "gatsby-image"
import Img from "gatsby-image"

const HeaderImage = ({ headerImage }) => {
  return (
    <div id={styles.aboutStudyHeaderContainer}>
      <Image
        Tag="section"
        fluid={headerImage.frontImage[0].localFile.childImageSharp.fluid}
        alt={headerImage.alt}
      />
    </div>
  )
}

const ContactPerson = ({ person }) => {
  return (
    <div className={styles.contactPersonContainer}>
      <Img
        className={styles.profilePicture}
        fluid={person.picture[0].localFile.childImageSharp.fluid}
        alt="Profile picture"
      />
      <h3 className={styles.personTitle}>{person.title}</h3>
      <p className={styles.personContactInfo}>{person.name}</p>
      <p className={styles.personContactInfo}>{person.phoneNumber}</p>
      <p className={styles.personContactInfo}>{person.email}</p>
      <p className={styles.personContactInfo}>{person.de}</p>
      <div></div>
    </div>
  )
}

const InternalLink = ({ article }) => {
  return (
    <a className={styles.linkContainer} href={"#" + article.title}>
      <h3 className={styles.linkText}>
        {
          article
            .childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink
            .linkText
        }
      </h3>
      {article.childFlamelinkAboutStudyTrondheimContentFieldArticleArticleLink
        .linkIcon ? (
        <img
          className={styles.linkIcon}
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
      className={styles.studentArticleContainer}
      style={reverse ? { flexDirection: "row-reverse" } : {}}
    >
      <div className={styles.studentArticleContent}>
        <h3 className={styles.studentArticleHeader}>{article.title}</h3>
        <HTMLContent
          htmlContent={{
            content: article.childFlamelinkTextHtmlContentNode.content,
            remoteImages: [],
          }}
        />
      </div>
      <div
        className={
          reverse ? styles.articleBorderBoxReverse : styles.articleBorderBox
        }
      >
        <Img
          className={styles.studentArticleThumbnail}
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
    <div id={article.title} className={styles.otherAcitivityContainer}>
      <Img
        className={styles.otherActitivityThumbnail}
        fluid={article.thumbnail[0].localFile.childImageSharp.fluid}
        alt="Other Activity thumbnail"
      />
      <div className={styles.otherAcitivityContent}>
        <h3 className={styles.otherActivityHeader}>{article.title}</h3>
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
      <div id={styles.contentOuterContainer}>
        <div id={styles.contentTextContainer}>
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
      <div id={styles.contactPersonsContainer}>
        {data.flamelinkAboutStudyTrondheimContent.contactPerson.map(
          (node, iteration) => {
            return <ContactPerson person={node} key={iteration} />
          }
        )}
      </div>
    )
  }

  const InternalLinks = () => {
    return (
      <div id={styles.linksContainer}>
        {data.flamelinkAboutStudyTrondheimContent.article.map(
          (node, iteration) => {
            return <InternalLink article={node} key={iteration} />
          }
        )}
      </div>
    )
  }

  const Articles = () => {
    return (
      <div id={styles.studentArticlesContainer}>
        {data.flamelinkAboutStudyTrondheimContent.article.map(
          (node, iteration) => {
            return (
              <Article
                article={node}
                key={iteration}
                reverse={iteration % 2 === 1}
              />
            )
          }
        )}
      </div>
    )
  }

  const OtherActivities = () => {
    return (
      <div id={styles.otherActivitiesContainer}>
        {data.flamelinkAboutStudyTrondheimContent.otherActivity.map(
          (node, iteration) => {
            return <OtherActivity article={node} key={iteration} />
          }
        )}
      </div>
    )
  }
  return (
    <div id={styles.aboutStudyOuterContainer}>
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
      <div className={styles.uLine}></div>
      <InternalLinks />
      <Articles />
      <h2 id={styles.otherActivitiesHeader}>
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
