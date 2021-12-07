import type { IApiPaths } from '@oumi/kernel/typings/type';

export interface IConfig {
  watch?: boolean;
  port: string;
  host: string;

  paths: IApiPaths;
}
