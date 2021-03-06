require('dotenv').config()
import express from 'express'
import mainRouter from './routes/mainRouter'
import apiRouter from './routes/apiRouter'
import searchRouter from './routes/searchRouter'
import firebase from 'firebase'
import path from 'path'
import chalk from 'chalk'

const port = process.env.PORT || 8081
const app = express()

const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

// // Init users
// let users = {}
// // Load users from database
// const db = firebase.firestore()
// db
//   .collection('users')
//   .get()
//   .then(querySnapshot => {
//     querySnapshot.forEach(doc => {
//       let user = doc.data()
//       users[doc.id] = user
//       log(`User ${doc.id} => ${user.first} ${user.last}`)
//     })
//   })

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

app.isAuthenticated = function() {
  if (app.locals.spotifyId) {
    log('isAuthenticated:', app.locals.spotifyId)
    app.locals.authenticated = true
    return true
  } else {
    log('isAuthenticated:', false)
    app.locals.authenticated = false
    return false
  }
}

// app.use((req, res, next) => {
//   app.isAuthenticated()
//   next()
// })

/**
 * Setup routes
 */
// Static files
app.use(
  '/static',
  express.static(path.resolve(__dirname, '../', 'dist', './static'))
)
app.use(
  '/assets',
  express.static(path.resolve(__dirname, '../', 'dist', './static'))
)
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
