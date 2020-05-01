
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

  bfSearchInTree(id) {
    let iterator = new BreadthFirstNodeIterator(this)
    while (iterator.hasNext()) {
      let node = iterator.next()
      if (node.id === id) {
        return node
      }
    }
    return null
  }


  dfSearchInTree(id) {

    // Check if id matches
    if (this.id === id) {
      return this
    }

    // Check if direct children has id
    const child = this.children.get(id)
    if (child != null) {

      return child
    }

    // Search in children's children.
    else {
      var result = null
      if (this.children != null) {

        for (let child of Array.from(this.children.values())) {
          result = child.dfSearchInTree(id)
          if (result != null) {
            break;
          }
        }
      }
      return result
    }
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

  setGraphQLNode(node, locale) {
    var schemaTitle = ""
    if (node._fl_meta_ != null) {
      schemaTitle = node._fl_meta_.schemaRef.title
    }

    if (schemaTitle == "Article") {
      this.isArticle = true
    }
    else if (schemaTitle == "ListingPage") {
      this.isListingPage = true
    }
    else if (schemaTitle == "Front Page") {
      this.isFrontPage = true
    }
    this.node.set(locale, node)
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
    console.log(`Node level ${level}: id: ${this.id},  path: ${this.getPath('no')}`)
    this.printChildren()
  }
  printChildren() {
    Array.from(this.children.values()).map(child => child.print())
  }
}


class BreadthFirstNodeIterator {

  constructor(root) {
    console.log("Started iterator...")
    this.queue = [root]
    this.counter = 0
    this.listingPageCounter = 0
    this.articleCounter = 0
    this.frontPageCounter = 0
  }

  hasNext() {
    if (this.queue.length > 0) {
      return true
    }
    else {
      console.log(`Iterated through ${this.counter} tree nodes.`)
      console.log(`Front pages: ${this.frontPageCounter}\nListingPages: ${this.listingPageCounter}\nArticles:${this.articleCounter}`)
      return false
    }
  }

  next() {
    if (!this.hasNext()) {
      throw new Error("Iterator is empty, but next was called.")
    }
    else {
      const node = this.queue[0]
      console.log(`Iterating node ${this.counter}: ${node.getPath('no')}`)
      this.counter += 1
      if (node.isArticle) {
        this.articleCounter += 1
      }
      if (node.isListingPage) {
        this.listingPageCounter += 1
      }
      if (node.isFrontPage) {
        this.frontPageCounter += 1
      }

      this.queue = this.queue.slice(1).concat(Array.from(node.children.values()))
      return node
    }
  }
}

// TODO: Fix node iterator
class ListingPageBuilder {
  constructor(treeNode) {
    this.treeNode = treeNode
    this.subListingPages = []
    this.articles = []
    this.tags = new Map();
  }

  getTreeNode() {
    return this.treeNode
  }

  addTags(tags, locale) {
    if (!this.tags.has(locale)) {
      this.tags.set(locale, new Array())
    }

    this.tags.set(locale, [...new Set(this.tags.get(locale).concat(tags))])
  }

  getTags(locale) {
    return this.tags.get(locale)
  }

  addSubListingPage(treeNode) {
    this.subListingPages.push(treeNode)
  }

  getSubListingPages(locale) {
    return this.subListingPages.map(lp => lp.node.get(locale))
  }

  addArticle(treeNode) {
    this.articles.push(treeNode)
  }

  getArticles(locale) {
    return this.articles.map(a => a.node.get(locale))
  }

}

class PathTreeBuilder {

  constructor(result, defaultLocale) {
    this.result = result
    this.defaultLocale = defaultLocale
    this.root = null
    this.frontPageListingPages = new Map()
    this.dropMenuListingPages = new Map()
  }

  createListingPageBuilder(treeNode) {
    return new ListingPageBuilder(treeNode)
  }

  createNodeIterator() {
    const iterator = new BreadthFirstNodeIterator(this.root)
    return iterator
  }

  findListingPage(id, locale) {
    return this.result.data.allFlamelinkListingPageContent.edges.find(({ node }) =>
      node._fl_meta_.fl_id == id && node.flamelink_locale == locale
    )
  }

  getListingPagePath(id, locale) {
    const match = this.root.bfSearchInTree(id)
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
      if (!this.frontPageListingPages.get(locale).has(id)) {
        !this.frontPageListingPages.get(locale).set(id, node)
      }
    }

    // Check if listing page belongs in drop menu
    if (node.showInDropMenu === true) {
      if (!this.dropMenuListingPages.has(locale)) {
        this.dropMenuListingPages.set(locale, new Map())
      }
      if (!this.dropMenuListingPages.get(locale).has(id)) {
        this.dropMenuListingPages.get(locale).set(id, node)
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

    var parentNode = root

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
    this.menuListingPages = new Map()
    this.result.data.allFlamelinkListingPageContent.edges.map(({ node }) => {

      const locale = node.flamelink_locale

      if (!this.menuListingPages.has(locale)) {
        this.menuListingPages.set(locale, new Array())
      }

      if (node.showInDropMenu === true) {
        this.menuListingPages.get(locale).push({
          title: node.localTitle,
          slug: node.slug,
          locale: locale,
          path: this.getListingPagePath(node._fl_meta_.fl_id, locale)
        })
      }
    })
  }

  layoutContext(locale, localizedPaths) {
    return {
      menuData: this.menuListingPages.get(locale),
      locale: locale,
      localizedPaths: localizedPaths, // Paths to the same page for different locales
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

    this.result.data.allFlamelinkArticleContent.edges.map(({ node }) =>
      this.insertArticleToTree(node)
    )

    this.result.data.allFlamelinkListingPageContent.edges.map(({ node }) =>
      this.insertListingPageToTree(node)
    )

    this.generateMenuData()

    return this.root
  }

}

module.exports = PathTreeBuilder 
