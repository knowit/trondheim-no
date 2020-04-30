
// You can delete this file if you're not using it
const path = require(`path`)
const fs = require('fs')
const fetch = require('node-fetch')
const defaultLocale = 'no'
const PathTreeBuilder = require(`./src/helpers/path-helper`)

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



  var external_resources = ""
  var locations = ""


  // Create front page
  result.data.allFlamelinkFrontPageContent.edges.map(({ node }) => {
    const locale = node.flamelink_locale

    const listingPages = result.data.allFlamelinkListingPageContent.edges.filter(({ node }) => {
      return node.flamelink_locale === locale
    }).map(node => {
      createListingPage(node.node)
      return node.node
    })

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

  function createListingPage(node) {

    const id = node._fl_meta_.fl_id
    const slug = node.slug;
    const locale = node.flamelink_locale

    var tags = []

    // Create Article Pages
    var articles = result.data.allFlamelinkArticleContent.edges
      .filter(({ node }) => node.parentContent._fl_meta_.fl_id === id && node.flamelink_locale === locale)
      .map(node => node.node)
      .map(node => {

        // Check for external image urls in markdown body
        var urls = extract_image_urls(node.content.childMarkdownRemark.rawMarkdownBody)

        if (urls !== null) {
          urls.map(url => {
            external_resources = external_resources + `\n${url}`
          })
        }

        // Add google maps location url to be cached
        var address = node.address.address
        var location = { lat: Number(node.latLong.latitude), lng: Number(node.latLong.longitude) }
        var baseURL = "https://maps.googleapis.com/maps/api/staticmap?"
        var parameters = ""

        if (node.address.address) {
          parameters = "center=" + encodeURI(address);
        } else {
          parameters = "center=" + location.lat + "," + location.lng;
        }

        var style = "&size=600x400&zoom=14&maptype=roadmap&markers=color:red|"

        if (node.address.address) {
          style = style + encodeURI(address);
        } else {
          style = style + location.lat + "," + location.lng;
        }

        var noApiURL = baseURL + parameters + style
        var apiURL = noApiURL + "&key=" + process.env.GATSBY_GOOGLE_API

        locations = locations + `\n${noApiURL}`


        // Fetch static Google Maps image
        fetch(apiURL, {
          mode: 'no-cors',
          method: 'GET',
          headers: {
            Accept: 'image/png',
          },
        })
          .then(res => res.body)
          .then(data => {
            fs.promises.mkdir(`./static/maps`, { recursive: true }).then(_ => {
              const dest = fs.createWriteStream(`./static/maps/${decodeURI(parameters).trim(' ')}.png`, { flags: 'w', encoding: 'utf-8', mode: 0666 });
              dest.on('error', function (e) { console.error(e); });
              data.pipe(dest);
            })
          })


        tags = tags.concat(node.tags)
        const treeNode = root.dfSearchInTree(id).getChild(node._fl_meta_.fl_id)
        createPage({
          path: treeNode.getPath(node.flamelink_locale),
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
        return node
      })

    // Create Listing Page
    tags = [...new Set(tags)]
    const treeNode = root.dfSearchInTree(id)

    createPage({
      path: treeNode.getPath(locale),
      component: path.resolve(`./src/templates/listing-page.js`),
      context: {
        node: node,
        parentPath: root.getPath(locale),
        tags: tags,
        articles: articles,
        localization: result.data.allFlamelinkListingPageLocalizationContent.edges[0].node.translations,
        locale: locale,
        layoutContext: pathHelper.layoutContext(locale, treeNode.getLocalizedPaths()),
      },
    })
  }



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
