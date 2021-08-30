const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const getRcPath = file => {
  return path.join(os.homedir(), file);
}

let folder;

if (process.env.OUMI_CLI_DEV) {
  folder = path.resolve(__dirname, '../../../.oumi');
} else {
  folder = getRcPath('.oumi-cli-ui');
}

fs.ensureDirSync(path.resolve(__dirname, folder))

exports.rcFolder = folder;
