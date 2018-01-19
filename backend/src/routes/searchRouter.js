import axios from 'axios'
const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const SpotifyWebApi = require('spotify-web-api-node')
const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

let spotifyApi

function initSpotifyApi() {
  if (!spotifyApi) {
    spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri:
        process.env.NODE_ENV == 'development'
          ? process.env.LOCAL_REDIRECT_URI
          : process.env.REDIRECT_URI
    })
  }
  log('initSpotifyApi')
}

function initSpotifyApiSearch() {
  log('Init Spotify Search')
  initSpotifyApi()

  spotifyApi
    .clientCredentialsGrant()
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token'])
      log('Spotify Search inited successfully')
    })
    .catch(err => console.log(err))
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
router.route('/callback').get((req, res, next) => {
  // https://jaybo-setlister.herokuapp.com/?code=AQAY9Kiz7ApEShBN9Bmyxj4IfGrNArsXWKojVzF_cyr0ToZFxNLSxVwM3NEgFjHRxsi23z2SohSMMbcIIjVk09KZVpdeIdAF3jZ3ryoWJrXAH39cEo7xIxRaknOh9XqWz3w1RRDVvqQHgaBmxeTttzSjSDQsOhql1tOBIGt-SUxz1lVBi3ZPNeXhZVq_5aQqBsiB20Lh0ZZ7uokpgWzKpfEnblOkFDkF4CqSjnF5p_7lf7a59GMtFpAsDk3ZwV-x&state=thisisthestate
  const state = req.query.state
  const authorizationCode = req.query.code
  log(state)
  log(authorizationCode)

  /* Set the credentials given on Spotify's My Applications page.
   * https://developer.spotify.com/my-applications
   */
  initSpotifyApi()
  // First retrieve an access token
  spotifyApi
    .authorizationCodeGrant(authorizationCode)
    .then(function(data) {
      console.log('Retrieved access token', data.body['access_token'])

      // Set the access token
      spotifyApi.setAccessToken(data.body['access_token'])

      // Use the access token to retrieve information about the user connected to it
      return spotifyApi.getMe()
    })
    .then(function(data) {
      // "Retrieved data for Faruk Sahin"
      console.log('Retrieved data for ' + data.body['display_name'])
      console.log(data.body)
      const email = data.body.email
      // "Email is farukemresahin@gmail.com"
      // console.log('Email is ' + data.body.email)

      // // "Image URL is http://media.giphy.com/media/Aab07O5PYOmQ/giphy.gif"
      // console.log('Image URL is ' + data.body.images[0].url)

      // // "This user has a premium account"
      // console.log('This user has a ' + data.body.product + ' account')
      res.app.locals.email = email
      log(res.app.locals.email)
      log('redirecting to /')
      res.redirect('/')
    })
    .catch(function(err) {
      console.log('Something went wrong', err.message)
    })
})

router.route('/track/:searchString').get((req, res) => {
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

router.get(
  '/user',
  (req, res, next) => {
    if (req.app.isAuthenticated()) {
      next()
    } else {
      res.json({ status: 'NOT logged in' })
    }
  },
  (req, res) => {
    res.json({ status: 'logged in' })
  }
)

module.exports = router
