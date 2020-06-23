
const query = `
query {
  allFlamelinkFrontPageCardContent{
    edges{
      node{
        flamelink_id
        flamelink_locale
        index
        title
        textColor
        backgroundColor
        links{
          text
          url
        }
        iconName
        iconColor
      }
    }
  }
  allFlamelinkFrontPageColumnContent{
    edges{
      node{
        flamelink_id
        flamelink_locale
        title
        subTitle
        redirectUrl
        icon {
          localFile {
            childImageSharp {
              fluid (maxWidth: 9999, quality: 100) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
      }
    }
  }
  allFlamelinkListingPageContent {
    edges {
      node {
        id
        _fl_meta_ {
          fl_id
          schema
        }
        slug
        thumbnail {
          localFile {
            name
            childImageSharp {
              fluid(quality: 90) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        flamelink_id
        flamelink_locale
        localTitle
        navigationTitle
        navigationSubtitle
        textOnPage
        showOnFrontPage
        showOnFrontpageColumns
        showInDropMenu
        mapPageTitle
        mapPageDescription
        parentListingPage{
          slug
          _fl_meta_ {
            fl_id
          }
        }
      }
    }
  }
  allFlamelinkArticleLocalizationContent(filter: {flamelink_locale: {eq: "no"}}) {
    edges {
      node {
        id
        translations {
          translations {
            uniqueKey
            language
            word
          }
          key
        }
      }
    }
  }
  allFlamelinkListingPageLocalizationContent(filter: {flamelink_locale: {eq: "no"}}) {
    edges {
      node {
        id
        translations {
          translations {
            uniqueKey
            language
            word
          }
          key
        }
      }
    }
  }
  allFlamelinkLayoutLocalizationContent(filter: {flamelink_locale: {eq: "no"}}) {
    edges {
      node {
        id
        translations {
          translations {
            uniqueKey
            language
            word
          }
          key
        }
      }
    }
  }
  allFlamelinkFrontPageContent {
    edges {
      node {
        _fl_meta_ {
          fl_id
          schema
        }
        flamelink_id
        flamelink_locale
        headerFocusWord
        headerText
        id
        logoImage{
          localFile {
            childImageSharp {
              fluid (quality: 90) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        frontImageAlt
        frontImage{
          localFile {
            childImageSharp {
              fluid (maxWidth: 9999, quality: 100) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        backdropImage{
          localFile {
            childImageSharp {
              fluid (maxWidth: 9999, quality: 100) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        navigationText
      }
    }
  }

  allFlamelinkArticleNewContentFieldContactInfo {
    edges {
      node {
        textToShow
        telephoneNumber
        linkToWebsite
        emailAddress
      }
    }
  }

  allFlamelinkArticleNewContent {
    edges {
      node {
        _fl_meta_ {
          fl_id
          schema
        }
        flamelink_locale
        flamelink_id
        id
        openingHours {
          content
        }
        parentContent {
          _fl_meta_ {
            fl_id
            schema
          }
          id
          slug
        }
        slug
        title
        tags
        thumbnail {
          localFile {
            childImageSharp {
              fluid (quality: 90) {
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              }
            }
          }
        }
        
        content {
          content
          remoteImages {
            url
            childImageSharp {
              fluid (quality: 90){
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              } 
            }
          }
        }
        contactInfo {
          textToShow
          telephoneNumber
          linkToWebsite
          emailAddress
        }
        address {
          address
          lat
          lng
        }
        latLong {
          latitude
          longitude
          googleMapsStaticImage {
            url
            childImageSharp {
              fluid (quality: 90){
                base64
                aspectRatio 
                src 
                srcSet 
                sizes
                presentationWidth
                presentationHeight
                originalImg
              } 
            }
          }
        }
      }
    }
  }
  allFlamelinkDefaultThumbnailsContent {
    edges {
      node {
        imageDeck {
          title
          image {
            localFile {
              childImageSharp {
                fluid(quality: 90) {
                  base64
                  aspectRatio 
                  src 
                  srcSet 
                  sizes
                  presentationWidth
                  presentationHeight
                  originalImg
                }
              }
            }
          }
        }
      }
    }
  }
}
`

module.exports = { query }