const commonPaths = require('./common-paths');
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const config = {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  entry: {
    app: [`${commonPaths.appEntry}/index.js`],
  },
  output: {
    filename: 'static/[name].[fullhash].js',
  },
  devtool: 'source-map',

  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          name: '/public/icons/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              esModule: true,
              // modules: {
              //   mode: 'local',
              //   exportLocalsConvention: 'camelCaseOnly',
              //   namedExport: true,
              //   localIdentName: "foo__[name]__[local]",
              // },
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'REACT_APP_API_URL': JSON.stringify('http://10.10.60.2:1000')
        // 'REACT_APP_API_URL': JSON.stringify('http://10.10.30.2:1000')
        // 'REACT_APP_API_URL': JSON.stringify('http://169.254.70.13:1000')
        // 'REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
      }
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      React: 'react',
    }),
    new ReactRefreshWebpackPlugin({
      overlay: { sockIntegration: 'wps' },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[fullhash].css',
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
    new Serve({
      historyFallback: true,
      liveReload: false,
      hmr: true,
      host: require('os').hostname().toLocaleLowerCase(),
      open: true,
      static: commonPaths.outputPath,
    }),

    new ReactRefreshWebpackPlugin({
      overlay: { sockIntegration: 'wps' },
    }),
  ],
};

module.exports = config;
