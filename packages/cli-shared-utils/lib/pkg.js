const fs = require('fs')
const path = require('path')
const readPkg = require('read-pkg')

exports.getCwd = function getCwd() {
  let cwd = process.cwd();
  if (process.env.APP_ROOT) {
    if (!path.isAbsolute(process.env.APP_ROOT)) {
      return path.join(cwd, process.env.APP_ROOT);
    }
    return process.env.APP_ROOT;
  }
  return cwd;
}

exports.resolvePkg = function (cwd = getCwd()) {
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    return readPkg.sync({ cwd: cwd });
  }
  return {};
}

