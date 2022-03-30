import { lodash, winPath } from '@oumi/cli-shared-utils';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

export type IServicePathKeys = 'appPath' | 'absNodeModulesPath' | 'absOutputPath' | 'absSrcPath' | 'absPagesPath' | 'absTmpPath';

type IServicePaths = {
  [key in IServicePathKeys]: string;
};

function isDirectoryAndExist(path: string) {
  return existsSync(path) && statSync(path).isDirectory();
}

function normalizeWithWinPath<T extends Record<any, string>>(obj: T) {
  return lodash.mapValues(obj, (value) => winPath(value));
}

export default function getServicePaths({ appPath, config, env }: { appPath: string; config: any; env?: string }): IServicePaths {
  let absSrcPath = appPath;
  if (isDirectoryAndExist(join(appPath, 'src'))) {
    absSrcPath = join(appPath, 'src');
  }
  const absPagesPath = join(absSrcPath, 'pages');

  const tmpDir = ['.oumi', env !== 'development' && env].filter(Boolean).join('-');
  return normalizeWithWinPath({
    appPath,
    absNodeModulesPath: join(appPath, 'node_modules'),
    absOutputPath: join(appPath, config.outputPath || './dist'),
    absSrcPath,
    absPagesPath,
    absTmpPath: join(absSrcPath, tmpDir)
  });
}
