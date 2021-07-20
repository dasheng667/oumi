"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("../template");
/**
 * 将数据节点转换成 ts 接口文件
 * @param data
 * @returns
 */
function toInterfaceTemp(data) {
    let str = '';
    Object.keys(data).forEach(key => {
        const val = data[key];
        str += template_1.interfaceTemp(key, val);
    });
    return str;
}
exports.default = toInterfaceTemp;
