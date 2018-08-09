const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const proxy = require('http-proxy-middleware')
const convert = require('koa-connect')
const Router = require('koa-router')

const router = new Router()

const proxyOptions = {
  target: 'https://www.ovh.com',
  endpoints: ['/engine', '/auth'],
  changeOrigin: true,
  // ... see: https://github.com/chimurai/http-proxy-middleware#options
}

const sso = require('./server/sso')

// Add endpoint for AUTH
router.all("/auth", sso.auth)
router.all("/auth/check", sso.checkAuth)

router.all("*", convert(proxy(proxyOptions)));

module.exports = {
    mode: "development",
    plugins: [
        new BundleAnalyzerPlugin({
            openAnalyzer: false
        })
    ],
    serve: {
        content: [__dirname],
        add: (app, middleware, options) => {
          // since we're manipulating the order of middleware added, we need to handle
          // adding these two internal middleware functions.
          middleware.webpack();
          middleware.content();

          // router *must* be the last middleware added
          app.use(router.routes());
        },
    }
}