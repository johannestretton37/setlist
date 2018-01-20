'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebaseBackend = require('../firebaseBackend');

var _firebaseBackend2 = _interopRequireDefault(_firebaseBackend);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

require('firebase/firestore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var db = _firebaseBackend2.default.firestore();

var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [_chalk2.default.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

/***** MOCKUP START *****/
/*
let setList = {
  name: 'Setlist 1',
  songs: [
    {
      id: 'randomId1',
      title: 'Song nr 1',
      artist: 'Artist',
      duration: 193
    },
    {
      id: 'randomId2',
      title: 'Song 2',
      artist: 'Blur',
      duration: 142
    },
    {
      id: 'randomId3',
      title: 'Song nr 3',
      artist: 'Artdsdft',
      duration: 344
    },
    {
      id: 'randomId4',
      title: 'Song 4',
      artist: 'sdfdf',
      duration: 31
    },
    {
      id: 'randomId5',
      title: 'Song nr 5',
      artist: 'Artistdfsf',
      duration: 993
    },
    {
      id: 'randomId6',
      title: 'Song 6',
      artist: 'gwrf',
      duration: 747
    }
  ]
}

let setLists = [setList]
*/
/****** MOCKUP END ******/

/****** firebase cloud start ******/
/**
 * |__ setlists [collection]
 *    |__ setList [doc]
 *       |__ songs [collection]
 *          |__ song [doc]
 *
 */
var setListsRef = db.collection('setlists');
var setListRef = setListsRef.doc('FRxLwlVoLkKmBzXUrgGC');
var createSetList = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(setList) {
    var setListDoc;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return setListsRef.add(setList);

          case 2:
            setListDoc = _context.sent;

            setListRef = setListDoc;
            log('created with id:', setListDoc.id);
            log('created with ref:', setListDoc.ref);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createSetList(_x) {
    return _ref.apply(this, arguments);
  };
}();

var addSong = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(song) {
    var songDoc;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return setListRef.collection('songs').add(song);

          case 2:
            songDoc = _context2.sent;

            log('song added with id:', songDoc.id);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function addSong(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getSetLists = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(userId) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', new _promise2.default(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                var snapshot, setLists, promises;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return setListsRef.where('users.' + userId, '==', true).get();

                      case 2:
                        snapshot = _context3.sent;

                        if (!snapshot) {
                          _context3.next = 12;
                          break;
                        }

                        setLists = [];
                        promises = [];

                        snapshot.forEach(function (setListDoc) {
                          var setList = (0, _extends3.default)({
                            id: setListDoc.id
                          }, setListDoc.data(), {
                            songs: []
                          });
                          setLists.push(setList);
                          promises.push(setListDoc.ref.collection('songs').get().then(function (songs) {
                            songs.forEach(function (song) {
                              setList.songs.push((0, _extends3.default)({
                                id: song.id
                              }, song.data()));
                            });
                          }));
                        });
                        _context3.next = 9;
                        return _promise2.default.all(promises);

                      case 9:
                        resolve(setLists);
                        _context3.next = 13;
                        break;

                      case 12:
                        log('There are no setlists yet');

                      case 13:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x4, _x5) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function getSetLists(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var exampleSetList = {
  title: 'Kraken 2017',
  subtitle: 'KSM3',
  users: {
    johannes: true
  }
};
var exampleSong = {
  title: 'Smaragds',
  artist: 'King',
  duration: 562
  // createSetList(exampleSetList)
  // addSong(exampleSong)
};var userId = 'johannes';

/**
 * '/api'
 */
router.route('/setlists').get(function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var setLists;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getSetLists(userId);

          case 2:
            setLists = _context5.sent;

            res.json(setLists);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());

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