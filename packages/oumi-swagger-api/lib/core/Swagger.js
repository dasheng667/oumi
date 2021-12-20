"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const eachDefinitions_1 = __importDefault(require("./eachDefinitions"));
const parameters_1 = __importDefault(require("./parameters"));
const toResponseJSON_1 = __importDefault(require("./toResponseJSON"));
const toTypeScript_1 = __importDefault(require("./toTypeScript"));
const toInterfaceTemp_1 = __importDefault(require("./toInterfaceTemp"));
const index_1 = require("../template/index");
const mockjs_1 = __importStar(require("../template/mockjs"));
const utils_1 = require("../utils");
const fs_1 = require("../utils/fs");
/**
 * Swagger 拉取工具
 */
class Swagger {
    constructor(body) {
        if (typeof body === 'object') {
            this.body = body;
        }
        this.queryList = {};
        this.responseData = {};
        this.typescriptData = {};
        this.step = '';
    }
    async fetchApi(url) {
        if (typeof url === 'string' && url.startsWith('http')) {
            try {
                const body = await cli_shared_utils_1.request.getJSON(url);
                this.body = body;
                return Promise.resolve(this.body);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.resolve();
    }
    query(options, callback) {
        const { paths, definitions } = this.body;
        const queryList = {};
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Object.keys(paths).forEach((path) => {
            const apiData = paths[path];
            const { post, get, put } = apiData;
            const request = post || get || put;
            if (!utils_1.validataQuery(request, path, options))
                return;
            const ref = utils_1.findResponseRef(request);
            const parametersData = parameters_1.default(definitions, request);
            if (!ref)
                return;
            const res = eachDefinitions_1.default({ definitions, ref });
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
    toResponseJSON(callback) {
        this.step = 'mock';
        const keys = Object.keys(this.queryList);
        if (keys.length === 0)
            return this;
        const json = {};
        keys.forEach((key) => {
            const { response } = this.queryList[key];
            json[key] = toResponseJSON_1.default(response);
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
    toTypeScript(callback) {
        this.step = 'typescript';
        const keys = Object.keys(this.queryList);
        if (keys.length === 0)
            return this;
        const json = {};
        keys.forEach((key) => {
            const { request, response, methods } = this.queryList[key];
            json[key] = {
                request: toTypeScript_1.default(request, 'Props'),
                response: toTypeScript_1.default(response, 'Result'),
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
    toInterfaceTemp(callback) {
        const keys = Object.keys(this.typescriptData);
        if (keys.length === 0)
            return this;
        let propsString = '';
        let resultString = '';
        keys.forEach((key) => {
            const { request, response, methods } = this.typescriptData[key];
            propsString += toInterfaceTemp_1.default(request);
            resultString += toInterfaceTemp_1.default(response);
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
    buildMockJSON(options) {
        const { outputPath, fileType = 'dir', filterPathPrefix } = options || {};
        if (!outputPath || typeof outputPath !== 'string') {
            throw new Error(`outputPath: 格式不合法 ${outputPath}`);
        }
        const data = this.responseData;
        Object.keys(data).forEach((key) => {
            const file = key;
            // 写入目录
            if (fileType === 'dir') {
                const fileName = path_1.default.join(outputPath, `${file}.json`);
                fs_1.writeJSON(fileName, data[file]);
            }
            else if (fileType === 'hump') {
                const fileData = utils_1.transformPath(key, filterPathPrefix);
                const fileName = path_1.default.join(outputPath, `${fileData.key}.json`);
                fs_1.writeJSON(fileName, data[file]);
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
    buildMockJS(options, callback) {
        const { outputPath, fileType = 'js', writeLocalFile = true } = options || {};
        if (!outputPath || typeof outputPath !== 'string') {
            throw new Error(`outputPath: 格式不合法 ${outputPath}`);
        }
        const keys = Object.keys(this.queryList);
        if (keys.length === 0)
            return this;
        let mockStr = '';
        keys.forEach((key) => {
            const { response, methods } = this.queryList[key];
            mockStr += mockjs_1.default(key, methods, response, { fileType });
        });
        mockStr = [mockjs_1.getMockHeaderTemp(fileType), mockStr, mockjs_1.mockExportFooterTemp].join('\n');
        if (writeLocalFile) {
            fs_1.writeFile(`${outputPath}/_mock.${fileType === 'js' ? 'js' : 'ts'}`, mockStr, { allowRepeat: false });
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
    buildApi(options) {
        const { outputPath, requestLibPath, fileType, filterPathPrefix, outputFileName = 'serve.ts', outputFileType } = options || {};
        if (!outputPath || typeof outputPath !== 'string') {
            throw new Error(`outputPath: 格式不合法 ${outputPath}`);
        }
        const keys = Object.keys(this.typescriptData);
        if (keys.length === 0)
            return this;
        let mergeTemp = ``;
        // 多个文件合并输出，需要标注命名空间
        const mergeOutput = (data) => {
            Object.keys(data).forEach((filePath) => {
                const { propsString, resultString, methods } = data[filePath];
                const pathData = utils_1.transformPath(filePath, filterPathPrefix);
                const requestContent = index_1.requestTemp({
                    method: methods,
                    url: `/${pathData.path}`,
                    fileType,
                    namespace: pathData.key
                });
                if (fileType === 'js') {
                    mergeTemp += [requestContent].join('\n');
                }
                else {
                    mergeTemp += [index_1.namespaceTempHead(pathData.key), propsString, resultString, index_1.namespaceTempFoot, requestContent].join('\n');
                }
            });
        };
        // 每个接口生成一个文件
        const outputFile = (data) => {
            Object.keys(data).forEach((filePath) => {
                const { propsString, resultString, methods } = data[filePath];
                const pathData = utils_1.transformPath(filePath, filterPathPrefix);
                const requestLibContent = `${requestLibPath} \n`;
                const requestContent = index_1.requestTemp({
                    method: methods,
                    url: `/${pathData.path}`,
                    fileType
                });
                if (fileType === 'js') {
                    fs_1.writeFile(`${outputPath}/${pathData.path}.js`, [requestLibContent, requestContent].join('\n'));
                }
                else {
                    fs_1.writeFile(`${outputPath}/${pathData.path}.ts`, [requestLibContent, propsString, resultString, requestContent].join('\n'));
                }
            });
        };
        this.toInterfaceTemp((data) => {
            if (outputFileType === 'merge') {
                mergeOutput(data);
            }
            else {
                outputFile(data);
            }
        });
        if (outputFileType === 'merge' && mergeTemp && outputFileName) {
            fs_1.writeFile(`${outputPath}/${outputFileName}`, `${requestLibPath} \n ${mergeTemp}`, { allowRepeat: false });
        }
        return this;
    }
}
exports.default = Swagger;
