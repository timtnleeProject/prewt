const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { outPath } = require("./setting");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: outPath,
    compress: true,
    port: 9487,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      }, // this will enable/disable displaying warning/errors on the browser page
    },
  },
});
