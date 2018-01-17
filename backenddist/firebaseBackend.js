'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  apiKey: 'AIzaSyAU9rtPJJWLXR3nB0Az-xCjToOOq8mPfLg',
  authDomain: 'jaybo-setlister.firebaseapp.com',
  databaseURL: 'https://jaybo-setlister.firebaseio.com',
  projectId: 'jaybo-setlister',
  storageBucket: 'jaybo-setlister.appspot.com',
  messagingSenderId: '459478069088'
};

_firebase2.default.initializeApp(config);
exports.default = _firebase2.default;