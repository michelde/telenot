const mqtt = require('mqtt');
const config = require('./../config/config');

module.exports = class MqttHandler {
  constructor(logger) {
    this.logger = logger;
    this.logger.debug(`MQTT Host: ${config.Connection.mqttConfig.host}`);
    this.options = {
      username: config.Connection.mqttConfig.username || '',
      password: config.Connection.mqttConfig.password || '',
      keepalive: 60,
      clientId: 'telenotClient',
      connectTimeout: 30000,
    };
    this.mqttClient = mqtt.connect(config.Connection.mqttConfig.host, this.options);

    this.mqttClient.on('connect', () => {
      this.logger.info('MQTT Connected');
      // subscribe to topic for republish all states
      this.mqttClient.subscribe(config.Connection.mqttConfig.publishTopic, (err) => {
        if (!err) {
          // publish all current states
          // client.publish('presence', 'Hello mqtt')
        }
      });
    });
    return this;
  }
};
