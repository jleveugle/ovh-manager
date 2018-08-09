const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin')
const proxy = require('http-proxy-middleware')
const webpack = require('webpack')
const RemcalcPlugin = require('less-plugin-remcalc')
const nodeExternals = require('webpack-node-externals')

const convert = require('koa-connect')
const Router = require('koa-router')

const router = new Router()

const pkg = require('./package.json')

const proxyOptions = {
  target: 'https://www.ovh.com',
  endpoints: ['/engine', '/auth'],
  changeOrigin: true,
  // ... see: https://github.com/chimurai/http-proxy-middleware#options
}

module.exports = {
    entry : __dirname + '/ovh-manager-license.js',
    // entry   : {
    //     app     : __dirname + '/ovh-manager-license.js'
    //     // vendor  : Object.keys(pkg.dependencies) //get npm vendors deps from config
    // },
    mode: 'development',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'ovh-manager-license.js',
        jsonpScriptType: "text/javascript"
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            name: false
        }
    },
    plugins: [
        // new webpack.optimization.splitChunks('vendor', 'vendor.min-[hash:6].js'),
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ngAnnotatePlugin({
            add: true
        })
    ],
    externals: [nodeExternals({
        modulesFromFile: true
    })],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            plugins: [
                                RemcalcPlugin
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                    },
                },
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            },
            {
                test: /\.xml$/,
                loader: path.resolve('../../loaders/translations.js')
            }
        ]
    }
}
