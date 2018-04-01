const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "Workflow Analysis",
      template: "src/index.html"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/assets/sampleData.htm",
        to: "sampleData.htm"
      }
    ])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist")
  }
};
