exports.createResolvers = ({ createResolvers }) => {
  const striptags = require("striptags")
  const { UrlHelper } = require("../helpers/url-helper")

  const resolvePath = (source) => {
    if (!source._fl_meta_) {
      return ""
    }
    if (
      source._fl_meta_.schema === "listingPage" ||
      source._fl_meta_.schema === "article"
    ) {
      const locale = source.flamelink_locale
      var path = source.slug
      var parent = source.parentListingPage

      while (parent != null) {
        if (parent.slug != null) {
          path = `${parent.slug}/${path}`
        }
        parent = parent.parentListingPage
      }

      path = `${locale === "no" ? "" : "/en"}/${path}`

      return path
    } else if (source._fl_meta_.schema === "page") {
      return `${source.flamelink_locale === "no" ? "" : "/en"}/${source.slug}`
    } else if (source._fl_meta_.schema === "newFrontPage") {
      return source.flamelink_locale === "no" ? "/" : "/en"
    } else return ""
  }

  const resolveNavigationPath = (source) => {
    const resolveChildren = (item, url) => {
      url += item.url
      const children = item.flamelink_children.map((child) =>
        resolveChildren(child, url)
      )
      return {
        ...item,
        flamelink_children: children,
        url,
      }
    }
    return source.items.map((it) => {
      if (UrlHelper.validURL(it.url)) {
        return {
          ...it,
          url: UrlHelper.fixHttp(it.url)
        }
      }
      const url = source.flamelink_locale === "no" ? "" : "/en"
      return resolveChildren(it, url)
    })
  }

  const resolveMapPath = (source) => {
    if (source.hasMapPage) {
      const locale = source.flamelink_locale
      var path = source.mapPageTitle.toLowerCase().split(" ").join("-")
      var parent = source.parentListingPage

      while (parent != null) {
        if (parent.slug != null) {
          path = `${parent.slug}/${path}`
        }
        parent = parent.parentListingPage
      }

      path = `${locale === "no" ? "" : "/en"}/${path}`

      return path
    }
    return ""
  }

  const findSource = (context, node, type, locale) =>
    context.nodeModel.runQuery({
      query: {
        filter: {
          _fl_meta_: {
            fl_id: {
              eq: node._fl_meta_.fl_id,
            },
          },
          flamelink_locale: {
            eq: locale,
          },
        },
      },
      type: type,
      firstOnly: true,
    })

  const resolveLocalizedPaths = (source, context) => {
    const nodeType = source.internal.type
    const nodeId = source._fl_meta_.fl_id
    const nodeSchemaType = source._fl_meta_.schemaType
    const nodeSchema = source._fl_meta_.schema
    const query = {
      query: {
        filter: {
          _fl_meta_:
            nodeSchemaType === "single"
              ? {
                  schema: {
                    eq: nodeSchema,
                  },
                }
              : {
                  fl_id: {
                    eq: nodeId,
                  },
                },
        },
      },
      type: nodeType,
      firstOnly: false,
    }
    const result = context.nodeModel.runQuery(query).then((result) =>
      result.map((node) => {
        return {
          locale: node.flamelink_locale,
          path: resolvePath(node),
        }
      })
    )
    return result
  }

  const resolvers = {
    FlamelinkSidebarMainMenuNavigation: {
      items: {
        resolve(source) {
          return resolveNavigationPath(source)
        },
      },
    },
    FlamelinkSidebarSecondaryMenuNavigation: {
      items: {
        resolve(source) {
          return resolveNavigationPath(source)
        },
      },
    },
    FlamelinkListingPageContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source)
        },
      },
      mapPath: {
        resolve(source, args, context, info) {
          return resolveMapPath(source)
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
          return resolvePath(source)
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
    },
    FlamelinkNewFrontPageContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source)
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
      frontPageAttractions: {
        resolve(source, args, context, info) {
          return source.frontPageAttractions.map((attraction) =>
            findSource(
              context,
              attraction,
              "FlamelinkArticleContent",
              source.flamelink_locale
            ).then((node) => ({
              ...node,
            }))
          )
        },
      },
      frontPageMaps: {
        resolve(source, args, context, info) {
          return source.frontPageMaps.map((map) =>
            findSource(
              context,
              map,
              "FlamelinkListingPageContent",
              source.flamelink_locale
            ).then((node) => ({
              ...node,
            }))
          )
        },
      },
    },

    FlamelinkStudentPageContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source)
        },
      },
      localizedPaths: {
        resolve(source, args, context, info) {
          return resolveLocalizedPaths(source, context)
        },
      },
      additionalListingPages: {
        resolve(source, args, context, info) {
          const result = source.additionalListingPages.map((listingPage) =>
            findSource(
              context,
              listingPage,
              "FlamelinkListingPageContent",
              source.flamelink_locale
            ).then((node) => ({
              ...node,
              path: resolvePath(node),
            }))
          )
          return result ? result : []
        },
      },
      linkColumns: {
        resolve(source, args, context, info) {
          return source.linkColumns.map((column) =>
            findSource(
              context,
              column,
              "FlamelinkLinkItemContent",
              source.flamelink_locale
            ).then((node) => ({
              ...node,
            }))
          )
        },
      },
    },
    FlamelinkPageContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source)
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
            return findSource(
              context,
              source.listingPage,
              "FlamelinkListingPageContent",
              source.flamelink_locale
            ).then((node) => {
              return {
                ...node,
                path: resolvePath(node),
              }
            })
          } else return null
        },
      },
      page: {
        resolve(source, args, context, info) {
          if (source.page != null) {
            return source.page._fl_meta_ != null
              ? findSource(
                  context,
                  source.page,
                  "FlamelinkPageContent",
                  source.flamelink_locale
                ).then((node) => {
                  return {
                    ...node,
                    path: resolvePath(node),
                  }
                })
              : null
          } else return null
        },
      },
    },
  }
  createResolvers(resolvers)
}
