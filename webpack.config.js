const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: [
      './src/App'
    ]
  },
 resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
  }, 
  module: {
    rules: [
      {
        test: (m) => { return /\.(js|jsx|ts|tsx)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        // For pure CSS - /\.css$/i,
        // For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
        // For Less - /\.((c|le)ss)$/i,
        test: (m) => { return /\.((c|sa|sc)ss)$/.test(m) },
	exclude: (m) => { return /node_modules/.test(m) },
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // Run `postcss-loader` on each CSS `@import` and CSS modules/ICSS imports, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
              // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
              importLoaders: 1,
	      modules: true,
            },
          },
/*          {
            loader: "postcss-loader",
            options: { plugins: () => [postcssPresetEnv({ stage: 0 })] },
          },
          // Can be `less-loader`
          {
            loader: "sass-loader",
          },*/
        ],
      },
      // For webpack v5
/*      {
        test: (m) => { return /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/.test(m) },
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },*/
      {
        test: (m) => { return /\.(png|jp(e*)g|svg)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
        use: [{
          loader: 'url-loader',
          options: { 
            limit: 8000,
            name: 'images/[hash]-[name].[ext]'
          } 
        }]
      }
    ]
  },
  plugins: [],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  }
};
