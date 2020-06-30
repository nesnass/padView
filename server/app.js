require('dotenv').config({ silent: process.env.NODE_ENV !== 'development' })

const express = require('express')
const path = require('path')

// Local includes
const apiRoutes = require('./api')

const app = express()
app.locals.pretty = true

// Send the whole build folder to the user or anyone connected to the server
app.use(express.static(path.join(__dirname, '../src/www')))
app.use(express.json())

if (process.env.NODE_ENV == 'production') {
  // Start a secure server
  app.set('trust proxy', 1) // trust first proxy

  // Redirect http calls to https
  app.use((req, res, next) => {
    if (!req.secure) {
      const redirect = `https://${req.headers.host}${req.url}`
      return res.redirect(redirect)
    }
    return next()
  })
}

app.use('/api', apiRoutes)

// Error handling
function logErrors(err, req, res, next) {
  console.error(err.stack)
  next(err)
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ err })
  } else {
    next(err)
  }
}

app.use(logErrors)
app.use(clientErrorHandler)

module.exports = app
