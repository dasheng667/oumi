/* eslint-disable no-continue */
import path from 'path';
import { request as fetch } from '@oumi/cli-shared-utils';
import type {
  Query,
  QueryListItem,
  InterfaceTempCallback,
  ResponseCallback,
  BuildMockOption,
  BuildApiOption,
  MockBuildAOption
} from '../../typings/swagger';
import eachDefinitions from './eachDefinitions';
import parameters from './parameters';
import toResponseJSON from './toResponseJSON';
import toTypeScript from './toTypeScript';
import toInterfaceTemp from './toInterfaceTemp';
import { requestTemp, namespaceTempHead, namespaceTempFoot } from '../template/index';
import mockTemp, { getMockHeaderTemp, mockExportFooterTemp } from '../template/mockjs';
import { validataQuery, findResponseRef, transformPath } from '../utils';
import { writeFile, writeJSON } from '../utils/fs';

/**
 * Swagger 拉取工具
 */
export default class Swagger {
  body: any;
  responseData: any;
  typescriptData: any;
  queryList: QueryListItem;
  step: '' | 'mock' | 'typescript';

  constructor(body?: Object) {
    if (typeof body === 'object') {
      this.body = body;
    }
    this.queryList = {};
    this.responseData = {};
    this.typescriptData = {};
    this.step = '';
  }

  async fetchApi(url: string) {
    if (typeof url === 'string' && url.startsWith('http')) {
      try {
        const body = await fetch.getJSON(url);
        this.body = body;
        return Promise.resolve(this.body);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.resolve();
  }

  /**  filterPaths */
  filterPaths(keyword: string) {
    const { basePath, paths, host, definitions, info, swagger, tags } = this.body;
    const newPaths = {};

    const keys = Object.keys(paths);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = paths[key];
      const response: any = value.get || value.post || value.delete || value.put;
      if (response && Array.isArray(response.tags)) {
        const find = response.tags.find((t: string) => t.indexOf(keyword) > -1);
        if (find) {
          newPaths[key] = value;
          response.tags = response.tags.filter((t) => t.indexOf(keyword) > -1);
          continue;
        }
      }
      if (response && key.indexOf(keyword) > -1) {
        newPaths[key] = value;
      }
    }

    return {
      basePath,
      host,
      info,
      paths: newPaths,
      definitions,
      swagger,
      tags
    };
  }

  query(options: Query, callback?: (list: any) => void) {
    const { paths, definitions } = this.body;
    const queryList = {};

    // eslint-disable-next-line @typescript-eslint/no-shadow
    Object.keys(paths).forEach((path: string) => {
      const apiData = paths[path];
      const { post, get, put } = apiData;
      const request = post || get || put;

      if (!validataQuery(request, path, options) || !request) return;

      const ref = findResponseRef(request);
      const parametersData = parameters(definitions, request);

      const res = eachDefinitions({ definitions, ref });
      // console.log('query: ', path);

      queryList[path] = {
        request: parametersData,
        response: res,
        description: request.description || request.summary,
        methods: Object.keys(apiData)[0]
      };
    });
    this.queryList = queryList;

    if (typeof callback === 'function') {
      callback(this.queryList);
    }
    return this;
  }

  /**
   * 转换 Response
   * @param callback
   * @returns
   */
  toResponseJSON(callback?: (data: Record<string, any>) => void) {
    this.step = 'mock';

    const keys = Object.keys(this.queryList);
    if (keys.length === 0) return this;
    const json = {};

    keys.forEach((key) => {
      const { response } = this.queryList[key];
      json[key] = toResponseJSON(response);
    });

    this.responseData = json;
    if (typeof callback === 'function') {
      callback(json);
    }
    return this;
  }

  /**
   * 转换成ts声明文件
   * @param callback
   * @returns
   */
  toTypeScript(callback?: (data: ResponseCallback) => void) {
    this.step = 'typescript';

    const keys = Object.keys(this.queryList);
    if (keys.length === 0) return this;

    const json = {};
    keys.forEach((key) => {
      const { request, response, methods } = this.queryList[key];
      json[key] = {
        request: toTypeScript(request, 'Props'),
        response: toTypeScript(response, 'Result'),
        methods
      };
    });
    this.typescriptData = json;
    if (typeof callback === 'function') {
      callback(json);
    }
    return this;
  }

  /**
   * 转换成ts的接口模板
   */
  toInterfaceTemp(callback?: (data: InterfaceTempCallback) => void) {
    const keys = Object.keys(this.typescriptData);
    if (keys.length === 0) return this;

    let propsString = '';
    let resultString = '';

    keys.forEach((key) => {
      const { request, response, methods } = this.typescriptData[key];
      propsString += toInterfaceTemp(request);
      resultString += toInterfaceTemp(response);

      if (typeof callback === 'function') {
        callback({
          [key]: {
            propsString,
            resultString,
            methods
          }
        });
      }
      propsString = '';
      resultString = '';
    });
    return this;
  }

  /**
   * 生成模拟的json文件
   */
  buildMockJSON(options: BuildMockOption) {
    const { outputPath, fileType = 'dir', filterPathPrefix } = options || {};

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error(`outputPath: 格式不合法 ${outputPath}`);
    }

    const data = this.responseData;
    Object.keys(data).forEach((key) => {
      const file = key;
      // 写入目录
      if (fileType === 'dir') {
        const fileName = path.join(outputPath, `${file}.json`);
        writeJSON(fileName, data[file]);
      } else if (fileType === 'hump') {
        const fileData = transformPath(key, filterPathPrefix);
        const fileName = path.join(outputPath, `${fileData.key}.json`);
        writeJSON(fileName, data[file]);
      }
    });

    return this;
  }

