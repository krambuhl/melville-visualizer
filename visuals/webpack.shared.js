const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = ({ name, port }) => ({
  devtools: 'source-map',
  devServer: {
    inline: true,
    contentBase: './dist'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    bundle: [
      path.resolve(__dirname, name, 'main.js')
    ],
    vendor: ['d3', 'socket.io-client']
  },
  output: {
    path: path.resolve(__dirname, '../dist', name),
    filename: './assets/[name].js'
  },
  publicPath: './dist/',
  module: {
    loaders: [
      { test: /\.jsx|js?$/, loader: 'babel?cacheDirectory=true', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap') },
      { test: /\.json$/, loader: 'json' },
      { test: /\.hbs$/, loader: 'handlebars' },
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist', name)], { force: true }),
    new ExtractTextPlugin('./assets/[name].css'),
    new webpack.optimize.CommonsChunkPlugin("vendor", "./assets/vendor.js"),
    new HtmlWebpackPlugin({
      title: name,
      template: path.resolve(__dirname, name, 'template.hbs')
    })
  ]
});
