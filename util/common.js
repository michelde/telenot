'use strict'

module.exports = {
  reverseANumber: function (n) {
    n = n + ''
    return n.split('').reverse().join('')
  },

  mapBinaryValue: function (binary) {
    if (parseInt(binary) === 0) return 'ON'
    else return 'OFF'
  }
}
