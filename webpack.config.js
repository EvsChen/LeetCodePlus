const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    options: './src/options.js',
    popup: './src/popup.js',
    onEnterProblem: './src/onEnterProblem.js',
    onEnterProblemSet: './src/onEnterProblemSet.js',
    background: './src/background.js',
    editorEvent: './src/editorEvent.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  devtool: 'inline-source-map',
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'public/options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'public/popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin([
      {from: 'public/images', to: 'images'},
      {from: 'manifest.json', to: 'manifest.json'},
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
        ],
      },
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'less-loader'},
        ],
      },
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 5000,
    ignored: /node_modules/,
  },
};
