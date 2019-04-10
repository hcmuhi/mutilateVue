'use strict'

const { join, resolve } = require('path')
const webpack = require('webpack')
const glob = require('glob')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { renderString } = require('template-file')
const srcConfig = require('../src/config')
const pageSettings = srcConfig.pageSettings || {}

const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: './src/common/css/[name].css',
  allChunks: true
})
const extractLESS = new ExtractTextPlugin({
  filename: './src/common/css/[name].less',
  allChunks: true
})

// html 处理start
const entries = {}
const chunks = []
const htmlWebpackPluginArray = []
glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  // console.log(chunk)
  entries[chunk] = path
  // chunks.push(chunk)

  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    chunk: chunk, // 用于自定义组件
    template: './src/app.html',
    inject: 'body',
    favicon: './src/common/img/logo.png',
    hash: true,
    chunks: ['commons', chunk]
  }
  // console.log(htmlConf)
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

// 自定义 html 插件 替换模板
function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
    // console.log('The compiler is starting a new compilation...');

    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'MyPlugin',
      (data, cb) => {
        const page = data.plugin.options.chunk.replace(/\/|\\/g, '_');
        data.html = renderString(data.html, pageSettings[page] || pageSettings.defult || {});

        cb(null, data)
      }
    )
  })
}
// html 处理end
const styleLoaderOptions = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}
const cssOptions = [
  { loader: 'css-loader', options: { sourceMap: true } },
  { loader: 'postcss-loader', options: { sourceMap: true } }
]
const lessOptions = [...cssOptions, {
  loader: 'less-loader',
  options: {
    sourceMap: true
  }
}]
const config = {
  entry: entries,
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      assets: join(__dirname, '../src/assets'),
      components: join(__dirname, '../src/components'),
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            })),
            less: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: lessOptions,
              fallback: styleLoaderOptions
            })),
            postcss: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              use: cssOptions,
              fallback: styleLoaderOptions
            }))
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: cssOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.less$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: lessOptions,
          fallback: styleLoaderOptions
        }))
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/img/[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 3,
          name: 'commons',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: resolve('src/static'),
      to: 'static'
    }]),
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractLESS,
    extractCSS
  ]
}
config.plugins = [...config.plugins, ...htmlWebpackPluginArray, new MyPlugin()]
module.exports = config
