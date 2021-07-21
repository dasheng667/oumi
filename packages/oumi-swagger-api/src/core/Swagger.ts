import path from 'path';
import type {
  Query,
  QueryListItem,
  InterfaceTempCallback,
  ResponseCallback,
  BuildMockOption,
  BuildApiOption
} from '../../typings/swagger';
import eachDefinitions from './eachDefinitions';
import parameters from './parameters';
import toResponseJSON from './toResponseJSON';
import toTypeScript from './toTypeScript';
import toInterfaceTemp from './toInterfaceTemp';
import { requestTemp } from '../template/index';
import { validataQuery, findResponseRef, transformPath, log } from '../utils';
import { writeTS, writeJSON } from '../utils/fs';
import fetch from '../fetch';

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
        const body = await fetch(url);
        this.body = body;
        return Promise.resolve(this.body);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.resolve();
  }

  query(options: Query, callback?: (list: any) => void) {
    const { paths, definitions } = this.body;
    const queryList = {};

    // eslint-disable-next-line @typescript-eslint/no-shadow
    Object.keys(paths).forEach((path: string) => {
      const apiData = paths[path];
      const { post, get, put } = apiData;
      const request = post || get || put;

      if (!validataQuery(request, path, options)) return;

      const ref = findResponseRef(request);
      const parametersData = parameters(definitions, request);
      if (!ref) return;

      const res = eachDefinitions({ definitions, ref });
      console.log('query: ', path);

      queryList[path] = {
        request: parametersData,
        response: res,
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
        request: toTypeScript(request, 'props'),
        response: toTypeScript(response, 'result'),
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
   *
   * @returns 生成api文件
   */
  buildApi(options: BuildApiOption) {
    const { outputPath, requestLibPath, fileType, filterPathPrefix } = options || {};

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error(`outputPath: 格式不合法 ${outputPath}`);
    }

    const keys = Object.keys(this.typescriptData);
    if (keys.length === 0) return this;

    this.toInterfaceTemp((data) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      Object.keys(data).forEach((path) => {
        const { propsString, resultString, methods } = data[path];
        if (outputPath) {
          const pathData = transformPath(path, filterPathPrefix);
          const requestLibContent = `${requestLibPath} \n`;
          const requestContent = requestTemp({
            method: methods,
            url: `/${pathData.path}`,
            fileType
          });

          if (fileType === 'js') {
            writeTS(`${outputPath}/${pathData.path}.js`, `${requestLibContent} \n ${requestContent}`);
          } else {
            writeTS(
              `${outputPath}/${pathData.path}.ts`,
              `\n ${requestLibContent} \n ${propsString} \n ${resultString} \n ${requestContent}`
            );
          }
        }
      });
    });

    return this;
  }
}
