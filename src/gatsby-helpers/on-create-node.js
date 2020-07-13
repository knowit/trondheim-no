
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { GoogleMapsUrlHelper } = require(`../helpers/url-helper`)

const { attachFields } = require(`gatsby-plugin-node-fields`)

const striptags = require("striptags")


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

const getFlamelinkLocale = (node) => {
  if (node.flamelink_locale) {
    return node.flamelink_locale
  }
  else if (node.parent) {
    return getFlamelinkLocale(node.parent)
  }
  else return null
}

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  getNode,
  createNodeId,
}) => {

  const { createNode } = actions

  const getTextContent = (node) => {
    const contentNode = getNode(node.content___NODE ? node.content___NODE : node.content)
    if (contentNode) {
      return striptags(contentNode.content)
    }
    else return 'None'
  }

  // Your list of descriptors
  const descriptors = [
    {
      predicate: (node) => (
        node.internal ? node.internal.type === 'FlamelinkArticleContent' : false
      ),
      fields: [
        {
          name: 'textContent',
          getter: node => node,
          defaultValue: '',
          transformer: node => getTextContent(node)
        },
      ]
    }
  ]

  attachFields(node, actions, getNode, descriptors)

  if (node.internal.type === "FlamelinkTextHtmlContentNode") {

    node.flamelink_locale = getFlamelinkLocale(node)
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


  else if (node.internal.type === 'FlamelinkArticleContentFieldLatLong' && node.latitude && node.longitude) {

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
