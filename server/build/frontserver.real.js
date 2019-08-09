'use strict';

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var opn = require('opn');
var path = require('path');
var express = require('express');
var fs = require('fs');

var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var config = require('./webpack.prod.config.js');

require('dotenv').config({ path: './config/real.env' });

var port = process.env.PORT || 8000;
var app = express();

// this middleware serves all js files as gzip
app.use(function (req, res, next) {
  var originalPath = req.path;

  if (!originalPath.startsWith('/bundle')) {
    next();
    return;
  }

  try {
    if (originalPath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
    res.append('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', 'public, max-age=512000');
    req.url = req.url + '.gz';
  } catch (e) {
    console.log(e);
  }

  next();
});

app.use(express.static(path.join(__dirname, 'dist/static')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s.', port);
  // opn(`http://localhost:${port}`)
  //   .catch(err => {
  //     console.log(`can't open in your pc`)
  //   })
});
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(port, 'port', 'frontserver.real.js');
  reactHotLoader.register(app, 'app', 'frontserver.real.js');
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();