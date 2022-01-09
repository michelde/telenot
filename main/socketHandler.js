const net = require('net');
const config = require('./../config/config');

const SEND_NORM = '6802026840024216';
const SEND_NORM_REGEX = /^(.*)6802026840024216(.*?)/;
const REGEX_MELDEBEREICHE = /^(.*)6860606873025424000500020(.*?)16$/;
const REGEX_MELDEGRUPPEN = /^689393687302872400000001(.*?)16$/;
const REGEX_SICHERUNGSBEREICH = /^683c3c687302050200053(.*?)16$/;
const REGEX_SICHERUNGSBEREICH2 = /^682c2c687302050200053(.*?)16$/;
const SEND_16 = /(.*)16$/;
const CONF_ACK = Buffer.from([0x68, 0x02, 0x02, 0x68, 0x00, 0x02, 0x02, 0x16]);

const timeout = 15000;

module.exports = class SocketHandler {
  constructor(logger, telenot) {
    this.logger = logger;
    this.telenot = telenot;
    this.client = new net.Socket();

    this.makeConnection();

    return this;
  }

  makeConnection() {
    this.logger.debug('Makeconnection...');
    this.client.connect(
      config.Connection.telnetConfig.port,
      config.Connection.telnetConfig.host, () => {
        this.logger.info('Connected to TCP converter');
      },
    );
    // register client handler
    this.client.on('data', (data) => {
      this.handleData(data);
    });
    this.client.on('error', (error) => {
      this.handleError(error);
    });
    this.client.on('close', () => {
      this.client.removeAllListeners();
      this.handleClose();
    });
    this.client.setTimeout(timeout);
    this.client.on('timeout', () => {
        this.client.setTimeout(0);
        this.client.end();
    });
  }

  handleData(data) {
    let sendBack = null;
    this.client.setTimeout(0);
    // sthis.parseDataNew(data);
    sendBack = this.parseData(data.toString('hex'), data);
    if (sendBack !== null) {
      this.client.write(sendBack);
    }
    this.client.setTimeout(timeout);
  }

  handleError(error) {
    this.logger.info('Connection error');
    this.logger.error(error);
  }

  handleClose() {
    this.logger.info('Connection closed');
    this.client.destroy();
	setTimeout(this.makeConnection.bind(this), timeout);
  }

  parseData(hexStr, hex) {
    let sendBack = null;

    if (hexStr === SEND_NORM) {
      // this.logger.log('debug', 'Send CONF_ACK for SEND_NORM');
      sendBack = CONF_ACK;
    } else if (SEND_NORM_REGEX.test(hexStr)) {
      this.logger.log('debug', 'Send CONF_ACK for SEND_NORM_REGEX');
      sendBack = CONF_ACK;
    } else if (REGEX_MELDEBEREICHE.test(hexStr)) {
      // this.logger.log('debug', `Meldebereiche (${hexStr.length}) ${hexStr}`);
      this.telenot.decodeHex(hex, config.Telenot.MELDEBEREICHE.name);
      // this.telenot.decode(hexStr, config.Telenot.MELDEBEREICHE.name);
      sendBack = CONF_ACK;
    } else if (REGEX_MELDEGRUPPEN.test(hexStr)) {
      // this.logger.log('debug', `Meldegruppen ${hexStr}`);
      this.telenot.decodeHex(hex, config.Telenot.MELDEGRUPPEN.name);
      // this.telenot.decode(hexStr, config.Telenot.MELDEGRUPPEN.name);
      sendBack = CONF_ACK;
    } else if (REGEX_SICHERUNGSBEREICH.test(hexStr)) {
      this.logger.log('debug', `Sicherungsbereiche ${hexStr}`);
      this.telenot.decodeHex(hex, config.Telenot.SICHERUNGSBEREICH.name);
      sendBack = CONF_ACK;
    } else if (REGEX_SICHERUNGSBEREICH2.test(hexStr)) {
      this.logger.log('debug', `Sicherungsbereiche 2 ${hexStr}`);
      this.telenot.decodeHex(hex, config.Telenot.SICHERUNGSBEREICH2.name);
      sendBack = CONF_ACK;
    } else if (SEND_16.test(hexStr)) {
      this.logger.log('debug', `unknown string: ${hexStr}`);
      sendBack = CONF_ACK;
    } else {
      this.logger.log('debug', `unknown string: ${hexStr}`);
      sendBack = CONF_ACK;
    }
    return sendBack;
  }
};
