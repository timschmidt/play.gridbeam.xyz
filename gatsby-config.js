module.exports = {
  siteMetadata: {
    title: 'Replimat Sandbox',
    description: 'Play with Replimat and build real things!',
    author: 'Mikey Williams',
  },
  plugins: [
    'gatsby-plugin-root-import',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    'gatsby-plugin-theme-ui',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gridcraft-sandbox',
        short_name: 'play.replimat.org',
        start_url: '/',
        background_color: '#4B2D73',
        theme_color: '#4B2D73',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    //{
    //  resolve: 'gatsby-plugin-matomo',
    //  options: {
    //    siteId: '2',
    //    matomoUrl: 'https://analytics.mikey.nz',
    //    siteUrl: 'https://play.gridbeam.xyz',
    //  },
    //},
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
      },
    },
    'gatsby-plugin-lodash',
    'gatsby-plugin-webpack-bundle-analyzer',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
