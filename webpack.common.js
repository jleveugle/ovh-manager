const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin')
const webpack = require('webpack')
const RemcalcPlugin = require('less-plugin-remcalc')

module.exports = {
    entry: './packages/ovh-manager/ovh-manager.js',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './packages/ovh-manager/ovh-manager.html'
        }),
        new ngAnnotatePlugin({
            add: true
        })
    ],
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
                loader: path.resolve('loaders/translations.js')
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-syntax-dynamic-import"]
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            'angular': path.join(__dirname, './node_modules/angular')
        }
    }
}