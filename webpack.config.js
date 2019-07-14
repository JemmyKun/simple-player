const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "build")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: ["babel-loader"]
      },
      {
        test: /\.(css|sass|scss)$/,
        exclude: /node_modules/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html"
    })
  ],
  devServer: {
    port: "8090",
    host: "localhost",
    hot: true,
    inline: true,
    compress: true,
    quiet: false
  }
};
