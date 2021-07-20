"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const eachDefinitions_1 = __importDefault(require("./eachDefinitions"));
const parameters_1 = __importDefault(require("./parameters"));
const toResponseJSON_1 = __importDefault(require("./toResponseJSON"));
const toTypeScript_1 = __importDefault(require("./toTypeScript"));
const toInterfaceTemp_1 = __importDefault(require("./toInterfaceTemp"));
const index_1 = require("../template/index");
const utils_1 = require("../utils");
const fs_1 = require("../utils/fs");
const fetch_1 = __importDefault(require("../fetch"));
/**
 * Swagger 拉取工具
 */
class Swagger {
    constructor(body) {
        if (typeof body === "object") {
            this.body = body;
        }
        this.queryList = {};
        this.responseData = {};
        this.typescriptData = {};
        this.step = "";
    }
    async fetchApi(url) {
        if (typeof url === "string" && url.startsWith("http")) {
            try {
                const body = await fetch_1.default(url);
                this.body = body;
                return Promise.resolve(this.body);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
    }
    query(options, callback) {
        const { paths, definitions } = this.body;
        const queryList = {};
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
            console.log("query: ", path);
            queryList[path] = {
                request: parametersData,
                response: res,
                methods: Object.keys(apiData)[0],
            };
        });
        this.queryList = queryList;
        if (typeof callback === "function") {
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
        this.step = "mock";
        const keys = Object.keys(this.queryList);
        if (keys.length === 0)
            return this;
        const json = {};
        keys.forEach((path) => {
            const { response } = this.queryList[path];
            json[path] = toResponseJSON_1.default(response);
        });
        this.responseData = json;
        if (typeof callback === "function") {
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
        this.step = "typescript";
        const keys = Object.keys(this.queryList);
        if (keys.length === 0)
            return this;
        const json = {};
        keys.forEach((path) => {
            const { request, response, methods } = this.queryList[path];
            json[path] = {
                request: toTypeScript_1.default(request, "props"),
                response: toTypeScript_1.default(response, "result"),
                methods,
            };
        });
        this.typescriptData = json;
        if (typeof callback === "function") {
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
        let propsString = "";
        let resultString = "";
        keys.forEach((path) => {
            const { request, response, methods } = this.typescriptData[path];
            propsString += toInterfaceTemp_1.default(request);
            resultString += toInterfaceTemp_1.default(response);
            if (typeof callback === "function") {
                callback({
                    [path]: {
                        propsString,
                        resultString,
                        methods,
                    },
                });
            }
            propsString = "";
            resultString = "";
        });
        return this;
    }
    /**
     * 生成模拟的json文件
     */
    buildMockJSON(options) {
        const { outputPath, fileType = "dir", filterPathPrefix } = options || {};
        if (!outputPath || typeof outputPath !== "string") {
            throw new Error(`outputPath: 格式不合法 ${outputPath}`);
        }
        const data = this.responseData;
        Object.keys(data).forEach((key) => {
            const file = key;
            // 写入目录
            if (fileType === "dir") {
                const fileName = path_1.default.join(outputPath, `${file}.json`);
                fs_1.writeJSON(fileName, data[file]);
            }
            else if (fileType === "hump") {
                const fileData = utils_1.transformPath(key, filterPathPrefix);
                const fileName = path_1.default.join(outputPath, `${fileData.key}.json`);
                fs_1.writeJSON(fileName, data[file]);
            }
        });
        return this;
    }
    /**
     *
     * @returns 生成api文件
     */
    buildApi(options) {
        const { outputPath, requestLibPath, fileType, filterPathPrefix } = options || {};
        if (!outputPath || typeof outputPath !== "string") {
            throw new Error(`outputPath: 格式不合法 ${outputPath}`);
        }
        const keys = Object.keys(this.typescriptData);
        if (keys.length === 0)
            return this;
        this.toInterfaceTemp((data) => {
            Object.keys(data).forEach((path) => {
                const { propsString, resultString, methods } = data[path];
                if (outputPath) {
                    const pathData = utils_1.transformPath(path, filterPathPrefix);
                    let requestLibContent = `${requestLibPath} \n`;
                    const requestContent = index_1.requestTemp({
                        method: methods,
                        url: '/' + pathData.path,
                        fileType,
                    });
                    if (fileType === "js") {
                        fs_1.writeTS(`${outputPath}/${pathData.path}.js`, `${requestLibContent} \n ${requestContent}`);
                    }
                    else {
                        fs_1.writeTS(`${outputPath}/${pathData.path}.ts`, `\n ${requestLibContent} \n ${propsString} \n ${resultString} \n ${requestContent}`);
                    }
                }
            });
        });
        return this;
    }
}
exports.default = Swagger;
