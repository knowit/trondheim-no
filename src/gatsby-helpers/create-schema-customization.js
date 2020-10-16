exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
  type FlamelinkTextHtmlContentNode implements Node {
    content: String
    remoteImages: [File] @link
  }
  type FlamelinkAddress {
    address: String
    lat: Float
    lng: Float
  }
  type FlamelinkArticleContent implements Node {
    tags: [String]
    path: String
    localizedPaths : [LocalizedPath]
    textContent: String
    content: FlamelinkTextHtmlContentNode
    copyright: Copyright
    parentListingPage: FlamelinkListingPageContent
    address: FlamelinkAddress
  }
  type Copyright {
    title: String
    content: String
  }
  type FlamelinkArticleContentFieldLatLong implements Node {
    googleMapsStaticImage: File @link
  }
  type FlamelinkArticleContentFieldContactInfo implements Node {
    emailAddress: String
  }
  type FlamelinkNavbarContent implements Node {
    childFlamelinkNavbarContentFieldExtraMenuOptionsItem: [FlamelinkNavbarContentFieldExtraMenuOptionsItem]
    extraMenuOptions: [ExtraMenuOption]
  }
  type FlamelinkNavbarContentFieldExtraMenuOptionsItem implements Node {
    title: String!
    redirectUrl: String!
  }
  type ExtraMenuOption {
    uniqueKey: String,
    title: String,
    redirectUrl: String
  }
  type FlamelinkListingPageContent implements Node {
    parentListingPage: FlamelinkListingPageContent
    path: String
    mapPath: String
    localizedPaths : [LocalizedPath]
  }
  type FlamelinkFrontPageContent implements Node {
    path: String
    localizedPaths : [LocalizedPath]
    linkColumns: [FlamelinkLinkItemContent]
  }
  type FlamelinkAboutStudyTrondheimContent implements Node {
    path: String
    localizedPaths : [LocalizedPath]
    content: FlamelinkTextHtmlContentNode
    bannerImage: FlamelinkAboutStudyTrondheimContentFieldBannerImage
    contactPerson: [FlamelinkAboutStudyTrondheimContentFieldContactPersonItem]
    article: [FlamelinkAboutStudyTrondheimContentFieldArticleItem]
    otherActivity: [FlamelinkAboutStudyTrondheimContentFieldOtherActivityItem]
  }
  type FlamelinkStudentPageContent implements Node {
    path: String
    localizedPaths : [LocalizedPath]
    additionalListingPages: [FlamelinkListingPageContent]
    linkColumns: [FlamelinkLinkItemContent]
  }
  type FlamelinkPageContent implements Node {
    path: String
    localizedPaths : [LocalizedPath]
    content: FlamelinkTextHtmlContentNode
  }
  type LocalizedPath {
    locale: String,
    path: String
  }
  type FlamelinkLinkItemContent implements Node {
    listingPage: FlamelinkListingPageContent
    page: FlamelinkPageContent
    content: FlamelinkTextHtmlContentNode
    aboutStudyTrondheim: FlamelinkAboutStudyTrondheimContent
  }
  type FlamelinkArticle {
    title: String 
    content: FlamelinkTextHtmlContentNode
  }
  `
  createTypes(typeDefs)
}
