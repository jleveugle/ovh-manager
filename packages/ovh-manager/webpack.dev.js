const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const proxyOptions = {
  target: 'https://www.ovh.com',
  context: ['/engine', '/auth'],
  changeOrigin: true,
  logLevel: 'silent',
};

const sso = require('./server/sso');
const serverProxy = require('./server/proxy');

module.exports = (env) => {
  const devProxy = [proxyOptions];
  if (env.local2API) {
    devProxy.unshift(serverProxy.aapi);
  }
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
      new DuplicatePackageCheckerPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    devServer: {
      before: (app) => {
        app.get('/auth', sso.auth);
        app.get('/auth/check', sso.checkAuth);
      },
      clientLogLevel: 'none',
      https: true,
      logLevel: 'silent',
      overlay: true,
      port: 9000,
      proxy: devProxy,
    },
  };
};
