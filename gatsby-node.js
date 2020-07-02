
// You can delete this file if you're not using it
const path = require(`path`)
const defaultLocale = 'no'
const { PathTreeBuilder } = require(`./src/helpers/path-helper`)
const { GoogleMapsUrlHelper } = require(`./src/helpers/url-helper`)
const { query } = require('./src/gatsby-helpers/graphql-query')

let layoutContexts = new Map()

const { createResolvers } = require('./src/gatsby-helpers/create-resolvers')
exports.createResolvers = createResolvers

const { createSchemaCustomization } = require('./src/gatsby-helpers/create-schema-customization')
exports.createSchemaCustomization = createSchemaCustomization

const { onCreateNode } = require('./src/gatsby-helpers/on-create-node')
exports.onCreateNode = onCreateNode

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions
  // Check if the page is a localized 404
  if (page.path.match(/^\/404\/$/)) {
    const oldPage = { ...page }
    const locale = 'no'
    // Recreate the modified page
    deletePage(oldPage)
    var context = page.context
    context.layoutContext = layoutContexts.get(locale)
    context.locale = locale
    createPage({
      ...page,
      context: context,
      location: page.location,
    })
  }
  else if (page.path.match(/^\/[a-z]{2}\/404\/$/)) {
    const oldPage = { ...page }
    const langCode = page.path.split(`/`)[1]
    const locale = (langCode == 'en') ? 'en-US' : langCode
    page.matchPath = `/${langCode}/*`
    // Recreate the modified page
    deletePage(oldPage)
    var context = page.context
    context.layoutContext = layoutContexts.get(locale)
    context.locale = locale
    createPage({
      ...page,
      context: context,
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Retrieve all data to build sites
  const result = await graphql(query)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  let pathHelper = new PathTreeBuilder(result, defaultLocale)
  const root = pathHelper.build()
  const listingPages = new Map()
  layoutContexts.set('no', pathHelper.layoutContext('no', root.getLocalizedPaths()))
  layoutContexts.set('en-US', pathHelper.layoutContext('en-US', root.getLocalizedPaths()))

  function createArticle(treeNode) {

    treeNode.node.forEach((value, key, map) => {
      const node = value
      const locale = key
      const parent = treeNode.parent.node.get(locale)
      const marker = GoogleMapsUrlHelper.getMarker(node, treeNode.getPath(locale), parent)

      createPage({
        path: treeNode.getPath(locale),
        component: path.resolve('./src/templates/article.js'),
        context: {
          // Pass context data here (Remove queries from article.js)
          defaultCenter: { lat: 63.430529, lng: 10.4005522 },
          localization: result.data.allFlamelinkArticleLocalizationContent.edges[0].node.translations,
          node: node,
          layoutContext: pathHelper.layoutContext(locale, treeNode.getLocalizedPaths()),
          locale: locale,
          markers: [marker],
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
          localization: result.data.allFlamelinkArticleLocalizationContent.edges[0].node.translations,
          node: node,
          layoutContext: pathHelper.layoutContext(locale, treeNode.getLocalizedPaths()),
          locale: locale,
        }
      })
    })
  }

  function createStudentPage(listingPageBuilder) {
    const treeNode = listingPageBuilder.getTreeNode()
    Array.from(treeNode.node.keys()).map(locale => {

      const studentPageNode = result.data.allFlamelinkStudentPageContent.edges.find(node => node.flamelink_locale == locale)
      const node = treeNode.node.get(locale)

      // Create listing page
      createPage({
        path: node.path,
        component: path.resolve(`./src/templates/student.js`),
        context: {
          node: node,
          studentPageNode: studentPageNode,
          parentPath: treeNode.parent.getPath(locale),
          subListingPages: listingPageBuilder.getSubListingPages(locale),
          articles: listingPageBuilder.getArticles(locale),
          localization: result.data.allFlamelinkListingPageLocalizationContent.edges[0].node.translations,
          locale: locale,
          layoutContext: pathHelper.layoutContext(locale, treeNode.getLocalizedPaths()),
        },
      })
    })
  }

  function createListingPage(listingPageBuilder) {

    const treeNode = listingPageBuilder.getTreeNode()

    if (treeNode.isStudentPage) {
      createStudentPage(listingPageBuilder)
    }

    else {

      const localization = result.data.allFlamelinkListingPageLocalizationContent.edges[0].node.translations
      Array.from(treeNode.node.keys()).map(locale => {

        const mapSlug = `${(locale === 'no') ? 'kart-over-' : 'map-of-'}${treeNode.slugs.get(locale)}`
        const parentPath = treeNode.parent.getPath(locale)

        if (parentPath.slice(-1) != '/') {
          parentPath = parentPath + '/'
        }

        const mapPath = parentPath + mapSlug
        const listingPagePath = treeNode.getPath(locale)


        // Get all markers from child articles and subpage child articles.
        const markers = []

        treeNode.getAllChildArticles().map(articleTreeNode => {

          const articleNode = articleTreeNode.node.get(locale)
          const articlePath = articleTreeNode.getPath(locale)
          const parentNode = articleTreeNode.parent.node.get(locale)
          const marker = GoogleMapsUrlHelper.getMarker(articleNode, articlePath, parentNode)

          markers.push(marker)
        })

        if (treeNode.node.get(locale).hasMapPage) {
          // Create listing page map
          createPage({
            path: mapPath,
            component: path.resolve(`./src/templates/listing-page-map.js`),
            context: {
              node: treeNode.node.get(locale),
              parentPath: treeNode.parent.getPath(locale),
              localization: localization,
              locale: locale,
              layoutContext: pathHelper.layoutContext(locale, listingPageBuilder.getLocalizedMapPaths()),
              markers: markers,
              listingPagePath: listingPagePath,
            },
          })
        }

        // Create listing page
        createPage({
          path: listingPagePath,
          component: path.resolve(`./src/templates/listing-page.js`),
          context: {
            node: treeNode.node.get(locale),
            parentPath: treeNode.parent.getPath(locale),
            mapPath: mapPath,
            subListingPages: listingPageBuilder.getSubListingPages(locale),
            tags: listingPageBuilder.getTags(locale),
            articles: listingPageBuilder.getArticles(locale),
            localization: result.data.allFlamelinkListingPageLocalizationContent.edges[0].node.translations,
            locale: locale,
            layoutContext: pathHelper.layoutContext(locale, treeNode.getLocalizedPaths()),
          },
        })
      })

    }
  }

  function createFrontPage(root, frontPageListingPages) {

    Array.from(root.node.keys()).map(locale => {

      const node = root.node.get(locale)
      const frontListingPages = [] //Array.from(frontPageListingPages.get(locale).values())
      const columnContent = []

      listingPages.forEach((lsBuilder, id, map) => {
        const treeNode = lsBuilder.treeNode
        const node = treeNode.node.get(locale)
        if (node.showOnFrontPage) {
          frontListingPages.push(node)
        }
        if (node.showOnFrontpageColumns) {
          columnContent.push({
            redirectUrl: treeNode.getPath(locale),
            icon: node.icon,
            title: node.navigationTitle,
            subTitle: node.navigationSubtitle,
            link: true
          })
        }
      })

      createPage({
        path: root.getPath(locale),
        component: path.resolve(`./src/templates/home.js`),
        context: {
          node: node,
          slug: root.getSlug(locale),
          listingPages: frontListingPages,
          layoutContext: pathHelper.layoutContext(locale, root.getLocalizedPaths()),
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
