require('json5/lib/register')

// Load express module with `require` directive
var express = require('express')
var net = require('net')
var app = express()
var hexToBinary = require('hex-to-binary')
var mqtt = require('mqtt')
const winston = require('winston')
const config = require('./config/settings.json5')
let loglevel = config.Logging.level

// get log level from environment variable (fallback config file)
const logLevels = ["error", "warn", "info", "verbose", "debug", "silly"]
console.log(process.env.LOG_LEVEL)
if (process.env.LOG_LEVEL !== undefined && logLevels.includes(process.env.LOG_LEVEL)){
  loglevel = process.env.LOG_LEVEL
}

const logger = winston.createLogger({
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
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  const combinedLogs = logger.transports.find(transport => {
    return transport.filename === 'combined.log'
  });
  
  logger.remove(combinedLogs);

  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

var mqttConnected = null

var client = new net.Socket()
client.connect(config.Connection.telnetConfig.port, config.Connection.telnetConfig.host, function () {
  logger.info('Connected to TCP converter')
})

var MqttClient = mqtt.connect(config.Connection.mqttConfig.host)
MqttClient.on('connect', function () {
  logger.info('MQTT Connected')
  mqttConnected = true
})

var bytesReceived = 0

const SEND_NORM = '6802026840024216'
const SEND_NORM_REGEX = /^(.*)6802026840024216(.*?)/
const REGEX_MELDEBEREICHE = /^(.*)6846466873023a24000500020(.*?)16$/
const REGEX_MELDEGRUPPEN = /^683e3e6873023224(.*?)16$/
const SEND_16 = /(.*)16$/

const CONF_ACK = Buffer.from([0x68, 0x02, 0x02, 0x68, 0x0, 0x02, 0x02, 0x16])
let MELDEBEREICHE = config.Telenot.Meldebereiche
let MELGEGRUPPEN = config.Telenot.Meldegruppen

function parseData (hexStr) {
  if (hexStr === SEND_NORM) {
    logger.log('debug', 'Send CONF_ACK for SEND_NORM')
    client.write(CONF_ACK)
  } else if (SEND_NORM_REGEX.test(hexStr)) {
    logger.log('debug', 'Send CONF_ACK for SEND_NORM_REGEX')
    client.write(CONF_ACK)
  } else if (REGEX_MELDEBEREICHE.test(hexStr)) {  
    logger.log('debug', 'Meldebereiche ' + hexStr)
    decodeMeldebereiche(hexStr)
    client.write(CONF_ACK)
  } else if (REGEX_MELDEGRUPPEN.test(hexStr)) {
    logger.debug('Meldegruppen ' + hexStr)
    decodeMeldegruppen(hexStr)
    client.write(CONF_ACK)
  } else if (SEND_16.test(hexStr)) {
    logger.log('debug', 'Send CONF_ACK for $16')
    client.write(CONF_ACK)
  } else {
    logger.log('debug', 'unknown string:' + hexStr)
  }
}

function reverseANumber (n) {
  n = n + ''
  return n.split('').reverse().join('')
}

function decodeMeldegruppen (hexStr) {
  logger.debug('HEX ' + hexStr.substr(22, 8))
  var telenotHexStr = hexStr.substr(26, 2) + hexStr.substr(24, 2)
  var telenotBinary = reverseANumber(hexToBinary(telenotHexStr))
  logger.debug('Meldegruupe ' + telenotBinary)

  for (let index = 0; index < telenotBinary.length; index++) {
    const element = telenotBinary[index]
    if (MELGEGRUPPEN[index].value !== element && MELGEGRUPPEN[index].name !== '') {
      // save new values
      MELGEGRUPPEN[index].value = element
      if (mqttConnected) {
        MqttClient.publish(MELGEGRUPPEN[index].topic, mapBinaryValue(MELGEGRUPPEN[index].value))
        logger.verbose('Publish change for Meldegruppe: ' + MELGEGRUPPEN[index].name + ' value: ' + mapBinaryValue(MELGEGRUPPEN[index].value))
      }
    }
  }

  logger.debug('Meldegruppen' + telenotBinary)
}

function decodeMeldebereiche (hexStr) {
  var telenotHexStr = hexStr.substr(56, 2) + hexStr.substr(54, 2) + hexStr.substr(52, 2)
  var telenotBinary = reverseANumber(hexToBinary(telenotHexStr))
  logger.debug('Meldebereiche' + telenotBinary)

  for (let index = 0; index < telenotBinary.length; index++) {
    const element = telenotBinary[index]
    if (MELDEBEREICHE[index].value !== element && MELDEBEREICHE[index].name !== '') {
      // save new values
      MELDEBEREICHE[index].value = element
      if (mqttConnected) {
        MqttClient.publish(MELDEBEREICHE[index].topic, mapBinaryValue(MELDEBEREICHE[index].value))
        logger.verbose('Publish change for Meldebereich: ' + MELDEBEREICHE[index].name + ' value: ' + mapBinaryValue(MELDEBEREICHE[index].value))
      }
    }
  }
}

function mapBinaryValue (binary) {
  logger.debug('binary mapping for: ' + binary)
  if (parseInt(binary) === 0) return 'ON' 
  else return 'OFF'
}

/**
 * This method gets the data from the socket connection
 */
client.on('data', function (data) {
  bytesReceived += data.length
  logger.log('debug', 'Received bytes:' + data.length +' , total bytes received: ' + bytesReceived)
  parseData(data.toString('hex'))
})

client.on('error', function (error) {
  logger.error(error)
  client.destroy()
})

client.on('close', function () {
  logger.info('Connection closed')
})

// Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Launch listening server on port 8081
app.listen(8081, function () {
  logger.info('app listening on port 8081!')
}
)
