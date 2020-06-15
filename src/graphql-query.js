
const query = `
query {
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
                src
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
  allFlamelinkArticleContent {
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
          childMdx {
            code{
              body
            }
          }
        }
        parentContent {
          _fl_meta_ {
            fl_id
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
                src
              }
            }
          }
        }
        content {
          content
          childMdx {
            code{
              body
            }
          }
          childMarkdownRemark{
            rawMarkdownBody
          }
        }
        contactInfo {
          emailAddress
          textToShow
          telephoneNumber
          linkToWebsite
        }
        address {
          address
          lat
          lng
        }
        latLong {
          latitude
          longitude
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
        imageDeck {
          title
          image {
            url
            localFile {
              childImageSharp {
                fluid {
                  base64
                }
              }
            }
          }
        }
        navigationText
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
                tracedSVG 
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
                tracedSVG 
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
          emailAddress
          textToShow
          telephoneNumber
          linkToWebsite
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
                tracedSVG 
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
                fluid (quality: 90) {
                  src
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