const { chalk } = require('@oumi/cli-shared-utils');

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
