const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtools: 'source-map',
  devServer: {
    inline: true
  },
	resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
  	bundle: './web-source/main.js',
  	vendor: ['d3']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '/assets/[name].js'
  },
  publicPath: './dist',
  module: {
    loaders: [
      { test: /\.jsx|js?$/, loader: 'babel?cacheDirectory=true', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap') },
      { test: /\.json$/, loader: 'json' },
      { test: /\.hbs$/, loader: 'handlebars' },
    ]
  },
  plugins: [
  	new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('/assets/[name].css'),
    new webpack.optimize.CommonsChunkPlugin("vendor", "/assets/vendor.js"),
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: './source/template.hbs'
    })
  ]
};
