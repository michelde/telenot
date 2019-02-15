module.exports = {
  reverseANumber(n) {
    let result = n;
    result += '';
    return result.split('').reverse().join('');
  },

  mapBinaryValue(binary) {
    // eslint-disable-next-line radix
    if (parseInt(binary) === 0) return 'ON';
    return 'OFF';
  },
};
