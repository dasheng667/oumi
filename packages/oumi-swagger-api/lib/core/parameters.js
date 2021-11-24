"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eachDefinitions_1 = __importDefault(require("./eachDefinitions"));
function parametersBody(definitions = {}, request = {}) {
    const { parameters } = request;
    if (!parameters || !Array.isArray(parameters))
        return null;
    const body = {};
    if (parameters.length === 1 && parameters[0].in === 'body') {
        const { schema, name } = parameters[0];
        if (schema.type === 'array') {
            const value = (0, eachDefinitions_1.default)({
                definitions,
                isArray: true,
                ref: schema.items.$ref
            });
            return { [name]: value };
        }
        const value = (0, eachDefinitions_1.default)({
            definitions,
            ref: schema.$ref
        });
        Object.assign(body, value);
        return body;
    }
    const filter = parameters.filter((item) => item.in !== 'header');
    if (filter.length === 1 && filter[0].schema && filter[0].schema.$ref) {
        // 说明是一个VO对象，只取里面的结构
        const value = (0, eachDefinitions_1.default)({
            definitions,
            ref: filter[0].schema.$ref
        });
        Object.assign(body, value);
        return body;
    }
    filter.forEach((item) => {
        if (item.schema && item.schema.$ref) {
            const value = (0, eachDefinitions_1.default)({
                definitions,
                ref: item.schema.$ref
            });
            body[item.name] = value;
        }
        else {
            body[item.name] = item;
        }
    });
    return body;
}
exports.default = parametersBody;
