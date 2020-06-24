
// You can delete this file if you're not using it
const path = require(`path`)
const defaultLocale = 'no'
const { PathTreeBuilder } = require(`./src/helpers/path-helper`)
const { GoogleMapsUrlHelper } = require(`./src/helpers/url-helper`)
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { query } = require('./src/graphql-query')


function extract_image_urls(htmlBody) {
  var result = []

  var tags = htmlBody.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  if (tags == null) {
    tags = []
  }

  tags.map(x => x.replace(/.*src="([^"]*)".*/, '$1')).map(url => {
    result.push(url)
  })

  return result
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type FlamelinkTextHtmlContentNode implements Node {
      remoteImages: [File] @link
    }

    type FlamelinkArticleNewContentFieldLatLong implements Node {
      googleMapsStaticImage: File @link
    }

    type FlamelinkArticleNewContentFieldContactInfo implements Node {
      emailAddress: String
    }

    type FlamelinkNavbarContent implements Node {
      extraMenuOptions: FlamelinkNavbarContentFieldExtraMenuOptions @menuOptions
    }

    type FlamelinkNavbarContentFieldExtraMenuOptions implements Node{
      childFlamelinkContentFieldExtraMenuOptions: [FlamelinkNavbarContentFieldExtraMenuOptionsItem]
    }

    type FlamelinkNavbarContentFieldExtraMenuOptionsItem implements Node {
      title: String!
      redirectUrl: String!
    }

  `
  createTypes(typeDefs)
}


exports.onCreateNode = async ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {

  if (node.internal.type === "FlamelinkTextHtmlContentNode") {

    var fileNodes = []

    extract_image_urls(node.content).forEach(url => {

      createRemoteFileNode({
        url: url, // string that points to the URL of the image
        parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        cache, // Gatsby's cache
        store, // Gatsby's redux store
      }).then(fileNode => {
        // if the file was created, attach the new node to the parent node
        if (fileNode) {
          fileNodes.push(fileNode.id)
          node.remoteImages = fileNodes
        }
      })
    })
  }


  else if (node.internal.type === 'FlamelinkArticleNewContentFieldLatLong' && node.latitude && node.longitude) {

    let location = GoogleMapsUrlHelper.getLocation(node)

    const url = GoogleMapsUrlHelper.createStaticGoogleMapUrl(location, [{ location: location }])


    createRemoteFileNode({
      url: encodeURI(url), // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      cache, // Gatsby's cache
      store, // Gatsby's redux store
    }).then(fileNode => {
      // if the file was created, attach the new node to the parent node
      if (fileNode) {
        node.googleMapsStaticImage = fileNode.id
      }
    })
  }
}








exports.createPages = async ({ graphql, actions }) => {
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


  function createListingPage(listingPageBuilder) {

    const treeNode = listingPageBuilder.getTreeNode()
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


  function createFrontPage(root, frontPageListingPages) {

    Array.from(root.node.keys()).map(locale => {

      const node = root.node.get(locale)
      const listingPages = Array.from(frontPageListingPages.get(locale).values())
      const columnContent = result.data.allFlamelinkFrontPageColumnContent.edges.map(node => node.node).filter(node => node.flamelink_locale === locale)
      const cardContent = result.data.allFlamelinkFrontPageCardContent.edges.map(node => node.node).filter(node => node.flamelink_locale === locale)

      createPage({
        path: root.getPath(locale),
        component: path.resolve(`./src/templates/home.js`),
        context: {
          node: node,
          slug: root.getSlug(locale),
          listingPages: listingPages,
          layoutContext: pathHelper.layoutContext(locale, root.getLocalizedPaths()),
          columnContent: columnContent,
          cardContent: cardContent
        }
      })
    })
  }


  for (const treeNode of pathHelper.createNodeIterator()) {

    if (treeNode.isListingPage === true && treeNode.isFrontPage === false && treeNode.isArticle === false) {
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
