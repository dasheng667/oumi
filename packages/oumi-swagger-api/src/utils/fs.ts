import path from 'path';
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

export function writeFile(filePath: string, content: string, options?: { allowRepeat: boolean }) {
  const { allowRepeat = true } = options || {};
  // 不允许文件重复
  if (!allowRepeat && fs.existsSync(filePath)) {
    // eslint-disable-next-line no-inner-declarations
    function testFile(filePath1: string, count: number) {
      const basename = path.basename(filePath1);
      const [name, ext] = basename.split('.');
      const newname = `${name}_${count}.${ext}`;
      const newPath = filePath1.replace(basename, newname);

      if (!fs.existsSync(newPath)) {
        fs.createFileSync(filePath);
        fs.writeFile(newPath, content, null, () => {});
        log.green(`writeFile: ${newPath}`);
      } else {
        testFile(filePath1, count + 1);
      }
    }
    testFile(filePath, 1);
  } else {
    fs.createFileSync(filePath);
    fs.writeFile(filePath, content, null, () => {});
    log.green(`writeFile: ${filePath}`);
  }
}
