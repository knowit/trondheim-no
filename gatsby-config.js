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

module.exports = {
  siteMetadata: {
    title: `Trondheim.no`,
    description: `Offisielt nettsted for Trondheim`,
    author: `@trondheim`,
    keywords: ["Trondheim"],
    siteUrl: "https://trondheim.no/",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,

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
        content: [
          {
            schemaKey: "article",
            populate: true,
            filters: [
              ["_fl_meta_.status", "==", process.env.GATSBY_FLAMELINK_STATUS],
            ],
          },
          {
            schemaKey: "studentArticle",
            populate: true,
          },
          {
            schemaKey: "page",
            populate: true,
            filters: [
              ["_fl_meta_.status", "==", process.env.GATSBY_FLAMELINK_STATUS],
            ],
          },
          { schemaKey: "articleLocalization", populate: true },
          { schemaKey: "copyright", populate: true },
          { schemaKey: "defaultThumbnails", populate: true },
          { schemaKey: "frontPage", populate: true },
          { schemaKey: "layoutLocalization", populate: true },

          { schemaKey: "listingPage", populate: true },
          { schemaKey: "studentListingPage", populate: true },
          { schemaKey: "listingPageLocalization", populate: true },
          { schemaKey: "navbar", populate: true },
          { schemaKey: "seo", populate: true },
          { schemaKey: "studentPage", populate: true },
          { schemaKey: "aboutStudyTrondheim", populate: true },
        ],
        dbType: "cf",
        environment: "production",
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
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [
          "/",
          "/en",
          "/hoteller/**/*",
          "/en/hotels/**/*",
          "/shopping/**/*",
          "/en/shopping-areas/**/*",
          "/severdig/**/*",
          "/en/attractions/**/*",
          "/spisesteder/**/*",
          "/en/restaurants/**/*",
          "/ut-pa-tur/**/*",
          "/en/hiking-and-walks/**/*",
        ],
      },
    },
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
            content: (node) => node.fields.textContent,
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
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        //exclude url from appearing in search results
        exclude: ["/search", "/en/search", "/en/404"],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.trondheim.no/",
        sitemap: "https://www.trondheim.no/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/*" }],
      },
    },
  ],
}
