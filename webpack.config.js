/**
 * @author justin on 7/8/16.
 */

var path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'rocChart',
    libraryTarget: 'umd',
    filename: 'bundle.js',
    umdNamedDefine: true
  },
  externals: [
    {
      "d3": {
        "root": "d3",
        "commonjs2": "d3",
        "commonjs": "d3",
        "amd": "d3"
      }
    }
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: []
  }
};