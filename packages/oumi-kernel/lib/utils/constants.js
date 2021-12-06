"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_MODIFY_HOOK = exports.IS_ADD_HOOK = exports.IS_EVENT_HOOK = exports.PluginType = void 0;
var PluginType;
(function (PluginType) {
    PluginType["Preset"] = "Preset";
    PluginType["Plugin"] = "Plugin";
})(PluginType = exports.PluginType || (exports.PluginType = {}));
exports.IS_EVENT_HOOK = /^on/;
exports.IS_ADD_HOOK = /^add/;
exports.IS_MODIFY_HOOK = /^modify/;
