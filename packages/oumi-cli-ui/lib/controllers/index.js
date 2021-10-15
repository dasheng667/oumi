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
const fs_1 = __importDefault(require("fs"));
const utilsFile = __importStar(require("../utils/file"));
const resolve = (dir) => {
    return path_1.default.resolve(__dirname, '../', dir);
};
const fn_hello = async (ctx) => {
    ctx.returnSuccess({ a: 'a' });
};
const getUserFolder = async (ctx) => {
    const postData = ctx.request.body;
    const lastImportPath = ctx.model.lastImportPath.get();
    function getFolder(paramsPath) {
        let folder = '';
        if (Array.isArray(paramsPath)) {
            const dir = paramsPath.join(path_1.default.sep);
            if (paramsPath.length === 1) {
                return `${paramsPath}${path_1.default.sep}`;
            }
            folder = path_1.default.join(dir);
            if (fs_1.default.existsSync(folder)) {
                return folder;
            }
            return resolve('../');
        }
        if (paramsPath) {
            if (fs_1.default.existsSync(paramsPath)) {
                return paramsPath;
            }
        }
        return resolve('../');
    }
    const currentPath = getFolder(postData.rootPathArr || lastImportPath);
    const files = fs_1.default.readdirSync(currentPath);
    const isPackage = files.includes('package.json');
    const dir_files = files.filter((f) => {
        if (f === 'package.json')
            return true;
        if (f === 'LICENSE')
            return false;
        return f.indexOf('.') === -1 && f !== 'node_modules';
    });
    const currentPathArr = currentPath.split(path_1.default.sep);
    ctx.model.lastImportPath.set(currentPathArr);
    ctx.returnSuccess({
        currentPath: currentPathArr,
        files: dir_files,
        isPackage
    });
};
const getProjectList = async (ctx) => {
    const list = ctx.model.projectList.get();
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.path) {
                if (!fs_1.default.existsSync(item.path)) {
                    ctx.model.projectList.remove({ id: item.id });
                    ctx.model.dashboard.set('');
                }
            }
        }
    }
    ctx.returnSuccess(list || []);
};
const collectionProjectById = async (ctx) => {
    const { id, collect } = ctx.request.body;
    if (typeof id === 'string') {
        const list = ctx.model.projectList.collection(id, collect);
        ctx.returnSuccess(list || []);
    }
    else {
        ctx.returnError('id error');
    }
};
const removeProject = async (ctx) => {
    const { id, name } = ctx.request.body;
    if (!id && !name) {
        return ctx.returnError(`参数异常`);
    }
    const remove = ctx.model.projectList.remove({ id, name });
    return ctx.returnSuccess(remove);
};
const importToProject = async (ctx) => {
    const { importPath } = ctx.request.body;
    if (!importPath) {
        return ctx.returnError(`导入目录不能为空`);
    }
    const projectPath = importPath.join(path_1.default.sep);
    try {
        const pkg = require(path_1.default.join(projectPath, './package.json'));
        const name = pkg.name || importPath[importPath.length - 1];
        ctx.model.projectList.push({
            name,
            path: projectPath
        });
        return ctx.returnSuccess(pkg);
    }
    catch (e) {
        return ctx.returnError(e);
    }
};
const setProjectDashboard = async (ctx) => {
    const { id } = ctx.request.body;
    if (!id || typeof id !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    ctx.model.dashboard.set(id);
    return ctx.returnSuccess(id);
};
const getDashboardByProject = async (ctx) => {
    try {
        const id = ctx.model.dashboard.get();
        if (!id) {
            return ctx.returnError('没有这个项目');
        }
        const project = ctx.model.projectList.find({ id });
        if (project) {
            if (fs_1.default.existsSync(project.path)) {
                return ctx.returnSuccess(project);
            }
            ctx.model.projectList.remove({ id: project.id });
            return ctx.returnError('目录错误');
        }
        return ctx.returnError('没有这个项目');
    }
    catch (e) {
        return ctx.returnError(e);
    }
};
const createProjectDir = async (ctx) => {
    const { currentPath, dirName } = ctx.request.body;
    if (!dirName || typeof dirName !== 'string') {
        return ctx.returnError(`参数异常`);
    }
    let createPath = currentPath;
    if (!createPath) {
        const data = await ctx.model.projectList.findCurrent();
        if (!data) {
            return ctx.returnError(`项目数据异常`);
        }
        createPath = data.path;
    }
    const isDir = fs_1.default.statSync(createPath).isDirectory();
    if (!isDir) {
        return ctx.returnError('必须是文件目录');
    }
    const dir = path_1.default.join(createPath, dirName);
    if (fs_1.default.existsSync(dir)) {
        return ctx.returnError('目录已存在');
    }
    fs_1.default.mkdirSync(dir);
    return ctx.returnSuccess('success');
};
const verifyDirs = async (ctx) => {
    const { targetPath } = ctx.request.body;
    if (!targetPath || !Array.isArray(targetPath)) {
        return ctx.returnError(`参数异常`);
    }
    const strTargetPath = targetPath.join(path_1.default.sep);
    if (!fs_1.default.existsSync(strTargetPath)) {
        return ctx.returnError('目录不存在');
    }
    return ctx.returnSuccess('success');
};
const openInEditor = async (ctx) => {
    const { input } = ctx.request.body;
    await utilsFile.openInEditor(input);
    return ctx.returnSuccess('success');
};
exports.default = {
    'GET /api/hello/:name': fn_hello,
    'POST /api/user/folder': getUserFolder,
    'POST /api/project/list': getProjectList,
    'POST /api/project/collect': collectionProjectById,
    'POST /api/project/remove': removeProject,
    'POST /api/project/dashboard': setProjectDashboard,
    'POST /api/project/import': importToProject,
    'POST /api/project/verifyDirs': verifyDirs,
    'POST /api/project/createDir': createProjectDir,
    'POST /api/dashboard/init': getDashboardByProject,
    'POST /api/openInEditor': openInEditor
};
