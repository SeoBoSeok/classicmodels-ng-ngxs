// This is server for frontend angular app in node.js platform.
// For example to deploy heroku:
// (we assume that you already create heroku account, download and installed heroku-cli)
// only first time to heroku:
//	1. heroku login
//
// in this directory
//	1. heroku create -> gen heroku app-id
//	2. git init
//	3. heroku git:remote -a <heroku app-id>
//	4 delete '/dist' line in .gitignore
//
// to deploy
//	1. ng build -prod
//	2. git add .
//	3. git commit -m "1st deploy"
//	4. git push heroku master
//	5. heroku open

const path = require('path');
const express = require('express');
const app = express();

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);
