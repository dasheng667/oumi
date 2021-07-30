import type { DownloadOptions } from './git';
/**
 * 下载git项目中的其中一个目录
 */
export declare function downloadFileToLocal(
  url: string,
  outputPath: string,
  options?: DownloadOptions
): Promise<unknown>;
/**
 * 从 url git 中下载到本地临时目录
 * @param url
 * @param id
 * @param branch
 * @param log
 * @param args
 */
export declare function downloadFromGit(url: any, id: any, branch?: string, args?: any): string;
