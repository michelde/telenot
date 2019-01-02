const config = {
  LogLevel: process.env.LOG_LEVEL || 'info',
  Connection: {
    mqttConfig: {
      host: process.env.MQTTHOST,
      port: process.env.MQTTPORT
    },
    telnetConfig: {
      host: process.env.TELNETHOST,
      port: process.env.TELNETPORT
    }
  },
  Homie: {
    name: 'Telenot Device',
    device_id: 'telenot-device',
    mqtt: {
      host: process.env.MQTTHOST,
      port: process.env.MQTTPORT,
      base_topic: 'homie/',
      auth: false
    }
  },
  Telenot: {
    Meldebereiche: [
      { key: 1, name: 'Fenster KG HWR', value: null },
      { key: 2, name: 'Fenster KG Fitness', value: null },
      { key: 3, name: 'Fenster KG Werkstatt', value: null },
      { key: 4, name: 'Tuer KG Werkstatt', value: null },
      { key: 5, name: 'Fenster KG Hobby', value: null },
      { key: 6, name: 'Fenster EG Vorrat', value: null },
      { key: 7, name: 'Fenster EG Kueche', value: null },
      { key: 8, name: 'Fenster EG Wohnzimmer', value: null },
      { key: 9, name: 'Fenster EG Arbeiten', value: null },
      { key: 10, name: 'Fenster EG WC', value: null },
      { key: 11, name: 'Tuer EG Flur', value: null },
      { key: 12, name: 'Glasbruch', value: null },
      { key: 13, name: 'Fenster DG Dach', value: null },
      { key: 14, name: 'Rauchmelder', value: null },
      { key: 15, name: 'Bewegungsmelder', value: null },
      { key: 16, name: 'Sabotage', value: null },
      { key: 17, name: '', value: null },
      { key: 18, name: '', value: null },
      { key: 19, name: '', value: null },
      { key: 20, name: '', value: null },
      { key: 21, name: '', value: null },
      { key: 22, name: '', value: null },
      { key: 23, name: '', value: null },
      { key: 24, name: '', value: null }
    ],
    Meldegruppen: [
      { key: 1, name: 'Fenster KG HWR', value: null },
      { key: 2, name: 'Fenster KG Fitness', value: null },
      { key: 3, name: 'Fenster KG Werkstatt', value: null },
      { key: 4, name: 'Tuer KG Werkstatt', value: null },
      { key: 5, name: 'Fenster KG Hobby', value: null },
      { key: 6, name: 'Fenster EG Vorrat', value: null },
      { key: 7, name: 'Fenster EG Kueche', value: null },
      { key: 8, name: 'Glasbruch Wohnzimmer', value: null },
      { key: 9, name: 'Tuer EG Wohnzimmer', value: null },
      { key: 10, name: 'Fenster EG WZ West', value: null },
      { key: 11, name: 'Fenster EG Arbeiten', value: null },
      { key: 12, name: 'Fenster EG WC', value: null },
      { key: 13, name: 'Fenster EG WZ Ost', value: null },
      { key: 14, name: 'Sabotage Türklingel', value: null },
      { key: 15, name: '', value: null },
      { key: 16, name: '', value: null }
    ]
  }
}

module.exports = config
