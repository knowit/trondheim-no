
// You can delete this file if you're not using it
const path = require(`path`)
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
            url
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
            url
          }
          content {
            content
          }
          contactInfo {
            emailAddress
            textToShow
            telephoneNumber
            linkToWebsite
          }
          address {
            lat
            lng
            address
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

  /*
  // Menu logo is universal for every page
  const menuLogoUrl = result.data.allFlamelinkFrontPageContent.edges[0].node.imageDeck
    .find(function (img) { return img.title === "Logo" }).image[0].url
    */

  const menuLogoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsSAAALEgHS3X78AAADPElEQVQ4y2VUS2sTURS+aTImkyaZJNWkSZrJpJ07iaAu1EqpCxEt6Kq46sad4M4f0ZXgAwotQq3io5VWEDeCi4rFotUq6krrqyL4rJmbZ01mMpPJeO5kah/CZTh3zvnu+c53zr2IJDFJita3ZYiEF4nQQwSRJDBJiNQQMOHxWsz6QhvAa8gIlgOZnCdbGkyWjvFgyFyWRCTqSm46BdkWj+UY5MFyVCoe4Wvnw5WhhDIaUkbClVMx5VKwOMDLUSsgto5H9mExqbA/nd/dXexNG9+cpolgAVKdCLbs5k9nYR8NKPQJxMaLyKKKSRwX9qbVW37lStBUkUkcpo60eVZ76DU1a6sg9QYHK7+r2wKL/zKLwBbAygRXHd5hfGTMOjKrqPHa3XjuMWsIto2lbbWzHeq0H4qSO6U1cArLEak0wDeBbRUZ75j67YDxlTLXn7D6nBcM47tTnQkYbxl60KqjPBSXOzIkBbQFEbRVxkO0NtkBSWjoNU574FUnOfU611j0qJOB5g8npQMBJlKnODksAZCCc2ymcjpGwRplC4b2yKvd9ZlFh1lwqFMBfZGlXnCp1Lt6JppjsxY4IZaO8lCPMhbU51h90QMiQWag14purlAi+it344VbX/CArYyESsd5aBuAcXmwCxqrjIX0Zx7diqhP+5slqjBwMb65VFDhPWMsM8YSo816adsPChYYaLuzlZNxSqxu09afsvU7/ubvtuavNhgV/aWHeldtb3V4e87bop0WZX+mdjFM3YQKBrJr93yNN4xyOQiCGR8Y9SZnfHaZBqIqgGCTIBio3WoVjOShlPHJZf5BQA+QUCfNP8/qj6lUzVxbfToARZl5h7HsKkGrI9gC20OC83u6YRhrF8J0PKGfCqISLLC0cgUZX1y1c2Hgkt/ZA8msIRFtMEwczLYyHgQ3pZdzwLd+v12bbTcbVns1pM74YcIK/QLp3AS2ZzuPxcKBdGu8YLahK+pVDgzKfMVZ7BPyaVzoTa9djA1Xkv7qsuo/nAL9yido/2CVhxK1UetKQsIuTLZeyY3vAfCJSrI/K/sycPuK/YLsy8qB1mOAtzw7/4FbEsDTkxJJXIJyqCGI9jOyCYz/Ai1cV2aIPvNoAAAAAElFTkSuQmCC'


  function layoutContext(locale, localizedPaths) {
    return {
      menuData: menuListingPages.get(locale),
      logoUrl: menuLogoUrl,
      locale: locale,
      localizedPaths: localizedPaths, // Paths to the same page for different locales
    }
  }


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
}
