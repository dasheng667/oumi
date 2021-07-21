import fs from 'fs-extra';
import { log } from './index';

/**
 * 创建文件
 * @param filePath
 * @param callback
 */
export const createFileSync = (filePath: string, callback?: (err, data) => void) => {
  fs.ensureFile(filePath, (err, data) => {
    if (typeof callback === 'function') {
      callback(err, data);
    }
  });
};

export function writeJSON(filePath: string, data, callback?: (err, data) => void) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, (err, data2) => {
    if (err) {
      log.red(`写入失败: ${filePath} `, err);
    } else {
      log.green(`写入成功: ${filePath}`);
    }
    if (typeof callback === 'function') {
      callback(err, data2);
    }
  });
}

export function writeTS(filePath: string, content: string) {
  fs.createFileSync(filePath);
  fs.writeFile(filePath, content, null, () => {});
}
