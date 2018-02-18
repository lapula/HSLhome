var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./main.js",
  output: {
    filename: "../build/main.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  watch: true
}
