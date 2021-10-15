"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const package_json_1 = __importDefault(require("../../package.json"));
const cli_shared_utils_1 = require("@oumi/cli-shared-utils");
const debugger_1 = require("../connectors/debugger");
const getList = async (ctx) => {
    const res = ctx.model.debugger.getList();
    return ctx.returnSuccess(res);
};
const removeNode = async (ctx) => {
    const { key } = ctx.request.body;
    if (!key) {
        return ctx.returnError(`参数异常`);
    }
    const res = ctx.model.debugger.removeByKey(key);
    return ctx.returnSuccess(res);
};
const taskDetail = async (ctx) => {
    const { key, pkey } = ctx.request.body;
    if (!key) {
        return ctx.returnError(`参数异常`);
    }
    if (key === '1')
        return ctx.returnSuccess({});
    const find = ctx.model.debugger.findByKey(key);
    let res = { ...find };
    if (pkey) {
        const parent = ctx.model.debugger.findByKey(pkey);
        if (parent && !parent.isTest) {
            res = {
                ...res,
                url: parent.url,
                method: parent.method
            };
        }
    }
    return ctx.returnSuccess(res);
};
const runTask = async (ctx) => {
    const { env, url, request, key, requestPost } = ctx.request.body;
    let { method } = ctx.request.body;
    if (!env) {
        return ctx.returnError('env error');
    }
    if (!method) {
        return ctx.returnError('method error');
    }
    if (!url) {
        return ctx.returnError('url error');
    }
    if (!request) {
        return ctx.returnError('request error');
    }
    let fetchUrl = url;
    const startTime = Date.now();
    method = method.toLocaleUpperCase();
    try {
        const globalParams = ctx.model.debuggerGlobal.getGlobalParams();
        if (!fetchUrl.startsWith('http')) {
            const envConfig = ctx.model.debuggerEnvList.getCurrentEnvConfig();
            if (envConfig && envConfig.url) {
                fetchUrl = envConfig.url + fetchUrl;
            }
        }
        const cookie = { ...globalParams.cookie, ...debugger_1.getRequestContent(request.cookie) };
        const headers = { ...globalParams.header, ...debugger_1.getRequestContent(request.header) };
        if (Object.keys(cookie).length > 0) {
            Object.assign(headers, { cookie: qs_1.default.stringify(cookie) });
        }
        const options = {
            method,
            headers
        };
        if (method === 'POST') {
            const bodyFormData = { ...globalParams.bodyFormData, ...debugger_1.getRequestContent(request.bodyFormData) };
            const bodyJSON = { ...debugger_1.getRequestContent(request.bodyJSON) };
            const reqBody = Object.keys(bodyFormData).length > 0 ? JSON.stringify(bodyFormData) : bodyJSON;
            Object.assign(options, { body: reqBody });
        }
        else if (method === 'GET') {
            const query = { ...globalParams.query, ...debugger_1.getRequestContent(request.query) };
            fetchUrl = debugger_1.urlStringify(fetchUrl, query);
        }
        const res = await cli_shared_utils_1.fetch(fetchUrl, options);
        const endTime = Date.now();
        let isJSON = false;
        let body = await res.text();
        if (typeof body === 'string' && body.startsWith('{') && body.endsWith('}')) {
            isJSON = true;
            body = JSON.parse(body);
        }
        const requestHeader = {
            'User-Agent': `${package_json_1.default.name}/${package_json_1.default.version}`,
            Accept: '*/*',
            'Cache-Control': 'no-cache',
            Host: ctx.request.headers.host,
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            ...headers
        };
        const result = {
            body,
            method,
            isJSON,
            fetchUrl,
            requestHeader,
            timer: endTime - startTime,
            statusText: res.statusText,
            status: res.status,
            header: res.headers.raw(),
            assertResult: debugger_1.getAssertResult(body, requestPost)
        };
        return ctx.returnSuccess(result);
    }
    catch (e) {
        return ctx.returnError(e);
    }
};
const createTestExample = (ctx) => {
    const { title, pkey } = ctx.request.body;
    if (!title) {
        return ctx.returnError('title error');
    }
    if (!pkey) {
        return ctx.returnError('pkey error');
    }
    const findParent = ctx.model.debugger.findByKey(pkey);
    if (findParent) {
        try {
            const deep = JSON.stringify(findParent);
            const parse = JSON.parse(deep);
            const node = {
                pkey,
                title,
                url: null,
                request: parse.request,
                requestPost: parse.requestPost,
                isLeaf: true,
                isTest: true,
                _mid: findParent._mid
            };
            const res = ctx.model.debugger.pushNode(node);
            return ctx.returnSuccess(res);
        }
        catch (e) {
            return ctx.returnError(e);
        }
    }
    return ctx.returnError(`not find key ${pkey}`);
};
const onSaveTask = async (ctx) => {
    const data = await ctx.model.projectList.findCurrent();
    if (!data) {
        return ctx.returnError(`项目数据异常`);
    }
    const { env, method, url, request, group, key, requestPost, isTest } = ctx.request.body;
    if (!env) {
        return ctx.returnError('env error');
    }
    if (!method) {
        return ctx.returnError('method error');
    }
    if (!url) {
        return ctx.returnError('url error');
    }
    if (!request) {
        return ctx.returnError('request error');
    }
    const writeData = {
        url: isTest ? null : url,
        env: isTest ? null : env,
        method: isTest ? null : method,
        group,
        request,
        requestPost
    };
    if (key) {
        const ues = await ctx.model.debugger.updateByKey(key, writeData);
        return ctx.returnSuccess(ues);
    }
    const res = await ctx.model.debugger.pushNode(writeData);
    return ctx.returnSuccess(res);
};
const getGlobalVar = (ctx) => {
    const res1 = ctx.model.debuggerGlobal.getList();
    const res2 = ctx.model.debuggerEnvList.getList();
    return ctx.returnSuccess({
        global: res1,
        envList: res2
    });
};
const saveGlobalVar = (ctx) => {
    const { type, data, form } = ctx.request.body;
    if (!type) {
        return ctx.returnError('type error');
    }
    if (!data) {
        return ctx.returnError('data error');
    }
    if (type === 'envList') {
        if (!form || !form.env) {
            return ctx.returnError('form error');
        }
        const res = ctx.model.debuggerEnvList.save(form.env, {
            data,
            form
        });
        return ctx.returnSuccess(res);
    }
    const res = ctx.model.debuggerGlobal.save({
        type,
        data,
        form
    });
    return ctx.returnSuccess(res);
};
const toggleEnv = (ctx) => {
    const { env } = ctx.request.body;
    if (!env) {
        return ctx.returnError('env error');
    }
    const res = ctx.model.debuggerEnvList.setCurrentEnv(env);
    return ctx.returnSuccess(res);
};
const getCurrentEnv = (ctx) => {
    const res = ctx.model.debuggerEnvList.getCurrentEnv();
    return ctx.returnSuccess(res);
};
exports.default = {
    'POST /api/debugger/getList': getList,
    'POST /api/debugger/remove': removeNode,
    'POST /api/debugger/saveTask': onSaveTask,
    'POST /api/debugger/runTask': runTask,
    'POST /api/debugger/taskDetail': taskDetail,
    'POST /api/debugger/creatTestExp': createTestExample,
    'POST /api/debugger/getGlobalVar': getGlobalVar,
    'POST /api/debugger/saveGlobalVar': saveGlobalVar,
    'POST /api/debugger/getCurrentEnv': getCurrentEnv,
    'POST /api/debugger/toggleEnv': toggleEnv
};
