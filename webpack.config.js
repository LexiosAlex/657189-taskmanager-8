const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);


module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`),
  },
  devtool: `source-map`,
  module: {
    rules: [{
      test: /\.js$/,
      use: `babel-loader`
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./src/index.html`
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    hot: true,
    compress: true
  }
};
