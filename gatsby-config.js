
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-flamelink',
      options: {
        firebaseConfig: {
          projectId: process.env.GATSBY_FLAMELINK_PROJECT_ID,
          clientEmail: process.env.GATSBY_FLAMELINK_CLIENT_EMAIL,
          privateKey: process.env.GATSBY_FLAMELINK_PRIVATE_KEY.replace(/\\n/g, '\n'),
          databaseURL: process.env.GATSBY_FLAMELINK_DATABASE_URL,
          storageBucket: process.env.GATSBY_FLAMELINK_STORAGE_BUCKET,
        },
        dbType: 'cf',
        environment: 'production',
        content: true,
        populate: true,
        navigation: true,
        globals: true
      }
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
        cache_busting_mode: 'none',
        crossOrigin: `anonymous`,
        icons: [
          {
            src: `/images/logo192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/images/logo512.png`,
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
      resolve: 'gatsby-plugin-offline',
      options: {
        workboxConfig: {
          globPatterns: ['**/*']
        }
      }
    },
  ],
}
