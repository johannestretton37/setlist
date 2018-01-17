'use strict';

var _firebaseBackend = require('./firebaseBackend');

var _firebaseBackend2 = _interopRequireDefault(_firebaseBackend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
var express = require('express');
var app = express();
var port = process.env.PORT || 8081;
var mainRouter = require('./routes/mainRouter');
var apiRouter = require('./routes/apiRouter');
var searchRouter = require('./routes/searchRouter');
var path = require('path');
var chalk = require('chalk');


var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [chalk.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};
console.log('init server');
/**
 * Log requests
 */
app.use(function (req, res, next) {
  log(chalk.black.bgYellow(req.method), chalk.yellow(req.url));
  next();
});

/**
 * Setup routes
 */
// Static files
app.use('/static', express.static(path.resolve(__dirname, './dist/static')));
app.use('/assets', express.static(path.resolve(__dirname, './dist/static')));
// Api routes
app.use('/api', apiRouter);
// Search routes
app.use('/search', searchRouter);
// Main routes
app.use('/', mainRouter);

/**
 * Start Server
 */
app.listen(port, function () {
  return console.log(chalk.cyan(' _______________________________\n|'), 'API Server listening on port ' + port, chalk.cyan('|'));
});