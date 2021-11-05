// Generate by
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { outPath, srcPath, rootPath } = require("./setting");

const env = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../.env-cmdrc"), "utf-8")
);
const environmentVariables = Object.keys(env.development);

module.exports = {
  context: srcPath,
  entry: ["./index.tsx"],
  output: {
    path: outPath,
    publicPath: "",
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": srcPath,
      "@root": rootPath,
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin(environmentVariables),
    new CopyPlugin({
      patterns: [path.resolve(__dirname, "../public")],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "../tsconfig.json", // becuase webpack context is "src"
      },
    }),
    new ESLintPlugin({
      failOnError: false,
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ],
};
