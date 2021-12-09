import { existsSync } from 'fs';
import { join } from 'path';
import { winPath } from '@oumi/cli-shared-utils';

type FileType = 'javascript' | 'css';

interface IGetFileOpts {
  base: string;
  type: FileType;
  fileNameWithoutExt: string;
}

const extsMap: Record<FileType, string[]> = {
  javascript: ['.ts', '.tsx', '.js', '.jsx'],
  css: ['.less', '.sass', '.scss', '.stylus', '.css']
};

/**
 * 尝试匹配指定目录的文件扩展名
 * @returns
 * - matched: `{ path: string; filename: string }`
 * - otherwise: `null`
 */
export default function getFile(opts: IGetFileOpts) {
  const exts = extsMap[opts.type];
  // eslint-disable-next-line no-restricted-syntax
  for (const ext of exts) {
    const filename = `${opts.fileNameWithoutExt}${ext}`;
    const path = winPath(join(opts.base, filename));
    if (existsSync(path)) {
      return {
        path,
        filename
      };
    }
  }
  return null;
}
