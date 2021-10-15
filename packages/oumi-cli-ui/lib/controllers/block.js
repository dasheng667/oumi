"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const git_url_parse_1 = __importDefault(require("git-url-parse"));
const block_sdk_1 = require("@oumi/block-sdk");
const getUserBlockList = (ctx) => {
    const data = ctx.model.userBlocks.get();
    return ctx.returnSuccess(data || []);
};
const pushBlockItem = (ctx) => {
    const { name, href } = ctx.request.body;
    if (!name || typeof name !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    if (!href || typeof href !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    const { resource } = git_url_parse_1.default(href) || {};
    if (resource !== 'github.com') {
        return ctx.returnError(`目前只支持 github 项目`);
    }
    if (!href.endsWith('.json')) {
        return ctx.returnError(`资产链接必须是json后缀`);
    }
    const data = ctx.model.userBlocks.add({ name, href });
    return ctx.returnSuccess(data);
};
const removeBlockItem = (ctx) => {
    const { id } = ctx.request.body;
    if (!id || typeof id !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    const res = ctx.model.userBlocks.remove(id);
    return ctx.returnSuccess(res);
};
const getBlockListFormGit = async (ctx) => {
    const { url, useBuiltJSON = true } = ctx.request.body;
    if (!url || typeof url !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    try {
        const data = await block_sdk_1.getBlockListFromGit(url, { useBuiltJSON });
        if (data && data.list) {
            return ctx.returnSuccess(data.list);
        }
        return ctx.returnError('blocks格式错误');
    }
    catch (e) {
        return ctx.returnError(e);
    }
};
const downloadFile = async (ctx) => {
    const { destPath, url } = ctx.request.body;
    if (!destPath || typeof destPath !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    if (!fs_1.default.existsSync(destPath)) {
        return ctx.returnError(`必须是一个有效的目录`);
    }
    try {
        const config = ctx.model.userConfig.private.get();
        let token = '';
        if (config && config.access_token) {
            token = config.access_token;
        }
        const data = await block_sdk_1.downloadFileToLocal(url, destPath, { recursive: true, downloadSource: 'api', token });
        return ctx.returnSuccess(data);
    }
    catch (e) {
        if (typeof e === 'string' && e.indexOf('API rate limit exceeded') > -1) {
            return ctx.returnError({ msg: '因 github api 有下载次数限制，可配置 access_token 无限制下载！！！', code: 999 });
        }
        return ctx.returnError(e);
    }
};
exports.default = {
    'POST /api/block/getList': getUserBlockList,
    'POST /api/block/pushItem': pushBlockItem,
    'POST /api/block/removeItem': removeBlockItem,
    'POST /api/block/getListFormGit': getBlockListFormGit,
    'POST /api/block/downloadFile': downloadFile
};
