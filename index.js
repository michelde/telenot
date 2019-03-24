const SocketHandler = require('./main/socketHandler');
const MqttHandler = require('./main/mqttHandler');
const Telenot = require('./main/telenot');
const logHandler = require('./util/logger');

let logger;

function init() {
  logger = logHandler.logger;
  logHandler.setLogLevelProd(logger);
}

function run() {
  const mqttHandler = new MqttHandler(logger);
  const telenot = new Telenot(logger, mqttHandler);
  const socketConnection = new SocketHandler(logger, telenot);
}

init();
run();
