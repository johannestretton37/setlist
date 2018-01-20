'use strict'
require('dotenv').config()
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SPOTIFY_CLIENT_ID: '"' + process.env.SPOTIFY_CLIENT_ID + '"',
  REDIRECT_URI_ENC: '"' + process.env.LOCAL_REDIRECT_URI_ENC + '"',
  REDIRECT_URI: '"' + process.env.LOCAL_REDIRECT_URI + '"'
})
