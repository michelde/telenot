'use strict'

var HomieDevice = require('../lib/homieDevice')
const config = require('../config/config')

module.exports = class MqttHandler {
  constructor (logger) {
    this.logger = logger

    // setup new Homie Device
    this.homieDevice = new HomieDevice(config.Homie)
    this.homeNodeMg = this.homieDevice.node('MG', 'Meldegruppe', 'Meldegruppe')
    this.homeNodeMb = this.homieDevice.node('MB', 'Meldebereich', 'Meldebereich')

    // add properties
    config.Telenot.Meldegruppen.forEach(function callback (currentValue, _index, array) {
      if (currentValue.name !== '') {
        this.homeNodeMg.advertise(currentValue.key, currentValue.name, 'boolean', null, null)
      }
    }, this)

    config.Telenot.Meldebereiche.forEach(function callback (currentValue, _index, array) {
      if (currentValue.name !== '') {
        this.homeNodeMb.advertise(currentValue.key, currentValue.name, 'boolean', null, null)
      }
    }, this)

    this.homieDevice.setup()

    return this
  }
}
