
exports.winPath = function getCwd(pathStr) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(pathStr);
  if (isExtendedLengthPath) {
    return pathStr;
  }

  return pathStr.replace(/\\/g, '/');
}
