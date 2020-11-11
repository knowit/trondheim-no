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
        _fl_meta_ {
          schema
        }
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
        _fl_meta_ {
          schema
        }
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
          schema
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
          schema
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
      _fl_meta_ {
        schema
      }
    }
  }

  allFlamelinkStudentArticleContent {
    nodes {
      id
      flamelink_locale
      path
      _fl_meta_ {
        schema
      }
    }
  }
}
`

module.exports = { query }
