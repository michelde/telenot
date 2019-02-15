module.exports = {
  reverseANumber(n) {
    n += '';
    return n.split('').reverse().join('');
  },

  mapBinaryValue(binary) {
    if (parseInt(binary) === 0) return 'ON';
    return 'OFF';
  },
};
