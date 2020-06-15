

function* breadthFirstIterator(root) {
  var node = null
  var queue = [root]
  var done = false
  var counter = 0

  while (!done) {
    node = queue.shift()
    queue = queue.concat(Array.from(node.children.values()))
    done = node == null || queue.length === 0
    counter += 1
    yield node
  }
}


// Helper class to map paths in different locales
class TreeNode {
  constructor(id, parent = null) {
    this.id = id;
    this.parent = parent;
    this.children = new Map();
    this.slugs = new Map();
    this.node = new Map();
    this.isListingPage = false;
    this.isArticle = false;
    this.isFrontPage = false;
  }

  toString() {
    var parentId = `${(this.parent == null) ? 'null' : this.parent.id}`

    var locales = `[`
    var slugs = `{`

    this.slugs.forEach((value, key, map) => {
      locales += `${key}, `
      slugs += `\n\t\t${key}: ${value},`
    })

    locales = `${locales.substring(0, locales.length - 2)}]`
    slugs = `${slugs.substring(0, slugs.length - 1)}\n\t}`

    return `{
      \tid: ${this.id},
      \tparentId: ${parentId}
      \tisListingPage: ${this.isListingPage},
      \tisArticle: ${this.isArticle},
      \tisFrontPage: ${this.isFrontPage}
      \tlocales: ${locales}
      \tslugs: ${slugs}\n}`
  }

  bfSearchInTree(id) {
    for (const node of breadthFirstIterator(this)) {
      if (node.id === id) {
        return node
      }
    }

    return null
  }

  getAllChildArticles() {
    var result = []
    for (const treeNode of breadthFirstIterator(this)) {
      if (treeNode.isArticle == true) {
        result.push(treeNode)
      }
    }
    return result
  }

  getTypedChildArticles() {

    var result = new Map()
    for (const treeNode of breadthFirstIterator(this)) {
      if (treeNode.isArticle == true) {

        const listingPageTitle = treeNode.parent.node.localTitle
        if (!result.has(listingPageTitle)) {
          result.set(listingPageTitle, [])
        }

        result.get(listingPageTitle).push(treeNode)
      }
    }

    return result
  }


