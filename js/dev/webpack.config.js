var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./main.js",
  output: {
    filename: "../build/main.bundle.js"
  },
  watch: true
}
