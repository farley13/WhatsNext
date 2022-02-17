const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const semver = require('semver');

// Setup
const app = express();
const port = process.env['REACT_APP_PORT'];
const nodeVersion = process.version;
const config = require('./webpack.config.js');
const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  serverSideRender: false,
  watchOptions: {
    // Due to iOS devices memory constraints
    // disabling file watching is recommended 
    ignored: /.*/
  }
});
if(!semver.satisfies(nodeVersion, "12.x")) {
  console.error("Need to use node version 12.x for compatability with play.js. Use nvm to pin an appropriate version.");
}
app.use(middleware);
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Launch app
app.listen(port, () => {
  console.log(
    'Launching app... http://localhost:' + port + '\n'
  );
});

// Register app and middleware. Required for better
// performance when running from play.js
try { pjs.register(app, middleware); } catch (error) { }
