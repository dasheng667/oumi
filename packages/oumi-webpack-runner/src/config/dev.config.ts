import baseConfig from './base.config';
import type { IConfig } from '../typings';

export default (appPath: string, config: IConfig) => {
  const chain = baseConfig(appPath, config);
  return chain;
};
