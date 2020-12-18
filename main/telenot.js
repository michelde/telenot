const utilFunc = require('../util/common');
const config = require('./../config/config');

module.exports = class Telenot {
  constructor(logger, mqttHandler) {
    this.logger = logger;
    this.mqttClient = mqttHandler.mqttClient;
    // this.binaryDiscoverPrevious = {};
    this.statesPrevious = {};
    this.mqttClient.subscribe(config.Connection.mqttConfig.publishTopic, (err) => {
      if (!err) {
        // ackowledge
      }
    });
    this.mqttClient.on('message', () => {
      // got message to send all states
      this.publish(config.Telenot.MELDEBEREICHE.name);
      this.publish(config.Telenot.MELDEGRUPPEN.name);
    });
    return this;
  }

  /**
   * Publish all current states
   * This is needed, e.g. when restarting Home Assistant to get the
   * stored values back.
   * @param {NewType} contentName
   */
  publish(contentName) {
    this.logger.debug(`Publish all states for ': ${contentName}`);
    // get saved values
    const byteMap = this.statesPrevious[contentName];
    byteMap.forEach((byteValue, byteIndex) => {
      const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
      for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
        const seachIndex = (byteIndex * 8) + bitIndex;
        const property = config.Telenot[contentName].positions.find(
          element => element.hex === seachIndex,
        );
        const bitValue = binaryStr.charAt(bitIndex);
        if (property !== undefined && property.name !== '') {
          if (this.mqttClient.connected) {
            this.mqttClient.publish(
              property.topic,
              utilFunc.mapBinaryValue(bitValue, property.inverted),
            );
            this.logger.verbose(`Publish state for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)} at position ${seachIndex}`);
          } else {
            this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
          }
        }
      }
    });
  }

  decodeHex(hex, contentName) {
    // get binary at hex position 0XA
    const parts = hex.slice(config.Telenot[contentName].offset, hex.length);
    // create position table
    const byteMap = new Map();
    parts.forEach((value, index) => {
      byteMap.set(index, value);
    });

    if (this.statesPrevious[contentName] === undefined) {
      this.statesPrevious[contentName] = byteMap;
      // publish initial states
      byteMap.forEach((byteValue, byteIndex) => {
        const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
        for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
          const seachIndex = (byteIndex * 8) + bitIndex;
          const property = config.Telenot[contentName].positions.find(
            element => element.hex === seachIndex,
          );
          const bitValue = binaryStr.charAt(bitIndex);
          if (property !== undefined && property.name !== '') {
            if (this.mqttClient.connected) {
              this.mqttClient.publish(
                property.topic,
                utilFunc.mapBinaryValue(bitValue, property.inverted),
              );
              this.logger.verbose(`Publish initial state for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)}`);
            } else {
              this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
            }
          }
        }
      });
    } else if (this.statesPrevious[contentName] !== byteMap) {
      // find difference
      byteMap.forEach((byteValue, byteIndex) => {
        const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
        const prevValue = this.statesPrevious[contentName].get(byteIndex);
        if (prevValue && prevValue !== byteValue) {
          const prevByte = utilFunc.reverseANumber(Number(prevValue).toString(2));
          for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
            const seachIndex = (byteIndex * 8) + bitIndex;
            // search for this entry in config file
            const property = config.Telenot[contentName].positions.find(
              element => element.hex === seachIndex,
            );
            const bitValue = binaryStr.charAt(bitIndex);
            // store bits
            const prevBit = prevByte[bitIndex];
            if (bitValue !== prevBit) {
              // if discover is turned on, send position
              if (process.env.DISCOVER === 'true') {
                if (property === undefined || property.name === '') {
                  this.logger.debug(`${contentName} - Byte:${byteIndex} Bit:${bitIndex} Position:${seachIndex}: Hex: 0x${Number(seachIndex).toString(16)} Old: ${prevBit} - New ${bitValue}`);
                } else {
                  this.logger.debug(`${contentName} (${property.name}) -  Byte:${byteIndex} Bit:${bitIndex} Position:${seachIndex}: Hex: 0x${Number(seachIndex).toString(16)} Old: ${prevBit} - New ${bitValue} - INVERTED: ${property.inverted}`);
                }
              // check if there is a property defined for this position
              } else if (property !== undefined && property.name !== '') {
                if (this.mqttClient.connected) {
                  this.mqttClient.publish(
                    property.topic,
                    utilFunc.mapBinaryValue(bitValue, property.inverted),
                  );
                  this.logger.verbose(`Publish change for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)}`);
                } else {
                  this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
                }
              }
            }
          }
        }
      });
      // save new state
      this.statesPrevious[contentName] = new Map(byteMap);
    }
  }
};
