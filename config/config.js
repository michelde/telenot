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
  Telenot: {
    Meldebereiche: [
      { key: 1, name: 'Fenster KG HWR', topic: 'openhab/alarm/mb/fenster_kg_hwr', value: null },
      { key: 2, name: 'Fenster KG Fitness', topic: 'openhab/alarm/mb/fenster_kg_fitness', value: null },
      { key: 3, name: 'Fenster KG Werkstatt', topic: 'openhab/alarm/mb/fenster_kg_werkstatt', value: null },
      { key: 4, name: 'Tuer KG Werkstatt', topic: 'openhab/alarm/mb/tuer_kg_werkstatt', value: null },
      { key: 5, name: 'Fenster KG Hobby', topic: 'openhab/alarm/mb/fenster_kg_hobby', value: null },
      { key: 6, name: 'Fenster EG Vorrat', topic: 'openhab/alarm/mb/fenster_eg_vorrat', value: null },
      { key: 7, name: 'Fenster EG Kueche', topic: 'openhab/alarm/mb/fenster_eg_kueche', value: null },
      { key: 8, name: 'Fenster EG Wohnzimmer', topic: 'openhab/alarm/mb/fenster_eg_wohnzimmer', value: null },
      { key: 9, name: 'Fenster EG Arbeiten', topic: 'openhab/alarm/mb/fenster_eg_arbeiten', value: null },
      { key: 10, name: 'Fenster EG WC', topic: 'openhab/alarm/mb/fenster_eg_wc', value: null },
      { key: 11, name: 'Tuer EG Flur', topic: 'openhab/alarm/mb/tuer_eg_flur', value: null },
      { key: 12, name: 'Glasbruch', topic: 'openhab/alarm/mb/glasbruch', value: null },
      { key: 13, name: 'Fenster DG Dach', topic: 'openhab/alarm/mb/fenster_dg_dach', value: null },
      { key: 14, name: 'Rauchmelder', topic: 'openhab/alarm/mb/brand', value: null },
      { key: 15, name: 'Bewegungsmelder', topic: 'openhab/alarm/mb/bewegungsmelder', value: null },
      { key: 16, name: 'Sabotage', topic: 'openhab/alarm/mb/sabotage', value: null },
      { key: 17, name: '', topic: '', value: null },
      { key: 18, name: '', topic: '', value: null },
      { key: 19, name: '', topic: '', value: null },
      { key: 20, name: '', topic: '', value: null },
      { key: 21, name: '', topic: '', value: null },
      { key: 22, name: '', topic: '', value: null },
      { key: 23, name: '', topic: '', value: null },
      { key: 24, name: '', topic: '', value: null }
    ],
    Meldegruppen: [
      { key: 1, name: 'Fenster KG HWR', topic: 'openhab/alarm/mg/fenster_kg_hwr', value: null },
      { key: 2, name: 'Fenster KG Fitness', topic: 'openhab/alarm/mg/fenster_kg_fitness', value: null },
      { key: 3, name: 'Fenster KG Werkstatt', topic: 'openhab/alarm/mg/fenster_kg_werkstatt', value: null },
      { key: 4, name: 'Tuer KG Werkstatt', topic: 'openhab/alarm/mg/tuer_kg_werkstatt', value: null },
      { key: 5, name: 'Fenster KG Hobby', topic: 'openhab/alarm/mg/fenster_kg_hobby', value: null },
      { key: 6, name: 'Fenster EG Vorrat', topic: 'openhab/alarm/mg/fenster_eg_vorrat', value: null },
      { key: 7, name: 'Fenster EG Kueche', topic: 'openhab/alarm/mg/fenster_eg_kueche', value: null },
      { key: 8, name: 'Glasbruch Wohnzimmer', topic: 'openhab/alarm/mg/glasbruch', value: null },
      { key: 9, name: 'Tuer EG Wohnzimmer', topic: 'openhab/alarm/mg/tuer_eg_wohnzimmer', value: null },
      { key: 10, name: 'Fenster EG WZ West', topic: 'openhab/alarm/mg/fenster_eg_wz_west', value: null },
      { key: 11, name: 'Fenster EG Arbeiten', topic: 'openhab/alarm/mg/fenster_eg_arbeiten', value: null },
      { key: 12, name: 'Fenster EG WC', topic: 'openhab/alarm/mg/fenster_eg_wc', value: null },
      { key: 13, name: 'Fenster EG WZ Ost', topic: 'openhab/alarm/mg/fenster_eg_wz_ost', value: null },
      { key: 14, name: 'Sabotage Türklingel', topic: 'openhab/alarm/mg/sabotage_tuerklingel', value: null },
      { key: 15, name: '', topic: '', value: null },
      { key: 16, name: '', topic: '', value: null }
    ]
  }
}

module.exports = config
