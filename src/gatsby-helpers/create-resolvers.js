exports.createResolvers = ({ createResolvers }) => {
  const striptags = require("striptags")
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
    } else if (
      source._fl_meta_.schema === "page" ||
      source._fl_meta_.schema === "aboutStudyTrondheim"
    ) {
      console.log(source._fl_meta_.schema, source.slug)
      return `${source.flamelink_locale === "no" ? "" : "/en"}/${source.slug}`
    } else if (source._fl_meta_.schema === "frontPage") {
      return source.flamelink_locale === "no" ? "/" : "/en"
    } else return ""
  }

  const resolveMapPath = (source) => {
    if (source.hasMapPage) {
      const locale = source.flamelink_locale
      var path = encodeURI(
        source.mapPageTitle
          .toLowerCase()
          .split(" ")
          .join("-")
          .split("å")
          .join("a")
          .split("ø")
          .join("o")
          .split("æ")
          .join("ae")
      )
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
    const result = context.nodeModel.runQuery(query).then((result) => {
      var paths = []
      result.map((node) => {
        paths.push({
          locale: node.flamelink_locale,
          path: resolvePath(node),
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
      parentListingPage: {
        async resolve(source, args, context, info) {
          // Check if parentListingPage is not null
          // And if it is an Array, that it contains at least one element
          return !!source.parentListingPage &&
            (!Array.isArray(source.parentListingPage) ||
              !!source.parentListingPage.length)
            ? source.parentListingPage
            : null
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
    FlamelinkFrontPageContent: {
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
    FlamelinkAboutStudyTrondheimContent: {
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
      aboutStudyTrondheim: {
        resolve(source, args, context, info) {
          source.aboutStudyTrondheim && source.aboutStudyTrondheim._fl_meta_
            ? findSource(
                context,
                source.aboutStudyTrondheim,
                "FlamelinkAboutStudyTrondheimContent",
                source.flamelink_locale
              ).then((node) => {
                return {
                  ...node,
                  path: resolvePath(node),
                }
              })
            : null
        },
      },
    },
  }
  createResolvers(resolvers)
}
