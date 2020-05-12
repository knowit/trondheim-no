
// You can delete this file if you're not using it
const path = require(`path`)
const fs = require('fs')
const fetch = require('node-fetch')
const defaultLocale = 'no'
const { PathTreeBuilder } = require(`./src/helpers/path-helper`)
const { GoogleMapsUrlHelper } = require(`./src/helpers/url-helper`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Retrieve all data to build sites
  const result = await graphql(`
  query {
    allFlamelinkListingPageContent {
      edges {
        node {
          id
          _fl_meta_ {
            fl_id
            schemaRef {
              title
            }
          }
          slug
          thumbnail {
            localFile {
              name
              childImageSharp {
                fluid(quality: 90) {
                  src
                }
              }
            }
          }
          flamelink_id
          flamelink_locale
          localTitle
          navigationTitle
          navigationSubtitle
          textOnPage
          showOnFrontPage
          showInDropMenu
          mapPageTitle
          mapPageDescription
          parentListingPage{
            slug
            _fl_meta_ {
              fl_id
            }
          }
        }
      }
    }
    allFlamelinkArticleContent {
      edges {
        node {
          _fl_meta_ {
            fl_id
            schemaRef {
              title
            }
          }
          flamelink_locale
          flamelink_id
          id
          openingHours {
            content
            childMdx {
              code{
                body
              }
            }
          }
          parentContent {
            _fl_meta_ {
              fl_id
            }
            id
            slug
          }
          slug
          title
          tags
          thumbnail {
            localFile {
              childImageSharp {
                fluid (quality: 90) {
                  src
                }
              }
            }
          }
          content {
            content
            childMdx {
              code{
                body
              }
            }
            childMarkdownRemark{
              rawMarkdownBody
            }
          }
          contactInfo {
            emailAddress
            textToShow
            telephoneNumber
            linkToWebsite
          }
          address {
            address
            lat
            lng
          }
          latLong {
            latitude
            longitude
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
    allFlamelinkListingPageLocalizationContent(filter: {flamelink_locale: {eq: "no"}}) {
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
          _fl_meta_ {
            fl_id
            schemaRef {
              title
            }
          }
          flamelink_id
          flamelink_locale
          headerFocusWord
          headerText
          id
          imageDeck {
            title
            image {
              url
              localFile {
                childImageSharp {
                  fluid {
                    base64
                  }
                }
              }
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

  let pathHelper = new PathTreeBuilder(result, defaultLocale)
  const root = pathHelper.build()
  var external_resources = ""
  var locations = ""
  const listingPages = new Map()


  // Return a list of image urls from a markdown body
  function extract_image_urls(markdownBody) {
    var result = markdownBody.matchAll(/!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/g)

    var array = []

    let r = result.next()
    while (!r.done) {
      array.push(r.value.groups.filename)
      r = result.next()
    }
    return array
  }

  // Fetch a static map image from google and store it to server's image folder
  function fetchStaticGoogleMapsImage(apiURL, noApiURL) {

    const imgDir = GoogleMapsUrlHelper.getImageDirectory()
    const imgUrl = GoogleMapsUrlHelper.createImageUrl(noApiURL)

    fetch(apiURL, {
      mode: 'no-cors',
      method: 'GET',
      headers: {
        Accept: 'image/png',
      },
    })
      .then(res => res.body)
      .then(data => {
        fs.promises.mkdir(imgDir, { recursive: true }).then(_ => {
          const dest = fs.createWriteStream(imgUrl, { flags: 'w', encoding: 'utf-8', mode: 0666 });
          dest.on('error', function (e) { console.error(e); });
          data.pipe(dest);
        })
      })
  }

  function addStaticGoogleMapsImageToCache(location, markers) {
    // Add google maps location url to be cached
    var apiURL = GoogleMapsUrlHelper.createStaticGoogleMapUrl(location, markers)
    var noApiURL = GoogleMapsUrlHelper.createStaticGoogleMapUrl(location, markers, false)
    fetchStaticGoogleMapsImage(apiURL, noApiURL)
    locations = locations + `\n${noApiURL}`
  }


  function createArticle(treeNode) {

    treeNode.node.forEach((value, key, map) => {
      const node = value
      const locale = key

      // Check for external image urls in markdown body
      var urls = extract_image_urls(node.content.childMarkdownRemark.rawMarkdownBody)

      if (urls !== null) {
        urls.map(url => {
          external_resources = external_resources + `\n${url}`
        })
      }

      var location = GoogleMapsUrlHelper.getLocation(node)
      var markers = [location]
      addStaticGoogleMapsImageToCache(location, markers)


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
      const markers = treeNode.getAllChildArticles()
        .map(articleTreeNode => {
          return GoogleMapsUrlHelper.getLocation(articleTreeNode.node.get(locale))
        })

      if (markers.length > 0) {
        const location = GoogleMapsUrlHelper.getLocation()
        addStaticGoogleMapsImageToCache(location, markers)
      }


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

      createPage({
        path: root.getPath(locale),
        component: path.resolve(`./src/templates/home.js`),
        context: {
          node: node,
          slug: root.getSlug(locale),
          listingPages: listingPages,
          layoutContext: pathHelper.layoutContext(locale, root.getLocalizedPaths())
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
        parentListingPage.addArticle(treeNode)
      }

      createArticle(treeNode)
    }
  }

  listingPages.forEach((value, key, map) =>
    createListingPage(value)
  )

  createFrontPage(root, pathHelper.frontPageListingPages)

  addStaticGoogleMapsImageToCache(GoogleMapsUrlHelper.getLocation())

  // Save all external resource urls to be precached by service worker

  fs.writeFile('./static/external/sources.txt', external_resources, (error) => {
    if (error) {
      throw error
    }
  })
  fs.writeFile('./static/external/locations.txt', locations, (error) => {
    if (error) {
      throw error
    }
  })
}
