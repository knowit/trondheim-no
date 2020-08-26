// You can delete this file if you're not using it
const path = require(`path`)
const { query } = require("./src/gatsby-helpers/graphql-query")

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

  result.data.allFlamelinkNewFrontPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/home.js`),
        context: {
          nodeId: node.id,
          locale: node.flamelink_locale,
        },
      })
    })

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

  result.data.allFlamelinkListingPageContent.edges
    .map((node) => node.node)
    .map((node) => {
      if (node.slug === "student") {
        createPage({
          path: node.path,
          component: path.resolve(`./src/templates/student.js`),
          context: {
            nodeId: node.id,
            nodeFlamelinkId: node.flamelink_id,
            locale: node.flamelink_locale,
          },
        })
      } else if (node.slug === "hva-skjer" || node.slug === "whats-on") {
        createPage({
          path: node.path,
          component: path.resolve(`./src/templates/events-page.js`),
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

  result.data.allFlamelinkArticleContent.edges
    .map((node) => node.node)
    .map((node) => {
      createPage({
        path: node.path,
        component: path.resolve("./src/templates/article.js"),
        context: {
          nodeId: node.id,
        },
      })
    })
}

exports.onPostBuild = async (args, _ref3) => {
  const fs = require("fs")
  const workboxBuild = require("workbox-build")

  // NOTE: This should be run *AFTER* all your assets are built
  // This will return a Promise
  console.log("Building sw...")
  await workboxBuild
    .injectManifest({
      swSrc: "./static/sw-temp.js",
      swDest: "./public/sw-temp.js",
      globDirectory: "public",
      globPatterns: ["**/*"],
    })
    .then(({ count, size, warnings }) => {
      console.log("Build sw complete.")
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn)
      console.log(`${count} files will be precached, totaling ${size} bytes.`)
    })

  const { PWAManifest } = await require("./public/sw-temp.js")
  const sw = await fs.readFileSync("public/sw.js", "utf8")

  var precacheFiles = []
  var discardedFiles = []
  PWAManifest.map((file) => {
    if (!sw.includes(`"url": "${file.url}"`)) {
      precacheFiles.push(file)
    } else {
      discardedFiles.push(file)
    }
  })

  await fs.writeFileSync(
    "public/sw.js",
    sw.replace(
      "self.__WB_MANIFEST",
      `[${precacheFiles.map((file) => `\n${JSON.stringify(file)}`)}]`
    )
  )

  console.log(
    `Ignored files for additional PWA-cache: \n${discardedFiles.map(
      (file) => `\n${JSON.stringify(file)}`
    )}`
  )
}
