const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const RemcalcPlugin = require('less-plugin-remcalc');

const proxy = require('http-proxy-middleware');
const convert = require('koa-connect');
const Router = require('koa-router');

const router = new Router();

const proxyOptions = {
  target: 'https://www.ovh.com',
  endpoints: ['/engine', '/auth'],
  changeOrigin: true,
  // ... see: https://github.com/chimurai/http-proxy-middleware#options
};

const sso = require('./server/sso');

// Add endpoint for AUTH
router.all('/auth', sso.auth);
router.all('/auth/check', sso.checkAuth);

router.all('*', convert(proxy(proxyOptions)));

module.exports = {
  entry: './packages/ovh-manager/ovh-manager.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './packages/ovh-manager/ovh-manager.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              plugins: [
                RemcalcPlugin,
              ],
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        test: /\.xml$/,
        loader: path.resolve('loaders/translations.js'),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                'angularjs-annotate',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules'), 'node_modules'],
  },
  serve: {
    content: [__dirname],
    add: (app, middleware) => {
      // since we're manipulating the order of middleware added, we need to handle
      // adding these two internal middleware functions.
      middleware.webpack();
      middleware.content();

      // router *must* be the last middleware added
      app.use(router.routes());
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
