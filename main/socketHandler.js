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

const TelenotMsgType = {
    SEND_NORM: 0,
    CONF_ACK: 1,
    MP: 2,
    SB: 3,
    SYS_EXT_ARMED: 4,
    SYS_INT_ARMED: 5,
    SYS_DISARMED: 6,
    ALARM: 7,
    INTRUSION: 8,
    BATTERY_MALFUNCTION: 9,
    POWER_OUTAGE: 10,
    OPTICAL_FLASHER_MALFUNCTION: 11,
    HORN_1_MALFUNCTION: 12,
    HORN_2_MALFUNCTION: 13,
    COM_FAULT: 14,
    RESTART: 15,
    USED_INPUTS: 16,
    USED_OUTPUTS: 17,
    USED_CONTACTS_INFO: 18,
    USED_OUTPUT_CONTACTS_INFO: 19,
    USED_SB_CONTACTS_INFO: 20,
    USED_MB_CONTACTS_INFO: 21,
    UNKNOWN: 22,
    INVALID: 23
}
const START_TO_MSG_TYPE = {
	    "682C2C687302050201001001": TelenotMsgType.INTRUSION,
			"681A1A687302050200001401": TelenotMsgType.BATTERY_MALFUNCTION,
			"681A1A687302050200001501": TelenotMsgType.POWER_OUTAGE,
			"681A1A687302050200001301": TelenotMsgType.OPTICAL_FLASHER_MALFUNCTION,
			"681A1A687302050200001101": TelenotMsgType.HORN_1_MALFUNCTION,
			"681A1A687302050200001201": TelenotMsgType.HORN_2_MALFUNCTION,
			"681A1A687302050200001701": TelenotMsgType.COM_FAULT
}

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

  getMsgType(hexStr) {
		let mt = null;

		if (hexStr.length < 4) {
			return TelenotMsgType.INVALID;
		}
		if (hexStr.length > 16) {
			mt = START_TO_MSG_TYPE[hexStr.substring(0,24)];
		}

    if (mt == null) {
      if (hexStr.match(/^6802026840024216(.*)/)) {
          mt = TelenotMsgType.SEND_NORM;
      }
      if (hexStr.match(/^6802026800020216(.*)/)) {
          mt = TelenotMsgType.CONF_ACK;
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w2400000001(.*)16$/)) {
          mt = TelenotMsgType.MP;
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w2400050002(.*)16$/)) {
          mt = TelenotMsgType.SB;
      }
      if (hexStr.match(/^682[C|c]2[C|c]6873020502\w\w\w\w\w\w01(22|[A|a]2)(.*)$/)) {
          mt = TelenotMsgType.ALARM;
      }
      if (hexStr.match(/^682[C|c]2[C|c]6873020502\w\w\w\w\w\w0161(.*)$/)) {
          mt = TelenotMsgType.SYS_EXT_ARMED;
      }
      if (hexStr.match(/^682[C|c]2[C|c]6873020502\w\w\w\w\w\w0162(.*)$/)) {
          mt = TelenotMsgType.SYS_INT_ARMED;
      }
      if (hexStr.match(/^682[C|c]2[C|c]6873020502\w\w\w\w\w\w01[E|e]1(.*)$/)) {
          mt = TelenotMsgType.SYS_DISARMED;
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w2400000071(.*)16$/)) {
          mt = TelenotMsgType.USED_INPUTS;
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w2400050072(.*)16$/)) {
          mt = TelenotMsgType.USED_OUTPUTS;
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w0[C|c](.*)16$/)) {
          let address = parseInt(hexStr.substring(18, 22), 16);
          if (address >= 0 && address <= 1279) {
              mt = TelenotMsgType.USED_CONTACTS_INFO;
          } else if (address >= 1280 && address <= 1327) {
              mt = TelenotMsgType.USED_OUTPUT_CONTACTS_INFO;
          } else if (address >= 1328 && address <= 1391) {
              mt = TelenotMsgType.USED_SB_CONTACTS_INFO;
          } else if (address >= 1392 && address <= 1519) {
              mt = TelenotMsgType.USED_MB_CONTACTS_INFO;
          }
      }
      if (hexStr.match(/^68\w\w\w\w687302\w\w\w\w\w\w([F|f]{4})0153(.*)16$/)) {
          mt = TelenotMsgType.RESTART;
      }
    }

    if (mt == null) {
      if (hexStr.match(/^6868(.*)16/)) {
          mt = TelenotMsgType.UNKNOWN;
      } else {
          mt = TelenotMsgType.INVALID;
      }
    }

    return mt;
  }

  parseData(hexStr, hex) {
    let sendBack = null;
    let msgtype = this.getMsgType(hexStr);

    this.logger.log('debug', 'got msgtype: ' + msgtype);

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
