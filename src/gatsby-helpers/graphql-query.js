
const query = `
query {
  allFlamelinkNavbarContent{
    edges{
      node{
        id
        flamelink_locale
        navbarText
        childFlamelinkNavbarContentFieldExtraMenuOptionsItem {
          title
          redirectUrl
        }
        logo {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 120, quality: 70) {
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
    path
    localizedPaths {
      locale
      path
    }
    content{
      content
      remoteImages {
        url
        childImageSharp {
        fluid (maxWidth: 1200, quality: 80){
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
        path
        localizedPaths {
          locale
          path
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
              fluid(maxWidth: 340, quality: 70) {
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
              fluid (maxWidth: 340, quality: 70){
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
              fluid(maxWidth: 240, quality: 70) {
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
        path
        localizedPaths{
          locale
          path
        }
        customContent{
          content
          remoteImages {
            url
            childImageSharp {
              fluid (maxWidth: 1200, quality: 80){
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
                fluid (maxWidth: 1200, quality: 80){
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
                fluid(maxWidth: 240, quality: 70) {
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
              fluid (maxWidth: 2400, quality: 90) {
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
              fluid (maxWidth: 2400, quality: 70) {
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
  allFlamelinkStudentPageContent {
    edges {
      node {
        _fl_meta_{
          fl_id
          schema
        }
        flamelink_locale
        flamelink_id
        headerText
        headerFocusWord
        frontImageAlt
        path
        localizedPaths {
          locale
          path
        }
        additionalListingPages {
          id
          _fl_meta_{
            fl_id
            schema
          }
          flamelink_id
          flamelink_locale
          navigationTitle
          navigationSubtitle
          path
          thumbnail {
            localFile {
              name
              childImageSharp {
                fluid(maxWidth: 340, quality: 90) {
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
        logoImage {
          localFile {
            childImageSharp {
              fluid (maxWidth: 120, quality: 90) {
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
        frontImage {
          localFile {
            childImageSharp {
              fluid (maxWidth: 2400, quality: 90) {
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
        columnsBackgroundImage {
          localFile {
            childImageSharp {
              fluid (maxWidth: 2400, quality: 90) {
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
                fluid (maxWidth: 1200, quality: 70){
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
                fluid(maxWidth: 240, quality: 70) {
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
        path
        localizedPaths {
          locale
          path
        }
        thumbnail {
          localFile {
            childImageSharp {
              fluid (maxWidth: 340, quality: 70) {
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
              fluid (maxWidth: 1200, quality: 80){
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
              fluid (maxWidth: 600, quality: 80){
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
        id
        flamelink_locale
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