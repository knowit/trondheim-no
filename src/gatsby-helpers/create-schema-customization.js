exports.createSchemaCustomization = ({ actions, schema }) => {
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
    content: FlamelinkTextHtmlContentNode
    copyright: Copyright
    parentListingPage: FlamelinkListingPageContent
    address: FlamelinkAddress
  }
  type FlamelinkStudentArticleContent implements Node {
    tags: [String]
    path: String
    localizedPaths : [LocalizedPath]
    content: FlamelinkTextHtmlContentNode
    copyright: Copyright
    parentListingPage: FlamelinkStudentListingPageContent
    address: FlamelinkAddress
  }
  type Copyright {
    title: String
    content: String
  }
  type FlamelinkArticleContentFieldLatLong implements Node {
    googleMapsStaticImage: File @link
  }
  type FlamelinkStudentArticleContentFieldLatLong implements Node {
    googleMapsStaticImage: File @link
  }
  type FlamelinkArticleContentFieldContactInfo implements Node {
    emailAddress: String
  }
  type FlamelinkStudentArticleContentFieldContactInfo implements Node {
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
  type FlamelinkStudentListingPageContent implements Node {
    parentListingPage: FlamelinkStudentListingPageContent
    path: String
    mapPath: String
    localizedPaths : [LocalizedPath]
  }
  type FlamelinkFrontPageContent implements Node {
    path: String
    localizedPaths : [LocalizedPath]
    linkColumns: [LinkColumn]
    bottomCards: [FlamelinkFrontPageContentBottomCards]
  }
  type FlamelinkFrontPageContentBottomCardsLinks {
    text: String
    url: String
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
    linkColumns: [LinkColumn]
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
  type LinkColumn @dontInfer {
    id: ID!
    title: String
    subtitle: String
    linkType: String
    link: LinkItem
    content: String
    icon: [File]
  }

  type LinkItem {
    title: String
    subtitle: String
    path: String
  }

  type FlamelinkArticle {
    title: String 
    content: FlamelinkTextHtmlContentNode
  }

  interface LocalizationContent {
    translations: [KeyValueTranslation]
  }

  type KeyValueTranslation {
    key: String
    translations: [Translation]
  }

  type Translation {
    language: String
    word: String
  }

  type FlamelinkArticleLocalizationContent implements Node & LocalizationContent {
    translations: [KeyValueTranslation]
  }

  type FlamelinkLayoutLocalizationContent implements Node & LocalizationContent {
    translations: [KeyValueTranslation]
  }

  type FlamelinkListingPageLocalizationContent implements Node & LocalizationContent {
    translations: [KeyValueTranslation]
  }

  `

  // Custom resolver fordi når det ikke finnes noen links, så antar Gatsby String
  const FlamelinkFrontPageContentBottomCardsObjectType = schema.buildObjectType({
    name: "FlamelinkFrontPageContentBottomCards",
    fields: {
      links: {
        type: "[FlamelinkFrontPageContentBottomCardsLinks]!",
        resolve: source => {
          const { links } = source
          if (links == "") {
            return []
          }
          return links
        }
      }
    }
  })

  createTypes([typeDefs, FlamelinkFrontPageContentBottomCardsObjectType])
}
