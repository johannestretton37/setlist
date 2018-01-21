'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mainRouter = require('./routes/mainRouter');

var _mainRouter2 = _interopRequireDefault(_mainRouter);

var _apiRouter = require('./routes/apiRouter');

var _apiRouter2 = _interopRequireDefault(_apiRouter);

var _searchRouter = require('./routes/searchRouter');

var _searchRouter2 = _interopRequireDefault(_searchRouter);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();


var port = process.env.PORT || 8081;
var app = (0, _express2.default)();

var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [_chalk2.default.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

// // Init users
// let users = {}
// // Load users from database
// const db = firebase.firestore()
// db
//   .collection('users')
//   .get()
//   .then(querySnapshot => {
//     querySnapshot.forEach(doc => {
//       let user = doc.data()
//       users[doc.id] = user
//       log(`User ${doc.id} => ${user.first} ${user.last}`)
//     })
//   })

// db
//   .collection('users')
//   .add({
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815
//   })
//   .then(function(docRef) {
//     console.log('Document written with ID: ', docRef.id)
//   })
//   .catch(function(error) {
//     console.error('Error adding document: ', error)
//   })

/**
 * Log requests
 */
app.use(function (req, res, next) {
  log(_chalk2.default.black.bgYellow(req.method), _chalk2.default.yellow(req.url));
  next();
});

app.isAuthenticated = function () {
  if (app.locals.spotifyId) {
    log('isAuthenticated:', app.locals.spotifyId);
    app.locals.authenticated = true;
    return true;
  } else {
    log('isAuthenticated:', false);
    app.locals.authenticated = false;
    return false;
  }
};

// app.use((req, res, next) => {
//   app.isAuthenticated()
//   next()
// })

/**
 * Setup routes
 */
// Static files
app.use('/static', _express2.default.static(_path2.default.resolve(__dirname, '../', 'dist', './static')));
app.use('/assets', _express2.default.static(_path2.default.resolve(__dirname, '../', 'dist', './static')));
// Api routes
app.use('/api', _apiRouter2.default);
// Search routes
app.use('/search', _searchRouter2.default);
// Main routes
app.use('/', _mainRouter2.default);

/**
 * Start Server
 */
app.listen(port, function () {
  return console.log(_chalk2.default.cyan(' _______________________________\n|'), 'API Server listening on port ' + port, _chalk2.default.cyan('|'));
});