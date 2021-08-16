export interface Query {
  keyword?: string;
  tag?: string;
  path?: string | string[];
}

export type QueryListItem = Record<string, any>;

export type ResponseCallback = Record<
  string,
  {
    request: any;
    response: any;
  }
>;

export type InterfaceTempCallback = Record<
  string,
  {
    propsString: string;
    resultString: string;
    methods: 'get' | 'post' | 'put' | 'delete';
  }
>;

export interface BuildMockOption {
  /** 生成路径 */
  outputPath: string;

  /**
   * 写入文件的类型
   * dir = 目录
   * hump = 驼峰
   */
  fileType?: '' | 'dir' | 'hump';

  /* 需要过滤的path前缀 */
  filterPathPrefix?: string;
}

export interface BuildApiOption {
  /** 生成路径 */
  outputPath: string;

  fileType?: 'js' | 'ts';

  /* 需要过滤的path前缀 */
  filterPathPrefix?: string;

  /* import 头部 */
  requestLibPath: string;

  /** 输出文件类型 merge=表示所以接口文件合并在一起 */
  outputFileType?: 'merge' | undefined;

  /** 若 outputFileType = 'merge'，这里必填 */
  outputFileName?: string;
}

export interface MockBuildAOption {
  /** 生成路径 */
  outputPath: string;

  fileType?: 'js' | 'ts';
}
