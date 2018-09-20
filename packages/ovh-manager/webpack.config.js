const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const prod = require('./webpack.prod.js');
const dev = require('./webpack.dev.js');

module.exports = (env = {}) => merge(common, env.production ? prod : dev(env));
