const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const SpotifyWebApi = require('spotify-web-api-node')
const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

log('Init Spotify Search')
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://jaybo-setlister.herokuapp.com/'
})

spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    console.log('success')
    spotifyApi.setAccessToken(data.body['access_token'])
    log('Spotify Search inited successfully')
  })
  .catch(err => console.log(err))
/**
 * '/search'
 */
router.route('/:searchString').get((req, res) => {
  const searchType = 'track'
  const searchString = `${searchType}:${req.params.searchString.trim()}`
  log('Will search for', searchString)
  // Perform track search
  spotifyApi.searchTracks(searchString, { limit: 1 }).then(
    function(data) {
      let tracks = data.body.tracks.items
      for (trackId in tracks) {
        const track = tracks[trackId]
        log(
          track.name,
          Math.round(parseInt(track.duration_ms, 10) / 1000),
          'seconds'
        )
      }
      log(tracks.length, 'tracks found')
    },
    function(err) {
      console.error(err)
    }
  )

  res.json({ query: `Query to search for:, ${req.params.searchString}` })
})

module.exports = router