  /**
   * 生成 mockjs 的模拟数据
   * @param options
   * @options outputPath 输出路径
   * @returns
   */
  buildMockJS(options: MockBuildAOption, callback?: (mockStr: string) => void) {
    const { outputPath, fileType = 'js', writeLocalFile = true } = options || {};

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error(`outputPath: 格式不合法 ${outputPath}`);
    }

    const keys = Object.keys(this.queryList);
    if (keys.length === 0) return this;

    let mockStr = '';
    keys.forEach((key) => {
      const { response, methods } = this.queryList[key];
      mockStr += mockTemp(key, methods, response, { fileType });
    });

    mockStr = [getMockHeaderTemp(fileType), mockStr, mockExportFooterTemp].join('\n');

    if (writeLocalFile) {
      writeFile(`${outputPath}/_mock.${fileType === 'js' ? 'js' : 'ts'}`, mockStr, { allowRepeat: false });
    }

    if (typeof callback === 'function') {
      callback(mockStr);
    }

    return this;
  }

  /**
   *
   * @returns 生成api文件
   */
  buildApi(options: BuildApiOption) {
    const {
      outputPath,
      requestLibPath,
      fileType,
      filterPathPrefix,
      outputFileName = 'serve.ts',
      outputFileType,
      requestParams
    } = options || {};

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error(`outputPath: 格式不合法 ${outputPath}`);
    }

    const keys = Object.keys(this.typescriptData);
    if (keys.length === 0) return this;

    let mergeTemp = ``;

    // 多个文件合并输出，需要标注命名空间
    const mergeOutput = (data: InterfaceTempCallback) => {
      Object.keys(data).forEach((filePath) => {
        const { propsString, resultString, methods } = data[filePath];
        const pathData = transformPath(filePath, filterPathPrefix);
        const requestContent = requestTemp({
          method: methods,
          url: `/${pathData.path}`,
          fileType,
          namespace: pathData.key,
          requestParams
        });

        if (fileType === 'js') {
          mergeTemp += [requestContent].join('\n');
        } else {
          mergeTemp += [namespaceTempHead(pathData.key), propsString, resultString, namespaceTempFoot, requestContent].join('\n');
        }
      });
    };

    // 每个接口生成一个文件
    const outputFile = (data: InterfaceTempCallback) => {
      Object.keys(data).forEach((filePath) => {
        const { propsString, resultString, methods } = data[filePath];
        const pathData = transformPath(filePath, filterPathPrefix);
        const requestLibContent = `${requestLibPath} \n`;
        const requestContent = requestTemp({
          method: methods,
          url: `/${pathData.path}`,
          fileType,
          requestParams
        });

        if (fileType === 'js') {
          writeFile(`${outputPath}/${pathData.path}.js`, [requestLibContent, requestContent].join('\n'));
        } else {
          writeFile(`${outputPath}/${pathData.path}.ts`, [requestLibContent, propsString, resultString, requestContent].join('\n'));
        }
      });
    };

    this.toInterfaceTemp((data) => {
      if (outputFileType === 'merge') {
        mergeOutput(data);
      } else {
        outputFile(data);
      }
    });

    if (outputFileType === 'merge' && mergeTemp && outputFileName) {
      writeFile(`${outputPath}/${outputFileName}`, `${requestLibPath} \n ${mergeTemp}`, { allowRepeat: false });
    }

    return this;
  }
}
