exports.createResolvers = ({ createResolvers }) => {
  const striptags = require("striptags")

  const resolvePath = (source, context) => {
    if (!source._fl_meta_) {
      return ""
    }

    if (
      source._fl_meta_.schema === "listingPage" ||
      source._fl_meta_.schema === "article"
    ) {
      const locale = source._fl_meta_.locale
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
      source._fl_meta_.schema === "studentListingPage" ||
      source._fl_meta_.schema === "studentArticle"
    ) {
      const locale = source._fl_meta_.locale
      var path = source.slug
      var parent = source.parentListingPage

      while (parent != null) {
        if (parent.slug != null) {
          path = `${parent.slug}/${path}`
        }
        parent = parent.parentListingPage
      }

      return context.nodeModel
        .runQuery({
          query: {
            filter: {
              flamelink_locale: {
                eq: locale,
              },
            },
          },
          type: "FlamelinkStudentPageContent",
          firstOnly: true,
        })
        .then((result) => {
          const slug = result.slug
          path = `${locale === "no" ? `/${slug}` : `/en/${slug}`}/${path}`
          return path
        })
    } else if (
      source._fl_meta_.schema === "page" ||
      source._fl_meta_.schema === "aboutStudyTrondheim" ||
      source._fl_meta_.schema === "studentPage"
    ) {
      return `${source._fl_meta_.locale === "no" ? "" : "/en"}/${source.slug}`
    } else if (source._fl_meta_.schema === "frontPage") {
      return source._fl_meta_.locale === "no" ? "/" : "/en"
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
          path: resolvePath(node, context),
        })
      })

      return paths
    })
    return result
  }

  const resolveTranslation = (source, context) => {
    const nodes = context.nodeModel
      .getAllNodes()
      .filter((node) => source.translations___NODE.includes(node.id))

    return nodes
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
          return !!source.parentListingPage &&
            (!Array.isArray(source.parentListingPage) ||
              !!source.parentListingPage.length)
            ? source.parentListingPage
            : null
        },
      },
    },
    FlamelinkStudentListingPageContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source, context)
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
    FlamelinkTextHtmlContentNode: {
      content: {
        async resolve(source) {
          return source.content == "<p></p>" || source.content == "<p></p>\n"
            ? null
            : source.content
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
    FlamelinkStudentArticleContent: {
      path: {
        resolve(source, args, context, info) {
          return resolvePath(source, context)
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
          return resolvePath(source, context)
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
    LinkColumn: {
      link: {
        async resolve(source, args, context, info) {
          switch (source.linkType) {
            case "listingPage":
              return {
                title: source.listingPage.navigationTitle,
                subtitle: source.listingPage.navigationSubtitle,
                path: resolvePath(source.listingPage),
              }
            case "page":
              return {
                title: source.page.title,
                subtitle: source.page.subTitle,
                path: resolvePath(source.page),
              }
            case "aboutStudyTrondheim":
              return {
                title: null,
                subtitle: null,
                path: resolvePath(source.aboutStudyTrondheim),
              }
            case "url":
              return {
                title: null,
                subtitle: null,
                path: source.url,
              }
          }
        },
      },
      icon: {
        resolve(source, args, context, info) {
          return context.nodeModel.getNodesByIds({
            ids: source.icon.map((icon) => icon.localFile___NODE),
            type: "File",
          })
        },
      },
    },
    FlamelinkArticleLocalizationContent: {
      translations: {
        async resolve(source, args, context, info) {
          return resolveTranslation(source, context)
        },
      },
    },
    FlamelinkListingPageLocalizationContent: {
      translations: {
        async resolve(source, args, context, info) {
          return resolveTranslation(source, context)
        },
      },
    },
    FlamelinkLayoutLocalizationContent: {
      translations: {
        async resolve(source, args, context, info) {
          return resolveTranslation(source, context)
        },
      },
    },
    KeyValueTranslation: {
      translations: {
        async resolve(source, args, context, info) {
          return resolveTranslation(source, context)
        },
      },
    },
  }
  createResolvers(resolvers)
}
