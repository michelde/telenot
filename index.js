'use strict'
const SocketHandler = require('./main/socketHandler')
const HomieHandler = require('./main/homieHandler')
const Telenot = require('./main/telenot')
const logHandler = require('./util/logger')

var logger

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
