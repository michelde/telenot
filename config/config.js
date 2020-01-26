/* eslint-disable object-curly-newline */
const config = {
  LogLevel: process.env.LOG_LEVEL || 'info',
  Connection: {
    mqttConfig: {
      host: process.env.MQTTHOST,
      port: process.env.MQTTPORT,
      username: process.env.MQTTUSER,
      password: process.env.MQTTPASSWORD,
    },
    telnetConfig: {
      host: process.env.TELNETHOST,
      port: process.env.TELNETPORT,
    },
  },
  Telenot: {
    MELDEBEREICHE: {
      name: 'MELDEBEREICHE',
      positions: [
        { position: 586, name: 'Fenster Bad Eltern', topic: 'openhab/alarm/mb/fenster_bad_eltern', inverted: true },
        { position: 588, name: 'Fenster Isabel', topic: 'openhab/alarm/mb/fenster_isabel', inverted: true },
        { position: 592, name: 'Fenster EG Arbeiten', topic: 'openhab/alarm/mb/fenster_eg_arbeiten', inverted: true },
        { position: 593, name: 'Fenster EG WC', topic: 'openhab/alarm/mb/fenster_eg_wc', inverted: true },
        { position: 594, name: 'Tuer EG Flur', topic: 'openhab/alarm/mb/tuer_eg_flur', inverted: true },
        { position: 595, name: 'Glasbruch', topic: 'openhab/alarm/mb/glasbruch', inverted: false },
        { position: 596, name: 'Fenster DG Dach', topic: 'openhab/alarm/mb/fenster_dg_dach', inverted: true },
        { position: 597, name: 'Rauchmelder', topic: 'openhab/alarm/mb/brand', inverted: false },
        { position: 598, name: 'Bewegungsmelder', topic: 'openhab/alarm/mb/bewegungsmelder', inverted: true },
        { position: 599, name: 'Sabotage', topic: 'openhab/alarm/mb/sabotage', inverted: false },
        { position: 600, name: 'Fenster KG HWR', topic: 'openhab/alarm/mb/fenster_kg_hwr', inverted: true },
        { position: 601, name: 'Fenster KG Fitness', topic: 'openhab/alarm/mb/fenster_kg_fitness', inverted: true },
        { position: 602, name: 'Fenster KG Werkstatt', topic: 'openhab/alarm/mb/fenster_kg_werkstatt', inverted: true },
        { position: 603, name: 'Tuer KG Werkstatt', topic: 'openhab/alarm/mb/tuer_kg_werkstatt', inverted: true },
        { position: 604, name: 'Fenster KG Hobby', topic: 'openhab/alarm/mb/fenster_kg_hobby', inverted: true },
        { position: 605, name: 'Fenster EG Vorrat', topic: 'openhab/alarm/mb/fenster_eg_vorrat', inverted: true },
        { position: 606, name: 'Fenster EG Kueche', topic: 'openhab/alarm/mb/fenster_eg_kueche', inverted: true },
        { position: 607, name: 'Fenster EG Wohnzimmer', topic: 'openhab/alarm/mb/fenster_eg_wohnzimmer', inverted: true },
        { position: 665, name: 'Intern scharf', topic: 'openhab/alarm/mb/intern_scharf', inverted: true },
        { position: 666, name: 'Extern scharf', topic: 'openhab/alarm/mb/extern_scharf', inverted: true },
        { position: 669, name: 'Intern Bereit', topic: 'openhab/alarm/mb/intern_bereit', inverted: true },
        { position: 670, name: 'Extern Bereit', topic: 'openhab/alarm/mb/extern_bereit', inverted: true },
      ],
    },
    MELDEGRUPPEN: {
      name: 'MELDEGRUPPEN',
      positions: [
        { position: 752, name: 'Fenster Bad Eltern', topic: 'openhab/alarm/mg/fenster_bad_eltern', inverted: true },
        { position: 753, name: 'Fenster Isabel', topic: 'openhab/alarm/mg/fenster_isabel', inverted: true },
        { position: 1112, name: 'Tuer EG Wohnzimmer', topic: 'openhab/alarm/mg/tuer_eg_wohnzimmer', inverted: true },
        { position: 1113, name: 'Fenster EG WZ West', topic: 'openhab/alarm/mg/fenster_eg_wz_west', inverted: true },
        { position: 1114, name: 'Fenster EG Arbeiten', topic: 'openhab/alarm/mg/fenster_eg_arbeiten', inverted: true },
        { position: 1116, name: 'Fenster EG WZ Ost', topic: 'openhab/alarm/mg/fenster_eg_wz_ost', inverted: true },
      ],
    },
  },
};

module.exports = config;
