/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allFlamelinkArticleContent {
        edges {
          node {
            slug
            parentContent {
              slug
            }
          }
        }
      }
      allFlamelinkListingPageContent {
        edges {
          node {
            slug
          }
        }
      }
    }
  `)

  result.data.allFlamelinkListingPageContent.edges.forEach(({ node }) => {
    createPage({
      path: node.slug,
      component: path.resolve(`./src/templates/listing-page.js`),
    })
  })

  result.data.allFlamelinkArticleContent.edges.forEach(({ node }) => {
    createPage({
      path: node.parentContent.slug + "/" + node.slug,
      component: path.resolve(`./src/templates/listing-page.js`),
    })
  })

}