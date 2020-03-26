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


  // Create Front Page
  createPage({
    path: '/',
    component: path.resolve(`./src/templates/home.js`),
    context: {
      no: {
        node: result.data.allFlamelinkFrontPageContent.edges.find(({ node }) => { return node.flamelink_locale === "no" }).node,
        listingPages: result.data.allFlamelinkListingPageContent.edges.filter(({ node }) => { return node.flamelink_locale === "no" }),
      },
      en: {
        node: result.data.allFlamelinkFrontPageContent.edges.find(({ node }) => { return node.flamelink_locale === "en-US" }).node,
        listingPages: result.data.allFlamelinkListingPageContent.edges.filter(({ node }) => { return node.flamelink_locale === "en-US" }),
      },
    }
  })


  // Create Listing Pages
  result.data.allFlamelinkListingPageContent.edges
    .filter(({ node }) => { return node.flamelink_locale === "no" }) // To avoid duplicates
    .forEach(({ node }) => {
      const nodeId = node.flamelink_id;
      const nodeSlug = node.slug;


      var articles_no = result.data.allFlamelinkArticleContent.edges.filter(({ node, key }) => {
        return node.flamelink_locale === "no" && node.parentContent.slug === nodeSlug
      });
      var tags_no = []
      articles_no.map(({ node, key }) => {
        tags_no = tags_no.concat(node.tags);
      })
      tags_no = [...new Set(tags_no)];

      var articles_en = result.data.allFlamelinkArticleContent.edges.filter(({ node, key }) => {
        return node.flamelink_locale === "en" && node.parentContent.slug === nodeSlug
      });
      var tags_en = []
      articles_en.map(({ node, key }) => {
        tags_en = tags_en.concat(node.tags);
      })
      tags_en = [...new Set(tags_en)];

      createPage({
        path: nodeSlug,
        component: path.resolve(`./src/templates/listing-page.js`),
        context: {
          no: {
            node: node,
            articles: articles_no,
            tags: tags_no,
          },
          en: {
            node: result.data.allFlamelinkListingPageContent.edges.find(({ node, key }) => {
              return node.flamelink_locale === "en-US" && node.flamelink_id === nodeId;
            }).node,
            articles: articles_en,
            tags: tags_en,
          },
        },
      })
    })


  // Create Article Pages
  result.data.allFlamelinkArticleContent.edges
    .filter(({ node }) => { return node.flamelink_locale === "no" }) // To avoid duplicates
    .forEach(({ node }) => {

      const nodeId = node.flamelink_id;

      createPage({
        path: node.parentContent.slug + "/" + node.slug,
        component: path.resolve('./src/templates/article.js'),
        context: {
          // Pass context data here (Remove queries from article.js)
          defaultCenter: {lat: 63.430529, lng: 10.4005522},
          localization: result.data.allFlamelinkArticleLocalizationContent.edges[0].node.translations,

          no: {
            node: node
          },
          en: {
            node: result.data.allFlamelinkArticleContent.edges.find(({ node, key }) => {
              return node.flamelink_locale === "en-US" && node.flamelink_id === nodeId;
            }).node
          }

        }
      })
    })

}
