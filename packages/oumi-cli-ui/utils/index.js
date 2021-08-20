/* eslint-disable no-param-reassign */
const path = require('path');
const { chalk, rcFolder } = require('@oumi/cli-shared-utils');

/* eslint-disable no-restricted-syntax */
exports.createId = (max = 6, randomString = '0123456789abcdef') => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join('');
};

exports.parseArgs = (args) => {
  const parts = args.split(/\s+/);
  const result = [];
  let arg;
  let index = 0;
  for (const part of parts) {
    const l = part.length;
    if (!arg && part.charAt(0) === '"') {
      arg = part.substr(1);
    } else if (part.charAt(l - 1) === '"' && (l === 1 || part.charAt(l - 2) !== '\\')) {
      arg += args.charAt(index - 1) + part.substr(0, l - 1);
      result.push(arg);
      arg = null;
    } else if (arg) {
      arg += args.charAt(index - 1) + part;
    } else {
      result.push(part);
    }
    index += part.length + 1;
  }
  return result;
};

exports.log = (...args) => {
  if (!process.env.VUE_APP_CLI_UI_DEBUG) return;
  const date = new Date();
  const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}.${date.getSeconds().toString().padStart(2, '0')}`;
  const first = args.shift();
  console.log(`${chalk.blue('UI')} ${chalk.dim(timestamp)}`, chalk.bold(first), ...args);
};

exports.resolveModuleRoot = (filePath, id = null) => {
  {
    const index = filePath.lastIndexOf(`${path.sep}index.js`);
    if (index !== -1) {
      filePath = filePath.substr(0, index);
    }
  }
  if (id) {
    id = id.replace(/\//g, path.sep);
    // With node_modules folder
    let search = `node_modules/${id}`;
    let index = filePath.lastIndexOf(search);
    if (index === -1) {
      // Id only
      search = id;
      index = filePath.lastIndexOf(search);
    }
    if (index === -1) {
      // Scoped (in dev env)
      index = id.lastIndexOf('/');
      if (index !== -1) {
        search = id.substr(index + 1);
        index = filePath.lastIndexOf(search);
      }
    }

    if (index !== -1) {
      filePath = filePath.substr(0, index + search.length);
    }
  }
  return filePath;
};

exports.rcFolder = rcFolder;

exports.throttle = (fun, wait = 60) => {
  let prevTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - prevTime > wait) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      fun.apply(this, args);
      prevTime = now;
    }
  };
};
