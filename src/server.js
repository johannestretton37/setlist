console.log('Init server')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mainRouter = require('./routes/mainRouter')
const apiRouter = require('./routes/apiRouter')
const path = require('path')
const chalk = require('chalk')
const log = function() {
  console.log(chalk.cyan('|'), ...arguments)
}

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
app.use('/static', express.static(path.resolve(__dirname, '../dist/static')))
// Api routes
app.use('/api', apiRouter)
// Main routes
app.use('/', mainRouter)

/**
 * Start Server
 */
app.listen(port, () =>
  console.log(
    chalk.cyan(' _______________________________\n|'),
    `Server listening on port ${port}`,
    chalk.cyan('|')
  )
)
