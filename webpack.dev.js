const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: "development",
    plugins: [
        new BundleAnalyzerPlugin({
            openAnalyzer: false
        }),
        new DuplicatePackageCheckerPlugin()
    ]
}