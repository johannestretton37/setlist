const path = require('path')
const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

// MAIN ROUTE '/'
router.route('/').get((req, res) => {
  log('locals:', req.app.locals.email)
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'))
})

module.exports = router
