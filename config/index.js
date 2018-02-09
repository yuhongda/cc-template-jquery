var path = require('path')

module.exports = {
  build: {
    env: require('./prod'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './',
    assetsPublicPath: './',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev'),
    port: 8801,
    autoOpenBrowser: true,
    assetsSubDirectory: '',
    assetsPublicPath: '/'
  }
}
