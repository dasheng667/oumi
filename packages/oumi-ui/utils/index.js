module.exports = {
  createId(max = 6, randomString = '0123456789abcdef') {
    const s = [];
    const hexDigits = randomString || '0123456789abcdef';
    for (let i = 0; i < max; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    return s.join('');
  }
};
