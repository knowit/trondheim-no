// You can delete this file if you're not using it
const path = require(`path`)
const { query } = require("./src/gatsby-helpers/graphql-query")

require("dotenv")
const status = process.env.GATSBY_FLAMELINK_STATUS

const { sourceNodes } = require("./src/gatsby-helpers/source-nodes")
exports.sourceNodes = sourceNodes

const { createResolvers } = require("./src/gatsby-helpers/create-resolvers")
exports.createResolvers = createResolvers

const {
  createSchemaCustomization,
} = require("./src/gatsby-helpers/create-schema-customization")
exports.createSchemaCustomization = createSchemaCustomization

const { onCreateNode } = require("./src/gatsby-helpers/on-create-node")
exports.onCreateNode = onCreateNode

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Retrieve all data to build sites
  const result = await graphql(query)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query. ${result.errors.map((error) => {
        return `\n${JSON.stringify(error)}`
      })}`
    )
    return
  }

  const locales = ["no", "en-US"]
  const localizedPaths = locales.map((l) => {
    return {
      locale: l,
      path: l === "no" ? "/" : "/en/",
    }
  })

  // Create 404
  locales.map((locale) => {
    const pagePath = "/404/"
    createPage({
      path: `${locale === "no" ? "" : `/en`}${pagePath}`,
      component: require.resolve("./src/templates/not-found.js"),
      matchPath: locale === "no" ? "/*" : "/en/*",
      context: {
        locale: locale,
        localizedPaths: localizedPaths,
      },
    })
  })

  // Create search
  locales.map((locale) => {
    const pagePath = "/search/"
    createPage({
      path: `${locale === "no" ? "" : `/en`}${pagePath}`,
      component: require.resolve("./src/templates/search-template.js"),
      context: {
        locale: locale,
        localizedPaths: localizedPaths,
      },
    })
  })

  // Create front page
  result.data.allFlamelinkFrontPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve(
          `./src/templates/${
            status == "publish" || status == node._fl_meta_.status
              ? "home"
              : "empty-front-page"
          }.js`
        ),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
          status: status,
          layout: "front-page",
        },
      })
    })

  // Create student page
  result.data.allFlamelinkStudentPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve(
          `./src/templates/${
            status == "publish" || status == node._fl_meta_.status
              ? "student"
              : "empty-front-page"
          }.js`
        ),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
          status: status,
          layout: "student-page",
        },
      })
    })

  // Create about study trondheim
  result.data.allFlamelinkAboutStudyTrondheimContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/about-study-trondheim.js`),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
        },
      })
    })

  // Create pages
  result.data.allFlamelinkPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve("./src/templates/page.js"),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
        },
      })
    })

    result.data.allFlamelinkFrontPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve(
          `./src/templates/${
            status == "publish" || status == node._fl_meta_.status
              ? "student"
              : "empty-front-page"
          }.js`
        ),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
          status: status,
          layout: "student-page",
        },
      })
    })

  // Create listing pages
  result.data.allFlamelinkListingPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      if (node.slug === "student") {

        // Do nothing

      } else if (node.slug === "hva-skjer" || node.slug === "whats-on") {
        createPage({
          path: node.path,
          component: path.resolve(`./src/templates/events-page.js`),
          context: {
            nodeId: node.id,
            locale: node.flamelink_locale,
          },
        })
      } else if (node.slug === "kart" || node.slug === "maps") {
        createPage({
          path: node.path,
          component: path.resolve(`./src/templates/map-page.js`),
          context: {
            nodeId: node.id,
            locale: node.flamelink_locale,
          },
        })
      } else {
        if (node.hasMapPage && node.mapPath != null) {
          // Create listing page map
          createPage({
            path: node.mapPath,
            component: path.resolve(`./src/templates/listing-page-map.js`),
            context: {
              nodeId: node.id,
              nodeFlamelinkId: node.flamelink_id,
              locale: node.flamelink_locale,
            },
          })
        }

        // Create listing page
        createPage({
          path: node.path,
          component: path.resolve(`./src/templates/listing-page.js`),
          context: {
            nodeId: node.id,
            nodeFlamelinkId: node.flamelink_id,
            locale: node.flamelink_locale,
          },
        })
      }
    })

  // Create articles
  result.data.allFlamelinkArticleContent.nodes.map((node) => {
    createPage({
      path: node.path,
      component: path.resolve("./src/templates/article.js"),
      context: {
        nodeId: node.id,
      },
    })
  })

  // Create student listing pages
  result.data.allFlamelinkStudentListingPageContent.edges
    .map((node) => node.node)
    .map(node => {
      // Create listing page
      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/listing-page.js`),
        context: {
          nodeId: node.id,
          nodeFlamelinkId: node.flamelink_id,
          locale: node.flamelink_locale,
        },
      })
    })

  // Create student articles
  result.data.allFlamelinkStudentArticleContent.nodes.map((node) => {
    createPage({
      path: node.path,
      component: path.resolve("./src/templates/article.js"),
      context: {
        nodeId: node.id,
      },
    })
  })
}
