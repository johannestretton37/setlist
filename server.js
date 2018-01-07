require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8081
const mainRouter = require('./src/routes/mainRouter')
const apiRouter = require('./src/routes/apiRouter')
const searchRouter = require('./src/routes/searchRouter')
const path = require('path')
const chalk = require('chalk')
const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}
console.log('init server')
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
