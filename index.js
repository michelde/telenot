'use strict'
const SocketHandler = require('./main/socketHandler')
const HomieHandler = require('./main/homieHandler')
const Telenot = require('./main/telenot')
const logHandler = require('./util/logger')
var express = require('express')

var app = express()
var logger

// Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Launch listening server on port 8081
app.listen(8081, function () {
  logger.info('app listening on port 8081!')
}
)

function init () {
  logger = logHandler.logger
  logHandler.setLogLevelProd(logger)
}

function run () {
  const homieMqtt = new HomieHandler(logger)
  const telenot = new Telenot(logger, homieMqtt)
  const socketConnection = new SocketHandler(logger, telenot)
}

init()
run()
