const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        template: './public/index.html',
        filename: 'index.html'
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'sync'
      }),
      new CopyWebpackPlugin([])
    ]
  },
  devServer: {
    https: false,
    disableHostCheck: true,
    // proxy: {
    // '/uploads': {
    //  target: 'http://localhost:3000',
    // },
    // '/sockjs-node': {
    //  target: 'http://localhost:3000',
    // },
    // }
  }
}
