"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolve = (dir) => {
    return path_1.default.resolve(__dirname, '../', dir);
};
function addMapping(router, mapping) {
    for (const url in mapping) {
        if (url.startsWith('GET ')) {
            const path1 = url.substring(4);
            router.get(path1, mapping[url]);
        }
        else if (url.startsWith('POST ')) {
            const path2 = url.substring(5);
            router.post(path2, mapping[url]);
        }
        else {
            console.log(`invalid URL: ${url}`);
        }
    }
}
function addControllers(router, dir) {
    const files = fs_1.default.readdirSync(resolve(dir));
    const js_files = files.filter((f) => {
        return f.endsWith('.ts') || f.endsWith('.js');
    });
    for (const f of js_files) {
        const mapping = require(resolve(`${dir}/${f}`)).default;
        addMapping(router, mapping);
    }
}
function default_1(dir) {
    const controllers_dir = dir || 'controllers';
    const router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
}
exports.default = default_1;
