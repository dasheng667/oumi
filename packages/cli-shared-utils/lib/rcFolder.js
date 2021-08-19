const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const getRcPath = file => {
  return path.join(os.homedir(), file);
}

const folder = getRcPath('.oumi-cli-ui');

fs.ensureDirSync(path.resolve(__dirname, folder))

exports.rcFolder = folder;
