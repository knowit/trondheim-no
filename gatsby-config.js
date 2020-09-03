require("dotenv").config({
  path: `.env.production`,
})

const nodeIsIndex = (node, locale) => {
  if (node.flamelink_locale != null) {
    return node.flamelink_locale === locale
  } else if (node.parent != null) {
    return nodeIsIndex(node.parent, locale)
  } else return false
}

const resolvePath = (node) => {
  if (node.path) {
    return node.path
  } else {
    const root = node.flamelink_locale === "no" ? "/" : "/en/"
    const slug = node.slug

    var path = slug

    var parentListingPage = node.parentListingPage
    while (parentListingPage != null) {
      if (parentListingPage.slug != null) {
        path = `${parentListingPage.slug}/${path}`
      }
      parentListingPage = parentListingPage.parentListingPage
    }

    return `${root}${path}`
  }
}

const striptags = require("striptags")
const resolveContent = (node) => {
  if (node.internal.type === "FlamelinkTextHtmlContentNode") {
    console.log(node)
  }
  return ""
}

module.exports = {
  siteMetadata: {
    title: `Trondheim.no`,
    description: `Offisielt nettsted for Trondheim`,
    author: `@trondheim`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-relative-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
              sizeByPixelDensity: true,
              showCaptions: true,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: false,
        defaultQuality: 90,
      },
    },
    {
      resolve: `gatsby-mdx-fix`,
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          `gatsby-remark-relative-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 860,
              backgroundColor: "none",
            },
          },
        ],
      },
    },

    {
      resolve: "gatsby-source-flamelink",
      options: {
        firebaseConfig: {
          projectId: process.env.GATSBY_FLAMELINK_PROJECT_ID,
          clientEmail: process.env.GATSBY_FLAMELINK_CLIENT_EMAIL,
          privateKey: process.env.GATSBY_FLAMELINK_PRIVATE_KEY.replace(
            /\\n/g,
            "\n"
          ),
          databaseURL: process.env.GATSBY_FLAMELINK_DATABASE_URL,
          storageBucket: process.env.GATSBY_FLAMELINK_STORAGE_BUCKET,
        },
        dbType: "cf",
        environment: "production",
        content: true,
        populate: true,
        navigation: true,
        globals: true,
      },
    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: "file",
        imagePath: "edges[].node.url",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Offisielt nettsted for Trondheim`,
        short_name: `Trondheim.no`,
        start_url: `/`,
        lang: `no`,
        background_color: `#f7f0eb`,
        theme_color: `#000000`,
        display: `standalone`,
        scope: "/",
        cache_busting_mode: "none",
        icons: [
          {
            src: `images/logo192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `images/logo512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
        localize: [
          {
            start_url: `/en/`,
            lang: `en-US`,
            name: `The official website for Trondheim`,
            short_name: `Trondheim.no`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        languages: [
          {
            // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
            name: "no",
            // A function for filtering nodes. () => true by default
            filterNodes: (node) => nodeIsIndex(node, "no"),
            // Add to index custom entries, that are not actually extracted from gatsby nodes
            customEntries: [],
          },
          {
            // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
            name: "en",
            // A function for filtering nodes. () => true by default
            filterNodes: (node) => nodeIsIndex(node, "en-US"),
            // Add to index custom entries, that are not actually extracted from gatsby nodes
            customEntries: [],
          },
        ],
        // Fields to index. If store === true value will be stored in index file.
        // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
        fields: [
          { name: "title", store: true, attributes: { boost: 20 } },
          { name: "content", store: true },
          { name: "url", store: true },
        ],
        // How to resolve each field's value for a supported node type
        resolvers: {
          FlamelinkPageContent: {
            title: (node) => node.title,
            content: (node) => resolveContent(node),
            url: (node) => resolvePath(node),
          },

          FlamelinkListingPageContent: {
            title: (node) => node.localTitle,
            content: (node) => node.textOnPage,
            url: (node) => resolvePath(node),
          },

          FlamelinkArticleContent: {
            title: (node) => node.title,
            content: (node) => node.fields.textContent,
            url: (node) => resolvePath(node),
          },
        },
        //custom index file name, default is search_index.json
        filename: "search_index.json",
        //custom options on fetch api call for search_ındex.json
        fetchOptions: {
          credentials: "same-origin",
        },
      },
    },
  ],
}
