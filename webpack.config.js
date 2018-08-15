// const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'dev');
const prod = process.argv.indexOf('-p') !== -1;

const config = {
  entry: path.resolve(APP_DIR, 'main.js'),
  output: {
    path: BUILD_DIR,
    filename: prod ? 'rest-in-model.min.js' : 'rest-in-model.js',
    library: 'rest-in-model',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        include: APP_DIR,
        use: 'babel-loader',
      },
    ],
  },
};

module.exports = config;
