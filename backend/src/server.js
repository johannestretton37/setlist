require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8081
const mainRouter = require('./routes/mainRouter')
const apiRouter = require('./routes/apiRouter')
const searchRouter = require('./routes/searchRouter')
const path = require('path')
const chalk = require('chalk')
import firebase from './firebaseBackend'
import 'firebase/firestore'

const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}
console.log('init server')

// Init users
let users = {}
// Load users from database
const db = firebase.firestore()
db
  .collection('users')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      let user = doc.data()
      users[doc.id] = user
      log(`User ${doc.id} => ${user.first} ${user.last}`)
    })
  })

// db
//   .collection('users')
//   .add({
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815
//   })
//   .then(function(docRef) {
//     console.log('Document written with ID: ', docRef.id)
//   })
//   .catch(function(error) {
//     console.error('Error adding document: ', error)
//   })

/**
 * Log requests
 */
app.use((req, res, next) => {
  log(chalk.black.bgYellow(req.method), chalk.yellow(req.url))
  next()
})

/**
 * Setup routes
 */
// Static files
app.use('/static', express.static(path.resolve(__dirname, './dist/static')))
app.use('/assets', express.static(path.resolve(__dirname, './dist/static')))
// Api routes
app.use('/api', apiRouter)
// Search routes
app.use('/search', searchRouter)
// Main routes
app.use('/', mainRouter)

/**
 * Start Server
 */
app.listen(port, () =>
  console.log(
    chalk.cyan(' _______________________________\n|'),
    `API Server listening on port ${port}`,
    chalk.cyan('|')
  )
)
