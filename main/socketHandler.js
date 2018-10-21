'use strict'

const net = require('net')
const config = require('./../config/config')

const SEND_NORM = '6802026840024216'
const SEND_NORM_REGEX = /^(.*)6802026840024216(.*?)/
const REGEX_MELDEBEREICHE = /^(.*)6846466873023a24000500020(.*?)16$/
const REGEX_MELDEGRUPPEN = /^683e3e6873023224(.*?)16$/
const SEND_16 = /(.*)16$/
const CONF_ACK = Buffer.from([0x68, 0x02, 0x02, 0x68, 0x0, 0x02, 0x02, 0x16])

module.exports = class SocketHandler {
  constructor (logger, telenot) {
    this.logger = logger
    this.telenot = telenot
    this.client = new net.Socket()

    this.client.connect(config.Connection.telnetConfig.port, config.Connection.telnetConfig.host, function () {
      this.logger.info('Connected to TCP converter')
    }.bind(this))
    // register client handler
    this.client.on('data', function (data) {
      this.handleData(data)
    }.bind(this))
    this.client.on('error', function (error) {
      this.handleError(error)
    }.bind(this))
    this.client.on('close', function () {
      this.handleClose()
    }.bind(this))
    return this
  }

  handleData (data) {
    // this.bytesReceived += data.length
    this.logger.log('debug', 'Received bytes:' + data.length)
    var sendBack = null
    sendBack = this.parseData(data.toString('hex'))
    if (sendBack !== null) {
      this.logger.log('debug', 'reply to socket:' + sendBack)
      this.client.write(sendBack)
    }
  }

  handleError (error) {
    this.logger.error(error)
    this.client.destroy()
  }

  handleClose () {
    this.logger.info('Connection closed')
  }

  parseData (hexStr) {
    var sendBack = null

    if (hexStr === SEND_NORM) {
      this.logger.log('debug', 'Send CONF_ACK for SEND_NORM')
      sendBack = CONF_ACK
    } else if (SEND_NORM_REGEX.test(hexStr)) {
      this.logger.log('debug', 'Send CONF_ACK for SEND_NORM_REGEX')
      sendBack = CONF_ACK
    } else if (REGEX_MELDEBEREICHE.test(hexStr)) {
      this.logger.log('debug', 'Meldebereiche ' + hexStr)
      this.telenot.decodeMeldebereiche(hexStr)
      sendBack = CONF_ACK
    } else if (REGEX_MELDEGRUPPEN.test(hexStr)) {
      this.logger.debug('Meldegruppen ' + hexStr)
      this.telenot.decodeMeldegruppen(hexStr)
      sendBack = CONF_ACK
    } else if (SEND_16.test(hexStr)) {
      this.logger.log('debug', 'Send CONF_ACK for $16')
      sendBack = CONF_ACK
    } else {
      this.logger.log('debug', 'unknown string:' + hexStr)
    }
    return sendBack
  }
}
