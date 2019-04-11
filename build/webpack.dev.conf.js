'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    historyApiFallback: false,
    noInfo: true,
    proxy: {
      '/api': {
        target: 'http://wl.kafu56.com/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    },
    open: true,
    openPage: 'demo/home.html'
  }
})

module.exports = devWebpackConfig