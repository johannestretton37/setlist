'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [chalk.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

// MAIN ROUTE '/'
router.route('/*').get(function (req, res) {
  log(req.path);
  log('spotifyId:', req.app.locals.spotifyId);
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

module.exports = router;