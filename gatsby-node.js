
// You can delete this file if you're not using it
const path = require(`path`)
const fs = require('fs')
const defaultLocale = 'no'

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

    allMarkdownRemark {
      edges {
        node {
          rawMarkdownBody
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


  // Helper class to map paths in different locales
  class TreeNode {
    constructor(id, parent = null) {
      this.id = id;
      this.parent = parent;
      this.children = new Map();
      this.slugs = new Map();
    }
    addChild(treeNode) {
      this.children.set(treeNode.id, treeNode)
    }
    addChildSlug(id, locale, slug) {
      if (!this.children.has(id)) {
        this.addChild(new TreeNode(id, this))
      }
      this.children.get(id).setSlug(locale, slug)
    }
    getChild(id) {
      return this.children.get(id)
    }
    setSlug(locale, slug) {
      this.slugs.set(locale, slug)
    }
    getSlug(locale) {
      return this.slugs.get(locale)
    }
    getPath(locale) {
      let slug = this.getSlug(locale)
      if (this.parent == null) {
        return `/${slug}${(slug === '') ? '' : '/'}`
      }
      else {
        return `${this.parent.getPath(locale)}${slug}/`
      }
    }
    getLocalizedPaths() {
      let paths = new Map()
      Array.from(this.slugs.keys()).forEach(key => {
        paths.set(key.split('-')[0], this.getPath(key))
      })
      return Array.from(paths).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    }
  }


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

  let root;

  result.data.allFlamelinkFrontPageContent.edges.map(({ node }) => {
    const id = node._fl_meta_.fl_id
    const locale = node.flamelink_locale
    const slug = (locale === defaultLocale) ? '' : locale.split('-')[0]

    // Set frontpage as root of tree
    if (!root) {
      root = new TreeNode(id)
    }
    root.setSlug(locale, slug)
  })

  result.data.allFlamelinkListingPageContent.edges.map(({ node }) =>
    root.addChildSlug(node._fl_meta_.fl_id, node.flamelink_locale, node.slug)
  )

  result.data.allFlamelinkArticleContent.edges.map(({ node }) =>
    root.getChild(node.parentContent._fl_meta_.fl_id).addChildSlug(node._fl_meta_.fl_id, node.flamelink_locale, node.slug)
  )

  function getListingPagePath(id, locale) {
    return root.getChild(id).getPath(locale)
  }






  // Generate menu data for every locale
  var menuListingPages = new Map()
  result.data.allFlamelinkListingPageContent.edges.map(({ node }) => {

    const locale = node.flamelink_locale

    if (!menuListingPages.has(locale)) {
      menuListingPages.set(locale, new Array())
    }

    menuListingPages.get(locale).push({
      title: node.localTitle,
      slug: node.slug,
      locale: locale,
      path: getListingPagePath(node._fl_meta_.fl_id, locale)
    })
  })


  function layoutContext(locale, localizedPaths) {
    return {
      menuData: menuListingPages.get(locale),
      locale: locale,
      localizedPaths: localizedPaths, // Paths to the same page for different locales
    }
  }



  var external_resources = ""


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
        layoutContext: layoutContext(locale, root.getLocalizedPaths())
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
      .filter(({ node }) => node.parentContent.slug === slug)
      .map(node => node.node)
      .map(node => {
        // Check for external image urls in markdown body
        var urls = extract_image_urls(node.content.childMarkdownRemark.rawMarkdownBody)

        if (urls !== null) {
          urls.map(url => {
            external_resources = external_resources + `\n${url}`
          })
        }

        tags = tags.concat(node.tags)
        createPage({
          path: root.getChild(id).getChild(node._fl_meta_.fl_id).getPath(node.flamelink_locale),
          component: path.resolve('./src/templates/article.js'),
          context: {
            // Pass context data here (Remove queries from article.js)
            defaultCenter: { lat: 63.430529, lng: 10.4005522 },
            localization: result.data.allFlamelinkArticleLocalizationContent.edges[0].node.translations,
            node: node,
            layoutContext: layoutContext(locale, root.getChild(id).getChild(node._fl_meta_.fl_id).getLocalizedPaths()),
            locale: locale,
          }
        })
        return node
      })

    // Create Listing Page
    tags = [...new Set(tags)]
    createPage({
      path: root.getChild(id).getPath(locale),
      component: path.resolve(`./src/templates/listing-page.js`),
      context: {
        node: node,
        parentPath: root.getPath(locale),
        tags: tags,
        articles: articles,
        localization: result.data.allFlamelinkListingPageLocalizationContent.edges[0].node.translations,
        locale: locale,
        layoutContext: layoutContext(locale, root.getChild(id).getLocalizedPaths()),
      },
    })
  }



  // Save all external resource urls to be precached by service worker

  fs.writeFile('./static/external/sources.txt', external_resources, (error) => {
    if (error) {
      throw error
    }
  })

}
