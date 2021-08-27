'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.throttle =
  exports.resolveModuleRoot =
  exports.log =
  exports.parseArgs =
  exports.createId =
  exports.rcFolder =
    void 0;
const path_1 = __importDefault(require('path'));
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
var cli_shared_utils_2 = require('@oumi/cli-shared-utils');
Object.defineProperty(exports, 'rcFolder', {
  enumerable: true,
  get: function () {
    return cli_shared_utils_2.rcFolder;
  }
});
const createId = (max = 6, randomString = '0123456789abcdef') => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join('');
};
exports.createId = createId;
const parseArgs = (args) => {
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
exports.parseArgs = parseArgs;
const log = (...args) => {
  if (!process.env.OUMI_APP_CLI_UI_DEBUG) return;
  const date = new Date();
  const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}.${date.getSeconds().toString().padStart(2, '0')}`;
  const first = args.shift();
  console.log(
    `${cli_shared_utils_1.chalk.blue('UI')} ${cli_shared_utils_1.chalk.dim(timestamp)}`,
    cli_shared_utils_1.chalk.bold(first),
    ...args
  );
};
exports.log = log;
const resolveModuleRoot = (filePath, id = '') => {
  {
    const index = filePath.lastIndexOf(`${path_1.default.sep}index.js`);
    if (index !== -1) {
      filePath = filePath.substr(0, index);
    }
  }
  if (id && id !== null) {
    id = id.replace(/\//g, path_1.default.sep);
    let search = `node_modules/${id}`;
    let index = filePath.lastIndexOf(search);
    if (index === -1) {
      search = id;
      index = filePath.lastIndexOf(search);
    }
    if (index === -1) {
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
exports.resolveModuleRoot = resolveModuleRoot;
const throttle = (fun, wait = 60) => {
  let prevTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - prevTime > wait) {
      fun.apply(this, args);
      prevTime = now;
    }
  };
};
exports.throttle = throttle;
