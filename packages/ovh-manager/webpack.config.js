const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const devServer = require('@ovh-ux/manager-webpack-dev-server');

module.exports = (opts, env = {}) => {
  return merge(common, env.production ? require('./webpack.prod.js') : devServer.config(env));
};
