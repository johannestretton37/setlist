'use strict'
require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  SPOTIFY_CLIENT_ID: '"' + process.env.SPOTIFY_CLIENT_ID + '"',
  REDIRECT_URI_ENC: '"' + process.env.REDIRECT_URI_ENC + '"',
  REDIRECT_URI: '"' + process.env.REDIRECT_URI + '"'
}
