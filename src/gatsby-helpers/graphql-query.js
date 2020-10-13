const query = `
query {
  allFlamelinkPageContent{
    edges{
      node{
        id
        flamelink_id
        flamelink_locale
        path
      }
    }
  }

  allFlamelinkListingPageContent {
    edges {
      node {
        id
        path
        mapPath
        slug
        flamelink_id
        flamelink_locale
        hasMapPage
      }
    }
  }

  allFlamelinkFrontPageContent {
    edges {
      node {
        id
        flamelink_locale
        path
      }
    }
  }

  allFlamelinkArticleContent {
    nodes {
      id
      flamelink_locale
      path
    }
  }
}
`

module.exports = { query }
