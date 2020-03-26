/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Retrieve all data to build sites
  const result = await graphql(`
  query {
    allFlamelinkListingPageContent {
      edges {
        node {
          id
          slug
          thumbnail {
            url
          }
          flamelink_id
          flamelink_locale
          localTitle
          navigationTitle
          navigationSubtitle
          textOnPage
        }
      }
    }
    allFlamelinkArticleContent {
      edges {
        node {
          flamelink_locale
          flamelink_id
          id
          openingHours
          parentContent {
            id
            slug
          }
          slug
          title
          tags
          thumbnail {
            url
          }
          content {
            content
          }
          contactInfo {
            emailAddress
            textToShow
            telephoneNumber
            linkToWebsite
          }
          address {
            lat
            lng
            address
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
    allFlamelinkFrontPageContent {
      edges {
        node {
          flamelink_id
          flamelink_locale
          headerFocusWord
          headerText
          id
          imageDeck {
            title
            image {
              url
            }
          }
          navigationText
        }
      }
    }
  }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const defaultLocale = 'no'

  // Create Front Page
  result.data.allFlamelinkFrontPageContent.edges.map(({ node }) => {

    const locale = node.flamelink_locale
    const localizedPath = (locale === defaultLocale) ? '/' : `/${locale.split('-')[0]}/`

    const listingPages = result.data.allFlamelinkListingPageContent.edges.filter(({ node }) => {
      return node.flamelink_locale === locale
    }).map(node => node.node)

    createPage({
      path: localizedPath,
      component: path.resolve(`./src/templates/home.js`),
      context: {
        node: node,
        slugLocale: (locale === defaultLocale) ? '' : `${locale.split('-')[0]}/`,
        listingPages: listingPages
      }
    })
  })


  // Create Listing Pages
  result.data.allFlamelinkListingPageContent.edges.map(({ node }) => {

    const nodeSlug = node.slug;
    const locale = node.flamelink_locale
    const localizedPath = ((locale === defaultLocale) ? '/' : `/${locale.split('-')[0]}/`) + nodeSlug
    const slugLocale = ((locale === defaultLocale) ? '' : `${locale.split('-')[0]}/`)

    var tags = []



    // Create Article Pages
    var articles = result.data.allFlamelinkArticleContent.edges
      .filter(({ node }) => node.parentContent.slug === nodeSlug)
      .map(node => node.node)
      .map(node => {

        tags = tags.concat(node.tags)

        createPage({
          path: localizedPath + "/" + node.slug,
          component: path.resolve('./src/templates/article.js'),
          context: {
            // Pass context data here (Remove queries from article.js)
            defaultCenter: { lat: 63.430529, lng: 10.4005522 },
            localization: result.data.allFlamelinkArticleLocalizationContent.edges[0].node.translations,
            node: node,
            locale: locale,
          }
        })
        return node
      })

    // Create Listing Page
    tags = [...new Set(tags)]
    createPage({
      path: localizedPath,
      component: path.resolve(`./src/templates/listing-page.js`),
      context: {
        node: node,
        slugLocale: slugLocale,
        tags: tags,
        articles: articles,
      },
    })

  })

}
