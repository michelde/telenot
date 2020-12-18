module.exports = {
  reverseANumber(n) {
    let result = n;
    result += '';
    return result.split('').reverse().join('');
  },

  mapBinaryValue(binary, inverted) {
    let compareValue = 1;
    if (inverted) compareValue = 0;

    // eslint-disable-next-line radix
    if (parseInt(binary) === compareValue) return 'ON';
    return 'OFF';
  },
};
