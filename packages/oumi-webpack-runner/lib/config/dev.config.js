"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_config_1 = __importDefault(require("./base.config"));
exports.default = (appPath, config) => {
    const chain = (0, base_config_1.default)(appPath, config);
    return chain;
};
