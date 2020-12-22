require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = parseInt(process.env.PORT, 10) || 3000;

module.exports = {
  stats: "errors-only",
  mode: NODE_ENV,
  devtool: NODE_ENV === "production" ? false : "cheap-eval-source-map",
  devServer: {
    historyApiFallback: true,
    proxy: { "/api": "http://localhost:" + PORT },
  },
  entry: { bundle: ["./src/index.js"] },
  resolve: {
    alias: { svelte: path.resolve("node_modules", "svelte") },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: { path: `${__dirname}/build`, filename: "[name].[chunkhash].js" },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: { emitCss: false, hotReload: true },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/carbon-components-svelte@0.26.0/css/g90.css"
          />
          <title>Intro to Svelte</title>
        </head>
        <body></body>
      </html>    
    `,
    }),
  ],
};
