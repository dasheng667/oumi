export declare type DownloadOptions = {
  useBuiltJSON?: boolean;
  recursive?: boolean;
  downloadSource?: 'raw' | 'api';
  token?: string;
};
/**
 * * 预览专用 *
 * 从文件数组映射为 pro 的路由
 * @param {*} name
 */
export declare const genBlockName: (name: any) => any;
export declare const getBlockListFromGit: (gitUrl: any, options?: DownloadOptions) => Promise<any>;
