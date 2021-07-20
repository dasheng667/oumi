"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTS = exports.writeJSON = exports.createFileSync = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const index_1 = require("./index");
/**
 * 创建文件
 * @param filePath
 * @param callback
 */
const createFileSync = (filePath, callback) => {
    fs_extra_1.default.ensureFile(filePath, function (err, data) {
        if (typeof callback === 'function') {
            callback(err, data);
        }
    });
};
exports.createFileSync = createFileSync;
function writeJSON(filePath, data, callback) {
    fs_extra_1.default.createFileSync(filePath);
    fs_extra_1.default.writeFile(filePath, JSON.stringify(data, null, "\t"), null, (err, data) => {
        if (err) {
            index_1.log.red(`写入失败: ${filePath} `, err);
        }
        else {
            index_1.log.green(`写入成功: ${filePath}`);
        }
        if (typeof callback === 'function') {
            callback(err, data);
        }
    });
}
exports.writeJSON = writeJSON;
function writeTS(filePath, content) {
    fs_extra_1.default.createFileSync(filePath);
    fs_extra_1.default.writeFile(filePath, content, null, () => { });
}
exports.writeTS = writeTS;
