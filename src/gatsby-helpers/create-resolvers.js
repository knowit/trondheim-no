exports.createResolvers = ({ createResolvers }) => {

  const resolvePath = (source) => {
    if (!source._fl_meta_) {
      return ""
    }
    if (source._fl_meta_.schema === 'listingPage' || source._fl_meta_.schema === 'article') {

      const locale = source.flamelink_locale
      var path = source.slug
      var parent = source.parentListingPage

      while (parent != null) {
        if (parent.slug != null) {
          path = `${parent.slug}/${path}`
        }
        parent = parent.parentListingPage
      }

      path = `${locale === 'no' ? '' : '/en'}/${path}`

      return path
    }

    else if (source._fl_meta_.schema === 'page') {
      return `${source.flamelink_locale === 'no' ? '' : '/en'}/${source.slug}`
    }

    else if (source._fl_meta_.schema === 'frontPage') {
      return source.flamelink_locale === 'no' ? '/' : '/en'
    }

    else return ""
  }

  const resolveLocalizedPaths = (source, context) => {
    const nodeType = source.internal.type
    const nodeId = source._fl_meta_.fl_id
    const query = {
      query: {
        filter: {
          _fl_meta_: {
            fl_id: {
              eq: nodeId
            }
          }
        },
      },
      type: nodeType,
      firstOnly: false
    }
    const result = context.nodeModel.runQuery(query).then(result => {
      var paths = []

      result.map(node => {
        paths.push({
          locale: node.flamelink_locale,
          path: resolvePath(node)
        })
      })

      return paths
    })
    return result
  }

  const resolvers = {
    FlamelinkListingPageContent: {
      path: {
        resolve(source, args, context, info) {
          return (resolvePath(source))
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
    },
    FlamelinkArticleContent: {
      path: {
        resolve(source, args, context, info) {
          return (resolvePath(source))
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
    },
    FlamelinkFrontPageContent: {
      path: {
        resolve(source, args, context, info) {
          return (resolvePath(source))
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
      linkColumns: {
        resolve(source, args, context, info) {
          return source.linkColumns.map(column => context.nodeModel.runQuery({
            query: {
              filter: {
                _fl_meta_: {
                  fl_id: {
                    eq: column._fl_meta_.fl_id
                  }
                },
                flamelink_locale: {
                  eq: source.flamelink_locale
                }
              },
            },
            type: 'FlamelinkLinkItemContent',
            firstOnly: true
          }).then(node => ({
            ...node
          })))
        },
      },
    },
    FlamelinkPageContent: {
      path: {
        resolve(source, args, context, info) {
          return (resolvePath(source))
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
    },
    FlamelinkLinkItemContent: {
      listingPage: {
        resolve(source, args, context, info) {
          if (source.listingPage._fl_meta_) {
            const nodeId = source.listingPage._fl_meta_.fl_id
            const nodeType = 'FlamelinkListingPageContent'
            const locale = source.flamelink_locale

            return context.nodeModel.runQuery({
              query: {
                filter: {
                  _fl_meta_: {
                    fl_id: {
                      eq: nodeId
                    }
                  },
                  flamelink_locale: {
                    eq: locale
                  }
                },
              },
              type: nodeType,
              firstOnly: true
            }).then(node => {
              return {
                ...node,
                path: resolvePath(node)
              }
            })
          }
          else return null
        }
      },
      page: {
        resolve(source, args, context, info) {
          if (source.page._fl_meta_) {
            const nodeId = source.page._fl_meta_.fl_id
            const nodeType = 'FlamelinkPageContent'
            const locale = source.flamelink_locale

            return context.nodeModel.runQuery({
              query: {
                filter: {
                  _fl_meta_: {
                    fl_id: {
                      eq: nodeId
                    }
                  },
                  flamelink_locale: {
                    eq: locale
                  }
                },
              },
              type: nodeType,
              firstOnly: true
            }).then(node => {
              return {
                ...node,
                path: resolvePath(node)
              }
            })
          }
          else return null
        }
      }
    }
  }
  createResolvers(resolvers)
}
