const HomieDevice = require('../lib/homieDevice');
const config = require('../config/config');

module.exports = class MqttHandler {
  constructor(logger) {
    this.logger = logger;

    // setup new Homie Device
    this.homieDevice = new HomieDevice(config.Homie);
    this.homeNodeMg = this.homieDevice.node('MG', 'Meldegruppe', 'Meldegruppe');
    this.homeNodeMb = this.homieDevice.node('MB', 'Meldebereich', 'Meldebereich');

    // add properties
    config.Telenot.Meldegruppen.forEach((currentValue) => {
      if (currentValue.name !== '') {
        this.homeNodeMg.advertise(currentValue.key, currentValue.name, 'boolean', null, null);
      }
    }, this);

    config.Telenot.Meldebereiche.forEach((currentValue) => {
      if (currentValue.name !== '') {
        this.homeNodeMb.advertise(currentValue.key, currentValue.name, 'boolean', null, null);
      }
    });

    this.homieDevice.setup();

    return this;
  }
};
