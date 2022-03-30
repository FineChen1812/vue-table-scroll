const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {merge} = require('webpack-merge')
const base = require('./webpack.base')

module.exports = merge(base, {
  entry: {
    dev: path.resolve(__dirname, '../src/main.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ]
})