module.exports = {
  reverseANumber(n) {
    n += '';
    return n.split('').reverse().join('');
  },

  mapBinaryValue(binary) {
    // eslint-disable-next-line radix
    if (parseInt(binary) === 0) return 'ON';
    return 'OFF';
  },
};
