module.exports = {
  reverseANumber(n) {
    let result = n;
    result += '';
    return result.split('').reverse().join('');
  },

  mapBinaryValue(binary, inverted) {
    let compareValue = 0;
    if (inverted) compareValue = 1;

    // eslint-disable-next-line radix
    if (parseInt(binary) === compareValue) return 'ON';
    return 'OFF';
  },
};
