'use strict'
const config = require('./../config/config')
const winston = require('winston')

let loglevel = config.LogLevel

// get log level from environment variable (fallback config file)
const logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
if (!logLevels.includes(loglevel)) {
  loglevel = 'info'
}

module.exports = {
  logger: winston.createLogger({
    level: loglevel,
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  }),
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  setLogLevelProd: function (logger) {
    if (process.env.NODE_ENV !== 'production') {
      const combinedLogs = logger.transports.find(transport => {
        return transport.filename === 'combined.log'
      })

      logger.remove(combinedLogs)

      logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }))
    }
  }
}
