const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry:  "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader'},
      },
      {
        test: /\.css$/,
        use: [ 'style-loader' , 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|otf)$/,
        loader: 'url-loader'
      }
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      favicon: './src/assets/images/favicon.ico'
    }),
    new Dotenv()
  ],
};