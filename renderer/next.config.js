module.exports = {
  webpack(config) {
    config.target = 'electron-renderer';
    // Remove minifed react aliases for material-ui so production builds work
    if (config.resolve.alias) {
      delete config.resolve.alias.react;
      delete config.resolve.alias['react-dom'];
    }

    config.plugins = config.plugins.filter((plugin) => {
      if (plugin.constructor.name === 'UglifyJsPlugin') {
        return false;
      }
      return true;
    });

    return config;
  },
  exportPathMap() {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      '/start': { page: '/start' }
    };
  }
};
