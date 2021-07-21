import fs from 'fs-extra';
import { log } from '../src/utils/index';

export function writeFile(filePath: string, data) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, () => {});
}

export function writeTS(filePath: string, content: string) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, content, null, () => {});
}

export function writeJSON(filePath: string, data, callback?: (err, data) => void) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, (err, data) => {
    if (err) {
      log.red(`写入失败: ${filePath} `, err);
    } else {
      log.green(`写入成功: ${filePath}`);
    }
    if (typeof callback === 'function') {
      callback(err, data);
    }
  });
}
