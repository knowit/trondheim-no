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

  allFlamelinkStudentPageContent {
    edges {
      node {
        id
        flamelink_locale
        _fl_meta_ {
          status
        }
      }
    }
  }

  allFlamelinkFrontPageContent {
    edges {
      node {
        id
        flamelink_locale
        path
        _fl_meta_ {
          status
        }
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
