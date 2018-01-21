'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

require('firebase/firestore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var db = _firebase2.default.firestore();

var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [_chalk2.default.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

/****** firebase cloud start ******/
/**
 * |__ setlists [collection]
 *    |__ setList [doc]
 *       |__ songs [collection]
 *          |__ song [doc]
 *
 */
// let setListsRef = db.collection('setlists')
// let setListRef = setListsRef.doc('FRxLwlVoLkKmBzXUrgGC')
// const createSetList = async setList => {
//   const setListDoc = await setListsRef.add(setList)
//   setListRef = setListDoc
//   log('created with id:', setListDoc.id)
//   log('created with ref:', setListDoc.ref)
// }

// const addSong = async song => {
//   const songDoc = await setListRef.collection('songs').add(song)
//   log('song added with id:', songDoc.id)
// }

// const getSetLists = async userId => {
//   return new Promise(async (resolve, reject) => {
//     let snapshot = await setListsRef.where(`users.${userId}`, '==', true).get()
//     if (snapshot) {
//       let setLists = []
//       let promises = []
//       snapshot.forEach(setListDoc => {
//         let setList = {
//           id: setListDoc.id,
//           ...setListDoc.data(),
//           songs: []
//         }
//         setLists.push(setList)
//         promises.push(
//           setListDoc.ref
//             .collection('songs')
//             .get()
//             .then(songs => {
//               songs.forEach(song => {
//                 setList.songs.push({
//                   id: song.id,
//                   ...song.data()
//                 })
//               })
//             })
//         )
//       })
//       await Promise.all(promises)
//       resolve(setLists)
//     } else {
//       log('There are no setlists yet')
//     }
//   })
// }

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
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var setLists;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getSetLists(userId);

          case 2:
            setLists = _context.sent;

            res.json(setLists);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
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