  addChild(treeNode) {
    this.children.set(treeNode.id, treeNode)
  }
  addChildSlug(id, locale, slug) {
    if (!this.children.has(id)) {
      this.addChild(new TreeNode(id, this))
    }
    this.children.get(id).setSlug(locale, slug)
    return this.children.get(id)
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

  setGraphQLNode(node) {
    var schema = ""
    if (node._fl_meta_ != null) {
      schema = node._fl_meta_.schema
    }

    if (schema == "articleNew") {
      this.isArticle = true
    }
    else if (schema == "listingPage") {
      this.isListingPage = true
    }
    else if (schema == "frontPage") {
      this.isFrontPage = true
    }
    this.node.set(node.flamelink_locale, node)
  }

  getGraphQLNode(locale) {
    return this.node.get(locale)
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
  getLevel() {
    var level = 0
    var parent = this.parent
    while (parent != null) {
      level += 1
      parent = parent.parent
    }
    return level
  }
  print() {
    var level = this.getLevel()
    console.log(`Node level ${level}: ${this.toString()}}`)
    this.printChildren()
  }
  printChildren() {
    Array.from(this.children.values()).map(child => child.print())
  }
}




class ListingPageBuilder {
  constructor(treeNode) {
    this.treeNode = treeNode
    this.subListingPages = []
    this.articles = []
    this.tags = new Map()
  }

  getTreeNode() {
    return this.treeNode
  }

  addTags(tags, locale) {
    if (!this.tags.has(locale)) {
      this.tags.set(locale, new Array())
    }

    this.tags.set(locale, [...new Set(Array.from(this.tags.get(locale)).concat(tags))])
  }

  getTags(locale) {
    if (!this.tags.has(locale)) {
      this.tags.set(locale, new Array())
    }
    return this.tags.get(locale)
  }

  addSubListingPage(treeNode) {
    this.subListingPages.push(treeNode)
  }

  getSubListingPages(locale) {

    var result = []
    this.subListingPages.map(treeNode => {
      result.push(treeNode.node.get(locale))
    })

    return result
  }

  addArticle(treeNode) {
    this.articles.push(treeNode)

    // Add article tags
    treeNode.node.forEach((value, key, map) => {
      const locale = key
      const node = value

      this.addTags(node.tags, locale)
    })
  }

  getArticles(locale) {
    return this.articles.map(a => a.node.get(locale))
  }

  getMapPath(locale) {
    var parentPath = this.treeNode.parent.getPath(locale)
    if (locale === 'no') {
      return `${parentPath}/kart-over-${this.treeNode.slugs.get(locale)}`
    }
    else {
      return `${parentPath}/map-of-${this.treeNode.slugs.get(locale)}`
    }
  }

  getLocalizedMapPaths() {
    let paths = new Map()
    Array.from(this.treeNode.slugs.keys()).forEach(key => {
      paths.set(key.split('-')[0], this.getMapPath(key))
    })
    return Array.from(paths).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  }
}

class PathTreeBuilder {

  constructor(result, defaultLocale) {
    this.result = result
    this.defaultLocale = defaultLocale
    this.root = null
    this.frontPageListingPages = new Map()
    this.dropMenuListingPages = new Map()
    this.menuData = new Map()
  }

  createListingPageBuilder(treeNode) {
    return new ListingPageBuilder(treeNode)
  }

  createNodeIterator() {
    return breadthFirstIterator(this.root)
  }

  findListingPage(id, locale) {
    return this.result.data.allFlamelinkListingPageContent.edges.find(({ node }) =>
      node._fl_meta_.fl_id == id && node.flamelink_locale == locale
    )
  }

  findPagePath(id, locale) {
    var match = this.root.bfSearchInTree(id)

    if (match != null) {
      return match.getPath(locale)
    }
    else {
      console.log(`ERROR: Could not find tree node of id: ${id}`)
      return ""
    }
  }

  insertListingPageToTree(node) {
    const id = node._fl_meta_.fl_id
    const locale = node.flamelink_locale
    const slug = node.slug
    const parent = node.parentListingPage

    // Check if listing page belongs on front page
    if (node.showOnFrontPage === true) {
      if (!this.frontPageListingPages.has(locale)) {
        this.frontPageListingPages.set(locale, new Map())
      }
      this.frontPageListingPages.get(locale).set(id, node)
    }

    // Check if listing page belongs in drop menu
    if (node.showInDropMenu === true) {
      if (!this.dropMenuListingPages.has(locale)) {
        this.dropMenuListingPages.set(locale, new Array())
      }
      if (!this.dropMenuListingPages.get(locale).includes(node)) {
        this.dropMenuListingPages.get(locale).push(node)
      }
    }

    var parentNode = this.root

    // Add the parent to the tree first.
    if (parent != null) {
      if (parent._fl_meta_ != null) {
        const p = this.findListingPage(parent._fl_meta_.fl_id, locale)

        if (p != null) {
          if (p.node._fl_meta_ != null) {
            parentNode = this.insertListingPageToTree(p.node)
          }
        }
      }
    }

    var result = parentNode.addChildSlug(id, locale, slug)
    result.setGraphQLNode(node)
    return result;
  }


  insertArticleToTree(node) {
    const id = node._fl_meta_.fl_id
    const locale = node.flamelink_locale
    const slug = node.slug
    const parent = node.parentContent

    var parentNode = this.root

    // Add the parent to the tree first.
    if (parent != null) {
      if (parent._fl_meta_ != null) {
        const p = this.findListingPage(parent._fl_meta_.fl_id, locale)

        if (p != null) {
          if (p.node._fl_meta_ != null) {
            parentNode = this.insertListingPageToTree(p.node)
          }
        }
      }
    }

    var result = parentNode.addChildSlug(id, locale, slug)
    result.setGraphQLNode(node)
    return result
  }

  generateMenuData() {
    // Generate menu data for every locale

    this.dropMenuListingPages.forEach((value, key, map) => {

      const locale = key

      if (!this.menuData.has(locale)) {
        this.menuData.set(locale, new Array())
      }

      value.map(node => {

        this.menuData.get(locale).push({
          title: node.localTitle,
          slug: node.slug,
          locale: locale,
          path: this.findPagePath(node._fl_meta_.fl_id, locale)
        })

      })
    })
  }

  layoutContext(locale, localizedPaths) {
    return {
      menuData: this.menuData.get(locale),
      locale: locale,
      localizedPaths: localizedPaths, // Paths to the same page for different locales
      defaultThumbnails: this.result.data.allFlamelinkDefaultThumbnailsContent.edges[0].node.imageDeck
    }
  }

  build() {
    // Generate node tree
    this.result.data.allFlamelinkFrontPageContent.edges.map(({ node }) => {
      const id = node._fl_meta_.fl_id
      const locale = node.flamelink_locale
      const slug = (locale === this.defaultLocale) ? '' : locale.split('-')[0]

      if (this.root == null) {
        // Set frontpage as root of tree
        this.root = new TreeNode(id)
      }

      this.root.setSlug(locale, slug)
      this.root.setGraphQLNode(node, locale)
    })

    this.result.data.allFlamelinkArticleNewContent.edges.map(({ node }) => {
      const result = this.insertArticleToTree(node)
    }
    )

    this.result.data.allFlamelinkListingPageContent.edges.map(({ node }) => {
      const result = this.insertListingPageToTree(node)
    }
    )

    this.generateMenuData()
    return this.root
  }

}

module.exports = { PathTreeBuilder } 
