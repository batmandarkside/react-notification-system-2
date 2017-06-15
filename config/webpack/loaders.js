var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pathApp = require('./paths');

const DEBUG = pathApp.processEnv !== 'production';

const presetsBabel = [
  'es2015',
  'stage-0',
  'react'
];

if (DEBUG) {
  presetsBabel.push('react-hmre');
}



module.exports = [
  {
    test   : /\.jsx?$/,
    loader : 'babel-loader',
    exclude: /(node_modules)/,
    query  : {
      plugins       : ['transform-decorators-legacy'],
      env           : {
        modules: false
      },
      presets       : presetsBabel,
      cacheDirectory: true
    }
  },
  {
    test: /\.(png|ico|jpe?g|jpeg|gif|svg)$/i,
    use : [
      {
        loader: 'file-loader',
        query : {
          limit  : 10,
          context: pathApp.relAssetsPath,
          name   : '[path][name].[hash:8].[ext]'
        }
      }
    ]
  },
  {
    test   : /\.(ttf|eot|otf|swf)(\?\S*)?$/i,
    exclude: /node_modules/,
    loader : 'url-loader',
    query  : {
      limit  : 10,
      context: pathApp.relAssetsPath,
      name   : '[path][name].[ext]'
    }
  },
  {
    test  : /\.woff(2)?(\?[a-z0-9]+)?$/,
    loader: 'url-loader',
    query : {
      limit        : 10000,
      importLoaders: 1,
      mimetype     : 'application/font-woff',
      context      : pathApp.relAssetsPath,
      name         : '[path][name].[ext]'
    }
  },
  {
    test: /\.css/,
    use : DEBUG ?
      ['style-loader', 'css-loader', 'postcss-loader'] :
      ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use     : 'css-loader!postcss-loader',
      })
  },
  {
    test: /\.sass$/,
    use : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use     : [
        'css-loader',
        'autoprefixer-loader?browsers=last 2 version',
        'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './example/src')
      ]
    })
  }
];
