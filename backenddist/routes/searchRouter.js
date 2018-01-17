'use strict';

var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var SpotifyWebApi = require('spotify-web-api-node');
var log = function log() {
  var _console;

  (_console = console).log.apply(_console, [chalk.cyan('|')].concat(Array.prototype.slice.call(arguments)));
};

log('Init Spotify Search');
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://jaybo-setlister.herokuapp.com/'
});

spotifyApi.clientCredentialsGrant().then(function (data) {
  console.log('success');
  spotifyApi.setAccessToken(data.body['access_token']);
  log('Spotify Search inited successfully');
}).catch(function (err) {
  return console.log(err);
});
/**
 * '/search'
 */
router.route('/:searchString').get(function (req, res) {
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

module.exports = router;