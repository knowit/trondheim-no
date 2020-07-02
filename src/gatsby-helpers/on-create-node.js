
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { GoogleMapsUrlHelper } = require(`../helpers/url-helper`)

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
