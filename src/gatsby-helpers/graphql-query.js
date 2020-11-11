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

  allFlamelinkStudentListingPageContent {
    edges {
      node {
        id
        path
        mapPath
        slug
        flamelink_id
        flamelink_locale
      }
    }
  }

  allFlamelinkStudentPageContent {
    edges {
      node {
        id
        slug
        flamelink_locale
        path
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

  allFlamelinkAboutStudyTrondheimContent {
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

  allFlamelinkStudentArticleContent {
    nodes {
      id
      flamelink_locale
      path
    }
  }
}
`

module.exports = { query }
