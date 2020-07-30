exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
  type FlamelinkTextHtmlContentNode implements Node {
    content: String
    remoteImages: [File] @link
  }
  type FlamelinkArticleContent implements Node {
    tags: [String]
    path: String
    localizedPaths : [LocalizedPath]
    textContent: String
    content: FlamelinkTextHtmlContentNode
  }
  type FlamelinkArticleContentFieldLatLong implements Node {
    googleMapsStaticImage: File @link
  }
  type FlamelinkArticleContentFieldContactInfo implements Node {
    emailAddress: String
  }
  type FlamelinkNavbarContent implements Node {
    childFlamelinkNavbarContentFieldExtraMenuOptionsItem: [FlamelinkNavbarContentFieldExtraMenuOptionsItem]
    externalMenuItems: [ExtraMenuOption]
  }
  type FlamelinkNavbarContentFieldExtraMenuOptionsItem implements Node {
    title: String!
    redirectUrl: String!
  }
  type ExtraMenuOption {
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
  `
  createTypes(typeDefs)
}