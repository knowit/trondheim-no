
const query = `
query {
  allFlamelinkNavbarContent{
    edges{
      node{
        id
        flamelink_locale
        navbarText
        childrenFlamelinkNavbarContentFieldExtraMenuOptionsItem {
          title
          redirectUrl
        }
        logo {
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
      }
    }
  }
  allFlamelinkPageContent{
    edges{
      node{
        id
    _fl_meta_ {
      fl_id
      schema
    }
    internal{
      type
    }
    flamelink_id
    flamelink_locale
    title
    slug
    showInDropMenu
    content{
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
        internal{
          type
        }
        slug
        flamelink_id
        flamelink_locale
        localTitle
        navigationTitle
        navigationSubtitle
        textOnPage
        showOnFrontPage
        showOnFrontpageColumns
        showInDropMenu
        hasMapPage
        mapPageTitle
        mapPageDescription
        parentListingPage{
          slug
          _fl_meta_ {
            fl_id
          }
        }
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

  allFlamelinkLinkItemContent {
    edges {
      node {
        _fl_meta_ {
          fl_id
          schema
        }
        internal{
          type
        }
        id
        flamelink_id
        flamelink_locale
        linkType
        url
        listingPage {
          navigationTitle
          navigationSubtitle
          path
        }
        page {
          title
          subTitle
          path
        }
        content{
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
        icon {
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
        internal{
          type
        }
        flamelink_id
        flamelink_locale
        headerFocusWord
        headerText
        navigationText
        id
        customContent{
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
        bottomCards {
          title
          textColor
          backgroundColor
          iconName
          iconColor
          links {
            text
            url
          }
        }
        linkColumns {
          title
          subTitle
          linkType
          url
          listingPage{
            navigationTitle
            navigationSubtitle
            path
          }
          page{
            title
            subTitle
            path
          }
          content{
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
          icon {
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
        }
        frontImageAlt
        frontImage{
          localFile {
            childImageSharp {
              fluid (maxWidth: 9999, quality: 99) {
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
        columnsBackgroundImage{
          localFile {
            childImageSharp {
              fluid (maxWidth: 9999, quality: 99) {
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
  allFlamelinkArticleContentFieldContactInfo {
    edges {
      node {
        textToShow
        telephoneNumber
        linkToWebsite
        emailAddress
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
        internal{
          type
        }
        flamelink_locale
        flamelink_id
        id
        openingHours {
          content
        }
        parentListingPage {
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