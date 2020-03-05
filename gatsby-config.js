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
          pathToServiceAccount: 'C:/Users/levis/Documents/Github/trondheim-demo/app/service-account.json',
          databaseURL: 'https://trondheimno-demo.firebaseio.com',
          storageBucket: 'trondheimno-demo.appspot.com'
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
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/layouts/layout.js`),
      },
    },
  ],
}
