"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_api_1 = __importDefault(require("@oumi/swagger-api"));
const utils_1 = require("@oumi/swagger-api/lib/utils");
const template_1 = require("@oumi/swagger-api/lib/template");
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const exportMock = async (ctx) => {
    const { id, searchPath } = ctx.request.query;
    const data = await ctx.model.userConfig.swagger.findById(id);
    const swaggerData = await cli_shared_utils_1.request.getJSON(data.href);
    const swagger = new swagger_api_1.default(swaggerData);
    swagger.query({ path: searchPath }).toResponseJSON((res) => {
        const key = Object.keys(res);
        if (key.length === 0) {
            ctx.body = '无效的mock数据';
            return;
        }
        const trans = utils_1.transformPath(key[0], 'api');
        const json = res[key[0]];
        ctx.set('Content-Type', 'application/json-my-attachment');
        ctx.set('content-disposition', `attachment; filename="${trans.key}.json"`);
        ctx.body = JSON.stringify(json, null, '\t');
    });
};
const exportTSFile = async (ctx) => {
    const { id, searchPath } = ctx.request.query;
    const data = await ctx.model.userConfig.swagger.findById(id);
    const swaggerData = await cli_shared_utils_1.request.getJSON(data.href);
    const swagger = new swagger_api_1.default(swaggerData);
    const fileType = 'ts';
    let mergeTemp = '';
    const mergeOutput = (json) => {
        Object.keys(json).forEach((filePath) => {
            const { propsString, resultString, methods } = json[filePath];
            const pathData = utils_1.transformPath(filePath, 'api');
            const requestContent = template_1.requestTemp({
                method: methods,
                url: `/${pathData.path}`,
                fileType,
                namespace: pathData.key
            });
            mergeTemp += [template_1.namespaceTempHead(pathData.key), propsString, resultString, template_1.namespaceTempFoot, requestContent].join('\n');
        });
    };
    swagger
        .query({ path: searchPath })
        .toTypeScript()
        .toInterfaceTemp((res) => {
        const key = Object.keys(res);
        if (key.length === 0) {
            ctx.body = '无效的mock数据';
            return;
        }
        const trans = utils_1.transformPath(key[0], 'api');
        mergeOutput(res);
        ctx.set('Content-Type', 'application/json-my-attachment');
        ctx.set('content-disposition', `attachment; filename="${trans.key}.ts"`);
        ctx.body = `import request from '@/api/request'; \n ${mergeTemp}`;
    });
};
exports.default = {
    'GET /api/export/mock': exportMock,
    'GET /api/export/typescript': exportTSFile
};
