'use strict';

var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [chalk.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

/***** MOCKUP START *****/
var setList = {
  name: 'Setlist 1',
  songs: [{
    id: 'randomId1',
    title: 'Song nr 1',
    artist: 'Artist',
    duration: 193
  }, {
    id: 'randomId2',
    title: 'Song 2',
    artist: 'Blur',
    duration: 142
  }, {
    id: 'randomId3',
    title: 'Song nr 3',
    artist: 'Artdsdft',
    duration: 344
  }, {
    id: 'randomId4',
    title: 'Song 4',
    artist: 'sdfdf',
    duration: 31
  }, {
    id: 'randomId5',
    title: 'Song nr 5',
    artist: 'Artistdfsf',
    duration: 993
  }, {
    id: 'randomId6',
    title: 'Song 6',
    artist: 'gwrf',
    duration: 747
  }]
};

var setLists = [setList];
/****** MOCKUP END ******/

/**
 * '/api'
 */
router.route('/setlists').get(function (req, res) {
  res.json(setLists);
});

router.get('/', function (req, res) {
  res.json({ response: 'api success', data: 'main route: /' });
});

// Validate `user` parameter
router.param('user', function (req, res, next, user) {
  log('Validating', user);

  // Validate here
  // ...

  // Save validated user to request
  req.user = user.toUpperCase();
  next();
});

router.route('/auth/:user').get(function (req, res) {
  res.json({ response: 'Please, authenticate yourself, ' + req.user });
});

module.exports = router;