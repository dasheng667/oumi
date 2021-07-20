"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eachDefinitions_1 = __importDefault(require("./eachDefinitions"));
function checkParamsIn(value) {
    if (value && value.in !== 'header') {
        return true;
    }
    return false;
}
function parametersBody(definitions = {}, request = {}) {
    const { parameters } = request;
    if (!parameters || !Array.isArray(parameters))
        return null;
    const body = {};
    if (parameters.length == 1 && parameters[0].in == "body") {
        const value = eachDefinitions_1.default({
            definitions,
            ref: parameters[0].schema.$ref,
        });
        Object.assign(body, value);
        return body;
    }
    parameters.map((item) => {
        if (item.schema && item.schema.$ref) {
            const value = eachDefinitions_1.default({
                definitions,
                ref: item.schema.$ref,
            });
            if (checkParamsIn(value)) {
                body[item.name] = value;
            }
        }
        else {
            if (checkParamsIn(item)) {
                body[item.name] = item;
            }
        }
    });
    return body;
}
exports.default = parametersBody;
;
