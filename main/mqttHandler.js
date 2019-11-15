const mqtt = require('mqtt');
const config = require('./../config/config');

module.exports = class MqttHandler {
  constructor(logger) {
    this.logger = logger;
    this.logger.debug(`MQTT Host: ${config.Connection.mqttConfig.host}`);
    this.options = {
      username: config.Connection.mqttConfig.username || '',
      password: config.Connection.mqttConfig.password || '',
    };
    this.mqttClient = mqtt.connect(config.Connection.mqttConfig.host, this.options);

    this.mqttClient.on('connect', () => {
      this.logger.info('MQTT Connected');
    });
    return this;
  }
};
