
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const { GoogleMapsUrlHelper } = require(`../helpers/url-helper`)
const { attachFields } = require(`gatsby-plugin-node-fields`)
const striptags = require("striptags")

const firestoreUrl = 'https://firebasestorage.googleapis.com/v0/b/byportal-218506.appspot.com/o/flamelink%2Fmedia%2F'
const firestoreUrlIdentifier = '/v0/b/byportal-218506.appspot.com/o/flamelink%2Fmedia%2F'
const unencodedLetters = [
  ' ', 'Æ', 'Ø', 'Å', 'æ', 'ø', 'å', '+'
]

function requiresEncoding(url) {
  for (var i = 0; i < url.length; i++) {
    if (unencodedLetters.includes(url[i])) return true
  }
  return false
}

function encodeLetters(url) {
  var result = ""
  for (var i = 0; i < url.length; i++) {
    if (unencodedLetters.includes(url[i])) {
      result += encodeURIComponent(url[i])
    } else result += url[i]
  }
  return result
}


function extract_image_urls(htmlBody) {
  var result = []

  var tags = htmlBody.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  if (tags == null) {
    tags = []
  }

  tags.map(x => x.replace(/.*src="([^"]*)".*/, '$1')).map(url => {

    if (url.includes(firestoreUrlIdentifier) && requiresEncoding(url)) {
      result.push(encodeLetters(url))
    }
    else result.push(url)
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

  async function createRemoteFileNodeAsync(url, node) {

    let fileNode

    try {
      fileNode = await createRemoteFileNode({
        // Use small size file for testing. Image must be remote.
        url: (process.env.TEST) ? (process.env.TEST_IMAGE_URL) : url, // string that points to the URL of the image
        parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        cache, // Gatsby's cache
        store, // Gatsby's redux store
      })
    }
    catch (e) {
      console.log(`Failed to create remote file node: ${e}`)
    }

    if (fileNode) {
      return fileNode
    }
    else {
      throw Error(`Failed to create remote file node: ${url}`)
    }
  }

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

  await attachFields(node, actions, getNode, descriptors)

  if (node.internal.type === "FlamelinkTextHtmlContentNode") {

    node.flamelink_locale = await getFlamelinkLocale(node)
    var fileNodes = []

    const imgUrls = await extract_image_urls(node.content)

    for (var i = 0; i < imgUrls.length; i++) {

      const url = imgUrls[i]
      let fileNode

      try {
        fileNode = await createRemoteFileNodeAsync(url, node)
        if (fileNode) {
          fileNodes.push(fileNode.id)
          node.remoteImages = fileNodes
        }
      }
      catch (e) {
        console.log(e)
      }
    }
  }


  else if (node.internal.type === 'FlamelinkArticleContentFieldLatLong' && node.latitude && node.longitude) {

    let location = await GoogleMapsUrlHelper.getLocation(node)
    const url = await GoogleMapsUrlHelper.createStaticGoogleMapUrl(location, [{ location: location }])

    let fileNode

    try {
      fileNode = await createRemoteFileNodeAsync(encodeURI(url), node)
      if (fileNode) {
        node.googleMapsStaticImage = fileNode.id
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
