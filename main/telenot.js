const hexToBinary = require('hex-to-binary');
const utilFunc = require('../util/common');
const config = require('./../config/config');

// const MELDEBEREICHE = config.Telenot.Meldebereiche;
// const MELGEGRUPPEN = config.Telenot.Meldegruppen;

module.exports = class Telenot {
  constructor(logger, mqttHandler) {
    this.logger = logger;
    this.mqttClient = mqttHandler.mqttClient;
    this.binaryDiscoverPrevious = {};
    return this;
  }

  decode(hexStr, contentName) {
    const binaryStr = utilFunc.reverseANumber(hexToBinary(hexStr));
    // compare with previous
    if (this.binaryDiscoverPrevious[contentName] === undefined) {
      this.binaryDiscoverPrevious[contentName] = binaryStr;
    } else if (this.binaryDiscoverPrevious[contentName] !== binaryStr) {
      // find difference
      for (let i = 0; i < binaryStr.length; i += 1) {
        if (binaryStr.substr(i, 1) !== this.binaryDiscoverPrevious[contentName].substr(i, 1)) {
          const property = config.Telenot[contentName].positions.find(element => element.position === i);
          // if discover is turned on, send position
          if (process.env.DISCOVER === 'true') {
            this.logger.debug(`${contentName} - Position ${i} (${binaryStr.length - i}): Old:  ${this.binaryDiscoverPrevious[contentName].substr(i, 1)} - New ${binaryStr.substr(i, 1)}`);
          // check if there is a property defined for this position
          } else if (property !== undefined && property.name !== '') {
            if (this.mqttClient.connected) {
              this.mqttClient.publish(property.topic, utilFunc.mapBinaryValue(binaryStr.substr(i, 1), property.inverted));
              this.logger.verbose(`Publish change for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(binaryStr.substr(i, 1))} at position ${i}`);
            } else {
              this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
            }
          }
        }
      }
      // save new state
      this.binaryDiscoverPrevious[contentName] = binaryStr;
    }
  }
};
