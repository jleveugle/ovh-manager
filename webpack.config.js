const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common , process.env.WEBPACK_SERVE ? require("./webpack.dev.js") : require("./webpack.prod.js"))