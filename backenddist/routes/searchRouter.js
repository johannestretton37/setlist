'use strict';

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var SpotifyWebApi = require('spotify-web-api-node');
var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [chalk.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

var spotifyApi = void 0;

function initSpotifyApi() {
  if (!spotifyApi) {
    spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.NODE_ENV == 'development' ? process.env.LOCAL_REDIRECT_URI : process.env.REDIRECT_URI
    });
  }
  log('initSpotifyApi');
}

function initSpotifyApiSearch() {
  log('Init Spotify Search');
  initSpotifyApi();

  spotifyApi.clientCredentialsGrant().then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    log('Spotify Search inited successfully');
  }).catch(function (err) {
    return console.log(err);
  });
}

// spotifyApi.getMe().then(
//   function(data) {
//     console.log('Some information about the authenticated user', data.body)
//   },
//   function(err) {
//     console.log('Something went wrong!', err)
//   }
// )

/**
 * '/search'
 */
// Spotify login
router.route('/callback').get(function (req, res, next) {
  // https://jaybo-setlister.herokuapp.com/?code=AQAY9Kiz7ApEShBN9Bmyxj4IfGrNArsXWKojVzF_cyr0ToZFxNLSxVwM3NEgFjHRxsi23z2SohSMMbcIIjVk09KZVpdeIdAF3jZ3ryoWJrXAH39cEo7xIxRaknOh9XqWz3w1RRDVvqQHgaBmxeTttzSjSDQsOhql1tOBIGt-SUxz1lVBi3ZPNeXhZVq_5aQqBsiB20Lh0ZZ7uokpgWzKpfEnblOkFDkF4CqSjnF5p_7lf7a59GMtFpAsDk3ZwV-x&state=thisisthestate
  var state = req.query.state;
  var authorizationCode = req.query.code;
  log(state);
  log(authorizationCode);

  /* Set the credentials given on Spotify's My Applications page.
   * https://developer.spotify.com/my-applications
   */
  initSpotifyApi();
  // First retrieve an access token
  spotifyApi.authorizationCodeGrant(authorizationCode).then(function (data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.getMe();
  }).then(function (data) {
    // "Retrieved data for Faruk Sahin"
    console.log('Retrieved data for ' + data.body['display_name']);
    console.log(data.body);
    var email = data.body.email;
    // "Email is farukemresahin@gmail.com"
    // console.log('Email is ' + data.body.email)

    // // "Image URL is http://media.giphy.com/media/Aab07O5PYOmQ/giphy.gif"
    // console.log('Image URL is ' + data.body.images[0].url)

    // // "This user has a premium account"
    // console.log('This user has a ' + data.body.product + ' account')
    res.app.locals.email = email;
    log(res.app.locals.email);
    log('redirecting to /');
    res.redirect('/');
  }).catch(function (err) {
    console.log('Something went wrong', err.message);
  });
});

router.route('/track/:searchString').get(function (req, res) {
  var searchType = 'track';
  var searchString = searchType + ':' + req.params.searchString.trim();
  log('Will search for', searchString);
  // Perform track search
  spotifyApi.searchTracks(searchString, { limit: 1 }).then(function (data) {
    var tracks = data.body.tracks.items;
    for (trackId in tracks) {
      var track = tracks[trackId];
      log(track.name, Math.round(parseInt(track.duration_ms, 10) / 1000), 'seconds');
    }
    log(tracks.length, 'tracks found');
  }, function (err) {
    console.error(err);
  });

  res.json({ query: 'Query to search for:, ' + req.params.searchString });
});

router.get('/user', function (req, res, next) {
  if (req.app.isAuthenticated()) {
    next();
  } else {
    res.json({ status: 'NOT logged in' });
  }
}, function (req, res) {
  res.json({ status: 'logged in' });
});

module.exports = router;