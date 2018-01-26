import express from 'express'
import firebase from 'firebase'
import chalk from 'chalk'
const router = express.Router()
import 'firebase/firestore'
const db = firebase.firestore()

const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

/****** firestore schema ******/
/**
 * |__ setlists [collection]
 *    |__ setList [doc]
 *       |__ songs [collection]
 *          |__ song [doc]
 *
 */

/**
 * '/api'
 */
router.route('/setlists').get(async (req, res) => {
  let setLists = await getSetLists(req.param.userId)
  res.json(setLists)
})

router.get('/', (req, res) => {
  res.json({ response: 'api success', data: 'main route: /' })
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

router.route('/auth/:user').get((req, res) => {
  res.json({ response: `Please, authenticate yourself, ${req.user}` })
})

module.exports = router
