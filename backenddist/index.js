'use strict';

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _firebaseConfig = require('./firebaseConfig');

require('firebase/firestore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_firebase2.default.initializeApp(_firebaseConfig.config);

require('./server');