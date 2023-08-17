const commonPaths = require('./common-paths');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
var webpack = require('webpack');
const port = process.env.PORT || 3000;

const config = {
  target: ["web", 'es5'],
  mode: 'development',
  entry: {
    app: [`${commonPaths.appEntry}/index.js`, 'webpack-plugin-serve/client'],
  },
  output: {
    filename: '[name].[fullhash].js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [require('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          name: '/public/icons/[name].[ext]'
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      // {
      //   test: /\.json$/,
      //   use: {
      //     loader: 'json-loader'
      //   }
      // },
      // {
      //   test: /\.json$/,
      //   loader: 'raw-loader'
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              // modules: {
              //   mode: 'local',
              //   exportLocalsConvention: 'camelCaseOnly',
              //   // namedExport: true,
              //   localIdentName: "foo__[name]__[local]",
              // },
            },
          },
        ],
      }
    ],
  },
  devServer: {
    historyFallback: true,
    contentBase: './',
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        // 'REACT_APP_API_URL': JSON.stringify('http://192.168.252.57:8000')
        'REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
      }
    }),
    new webpack.EnvironmentPlugin( { ...process.env } ),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
    new ReactRefreshWebpackPlugin({
      overlay: { sockIntegration: 'wps' },
    }),
    new Serve({
      historyFallback: true,
      liveReload: false,
      hmr: true,
      host: require('os').hostname().toLocaleLowerCase(),
      port: port,
      open: true,
      static: commonPaths.outputPath,
    }),
  ],
  watch: true,
};

module.exports = config;
