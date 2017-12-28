const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const log = function() { console.log(chalk.cyan('|'), ...arguments) }

/**
 * '/api'
 */
router.get('/', (req, res) => {
  res.json({ response: 'api success' })
})

// Validate `user` parameter
router.param('user', (req, res, next, user) => {
  log('Validating', user)
  
  // Validate here
  // ...
  
  // Save validated user to request
  req.user = user.toUpperCase()
  next()
})

router.route('/auth/:user')
  .get((req, res) => {
    res.json({ response: `Please, authenticate yourself, ${req.user}` })
  })

module.exports = router