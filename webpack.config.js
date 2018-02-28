const webpack = require('webpack')
const path = require('path')
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'text-overflow.min.js',
    library: 'textOverflow',
    // libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  },
  devServer: {
    port: 8088,
    inline: true,
    hot: true
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new UnminifiedWebpackPlugin(),
    new UglifyJsPlugin({
      include: /\.min\.js$/
    })
  ]
}