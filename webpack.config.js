const path = require('path');
const webpack = require('webpack');
const RewriteImportPlugin = require("less-plugin-rewrite-import");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, 'build');
const NODE_MODULES_DIR = path.resolve(__dirname, 'node_modules');

var webpackConfig = {
  devtool: 'eval',
  entry: {
    index: path.resolve(SRC_DIR, 'index.js'),
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].[hash:8].js',
  },
  resolve: {
    modules: [ROOT_DIR, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(less|config)/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              paths: [ROOT_DIR, NODE_MODULES_DIR],
              plugins: [
                new RewriteImportPlugin({
                  paths: {
                    '../../theme.config':  __dirname + '/app/semantic-ui/theme.config',
                  },
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|svg|eot|ttf|woff2)$/,
        use: [
          { loader: 'file-loader' },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {presets: ['es2015']}
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'app/index.html',
      filename: 'index.html',
      chunks: ['index'],
      chunksSortMode: 'dependency',
      env: process.env,
    }),
  ],
};

module.exports = webpackConfig;
