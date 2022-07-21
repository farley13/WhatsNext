const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const semver = require('semver');
const fs = require('fs');

// Setup
const app = express();
const port = process.env['REACT_APP_PORT'] || 3001;
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
  console.error("Error: Use node version 12.x for compatability with play.js. Use nvm to pin an appropriate version.");
}
app.use(middleware);
app.use(express.json());
// URL encoded bodies
app.use(require('body-parser').urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});
app.get('/api/workItems', async (req, res, next) => {
    const fileName = '/tmp/my_workitems.json';
    const fileContents = fs.readFile(fileName, (err, data) => {
	if (err) {
	    next(err) // Pass errors to Express.
	} else {
	    res.send(data)
	}
    });
  });

app.post('/api/workItems', (req, res, next) => {
    const fileName = '/tmp/my_workitems.json';
    fileData = JSON.stringify(req.body);
    console.log("request is" + fileData)
    fs.writeFile(fileName, fileData, (err) => {
	if (err) {
	    next(err) // Pass errors to Express.
	} else {
	    res.send('OK')
	}
    });
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
