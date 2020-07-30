
// You can delete this file if you're not using it
const path = require(`path`)
const defaultLocale = 'no'
const { PathTreeBuilder } = require(`./src/helpers/path-helper`)
const { GoogleMapsUrlHelper } = require(`./src/helpers/url-helper`)
const { query } = require('./src/gatsby-helpers/graphql-query')

let layoutContexts = new Map()

const { sourceNodes } = require('./src/gatsby-helpers/source-nodes')
exports.sourceNodes = sourceNodes

const { createResolvers } = require('./src/gatsby-helpers/create-resolvers')
exports.createResolvers = createResolvers

const { createSchemaCustomization } = require('./src/gatsby-helpers/create-schema-customization')
exports.createSchemaCustomization = createSchemaCustomization

const { onCreateNode } = require('./src/gatsby-helpers/on-create-node')
exports.onCreateNode = onCreateNode

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions

  const is404 = page.path.match(/^\/404\/$/)
  const isSearch = page.path.match(/^\/search\/$/)

  // Check if the page is 404 or Search
  if (is404 || isSearch) {

    const context = page.context
    const oldPage = { ...page }
    deletePage(oldPage)
    const pagePath = page.path
    const locales = ['no', 'en-US']

    locales.forEach((locale, index, array) => {

      const layoutContext = layoutContexts.get(locale)

      const newPage = {
        ...page,
        path: `${locale === 'no' ? '' : `/en`}${pagePath}`,
        matchPath: is404 ? (locale === 'no' ? '/*' : '/en/*') : page.matchPath,
        location: page.location,
        context: {
          layoutContext: {
            ...layoutContext,
            localizedPaths: isSearch ? (
              [
                {
                  locale: `no`,
                  path: `${pagePath}`
                },
                {
                  locale: 'en-US',
                  path: `/en${pagePath}`
                },
              ]
            ) : layoutContext.localizedPaths
          },
          locale: locale,
        },
      }

      createPage(newPage)
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Retrieve all data to build sites
  const result = await graphql(query)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query. ${
      result.errors.map(error => {
        return `\n${JSON.stringify(error)}`
      })
      }`)
    return
  }

  let pathHelper = new PathTreeBuilder(result, defaultLocale)
  const root = pathHelper.build()
  const listingPages = new Map()

  result.data.allFlamelinkFrontPageContent.edges.map(node => node.node).map(node => {
    layoutContexts.set(node.flamelink_locale, pathHelper.layoutContext(node))
  })


  function createArticle(treeNode) {

    treeNode.node.forEach((value, key, map) => {
      const node = value
      const locale = key
      createPage({
        path: treeNode.getPath(locale),
        component: path.resolve('./src/templates/article.js'),
        context: {
          nodeId: node.id
        }
      })
    })
  }


  function createGenericPage(treeNode) {
    treeNode.node.forEach((value, key, map) => {
      const node = value
      const locale = key
      const parent = treeNode.parent.node.get(locale)

      createPage({
        path: treeNode.getPath(locale),
        component: path.resolve('./src/templates/page.js'),
        context: {
          nodeId: node.id,
          locale: locale,
        }
      })
    })
  }

  function createStudentPage(listingPageBuilder) {
    const treeNode = listingPageBuilder.getTreeNode()
    Array.from(treeNode.node.keys()).map(locale => {

      const studentPageNode = result.data.allFlamelinkStudentPageContent.edges
        .map(node => node.node)
        .find(node => node.flamelink_locale === locale)


      const node = treeNode.node.get(locale)

      // Create student page
      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/student.js`),
        context: {
          nodeId: node.id,
          nodeFlamelinkId: node.flamelink_id,
          locale: locale,
        },
      })
    })
  }

  function createEventsPage(listingPageBuilder) {

    const treeNode = listingPageBuilder.getTreeNode()
    Array.from(treeNode.node.keys()).map(locale => {
      const node = treeNode.node.get(locale)

      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/events-page.js`),
        context: {
          nodeId: node.id,
          locale: locale,
        },
      })
    })

  }

  function createListingPage(listingPageBuilder) {

    const treeNode = listingPageBuilder.getTreeNode()

    var isEventsPage = false
    treeNode.node.forEach((node, index, map) => {
      if (node.slug === 'hva-skjer' || node.slug === 'whats-on') {
        isEventsPage = true
      }
    })

    if (isEventsPage) {
      createEventsPage(listingPageBuilder)
    }

    else if (treeNode.isStudentPage) {
      createStudentPage(listingPageBuilder)
    }

    else {
      Array.from(treeNode.node.keys()).map(locale => {

        const node = treeNode.node.get(locale)

        if (node.hasMapPage && node.mapPath != null) {
          // Create listing page map
          createPage({
            path: node.mapPath,
            component: path.resolve(`./src/templates/listing-page-map.js`),
            context: {
              nodeId: node.id,
              nodeFlamelinkId: node.flamelink_id,
              locale: locale,
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
            locale: locale,
          },
        })
      })
    }
  }

  function createFrontPage(root, frontPageListingPages) {

    Array.from(root.node.keys()).map(locale => {

      const node = root.node.get(locale)

      createPage({
        path: root.getPath(locale),
        component: path.resolve(`./src/templates/home.js`),
        context: {
          nodeId: node.id,
          locale: locale,
        }
      })
    })
  }

  for (const treeNode of pathHelper.createNodeIterator()) {

    if (treeNode.isListingPage === true) {
      listingPages.set(treeNode.id, pathHelper.createListingPageBuilder(treeNode))

      if (treeNode.parent.id != root.id) {
        listingPages.get(treeNode.parent.id).addSubListingPage(treeNode)
      }
    }

    else if (treeNode.isArticle === true) {

      if (treeNode.parent != null) {
        const parentListingPage = listingPages.get(treeNode.parent.id)
        if (parentListingPage != null) {
          parentListingPage.addArticle(treeNode)
        }
      }
      createArticle(treeNode)
    }

    else if (treeNode.isPage === true) {
      createGenericPage(treeNode)
    }
  }

  listingPages.forEach((value, key, map) =>
    createListingPage(value)
  )

  createFrontPage(root, pathHelper.frontPageListingPages)
}


exports.onPostBuild = async (args, _ref3) => {

  const fs = require('fs')
  const workboxBuild = require('workbox-build');

  // NOTE: This should be run *AFTER* all your assets are built
  // This will return a Promise
  console.log("Building sw...")
  await (workboxBuild.injectManifest({
    swSrc: './static/sw-temp.js',
    swDest: './public/sw-temp.js',
    globDirectory: 'public',
    globPatterns: [
      '**/*',
    ]
  }).then(({ count, size, warnings }) => {
    console.log("Build sw complete.")
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  }));

  const { PWAManifest } = await require('./public/sw-temp.js')
  const sw = await fs.readFileSync('public/sw.js', 'utf8')

  var precacheFiles = []
  var discardedFiles = []
  PWAManifest.map(file => {
    if (!sw.includes(`"url": "${file.url}"`)) {
      precacheFiles.push(file)
    }
    else {
      discardedFiles.push(file)
    }
  })

  await fs.writeFileSync('public/sw.js', sw.replace('self.__WB_MANIFEST',
    `[${precacheFiles.map(file => `\n${JSON.stringify(file)}`)}]`))

  console.log(`Ignored files for additional PWA-cache: \n${discardedFiles.map(file => `\n${JSON.stringify(file)}`)}`)

}