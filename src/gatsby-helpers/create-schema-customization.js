exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
  type FlamelinkTextHtmlContentNode implements Node {
    content: String
    remoteImages: [File] @link
  }
  type FlamelinkArticleContent implements Node {
    parentListingPage: FlamelinkListingPageContent
    tags: [String]
    path: String
    localizedPaths : [LocalizedPath]
    textContent: String
    content: FlamelinkTextHtmlContentNode
    copyright: Copyright
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
  }
  type FlamelinkNewFrontPageContent implements Node {
    path: String
    localizedPaths: [LocalizedPath]
    frontPageAttractions: [FlamelinkArticleContent]
    frontPageMaps: [FlamelinkListingPageContent]
  }
  type FlamelinkNewFrontPageContentFrontPageAttractionsLatLong implements Node {
    googleMapsStaticImage: File @link
  }
  `
  createTypes(typeDefs)
}
