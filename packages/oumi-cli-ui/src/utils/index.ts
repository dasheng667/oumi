/* eslint-disable no-param-reassign */
import path from 'path';
import { chalk } from '@oumi/cli-shared-utils';

export { rcFolder } from '@oumi/cli-shared-utils';

export const getRootPath = () => {
  // 主要是解决tsc的build，会生成多个目录
  if (process.env.OUMI_CLI_DEV) {
    return path.join(__dirname, '../../');
  }
  return path.join(__dirname, '../../../');
};

/* eslint-disable no-restricted-syntax */
export const createId = (max = 6, randomString = '0123456789abcdef') => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join('');
};

export const parseArgs = (args: any) => {
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

export const log = (...args: any) => {
  const date = new Date();
  const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}.${date
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
  const first = args.shift();
  console.log(`${chalk.blue('UI')} ${chalk.dim(timestamp)}`, chalk.bold(first), ...args);
};

export const resolveModuleRoot = (filePath: string, id = '') => {
  {
    const index = filePath.lastIndexOf(`${path.sep}index.js`);
    if (index !== -1) {
      filePath = filePath.substr(0, index);
    }
  }
  if (id && id !== null) {
    // @ts-ignore
    id = id.replace(/\//g, path.sep);
    // With node_modules folder
    let search = `node_modules/${id}`;
    let index = filePath.lastIndexOf(search);
    if (index === -1) {
      // Id only
      // @ts-ignore
      search = id;
      index = filePath.lastIndexOf(search);
    }
    if (index === -1) {
      // Scoped (in dev env)
      // @ts-ignore
      index = id.lastIndexOf('/');
      if (index !== -1) {
        // @ts-ignore
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

export const throttle = (fun: any, wait = 60) => {
  let prevTime = 0;
  return function (...args: any) {
    const now = Date.now();
    if (now - prevTime > wait) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      fun.apply(this, args);
      prevTime = now;
    }
  };
};

export const dataTransform = (arr: any[]) => {
  if (Array.isArray(arr)) {
    const res = {};
    arr.forEach((item) => {
      if (item.name) {
        res[item.name] = item.value;
      }
    });
    return res;
  }
  return null;
};
