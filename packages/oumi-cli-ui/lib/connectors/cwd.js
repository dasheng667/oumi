'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const channels_1 = __importDefault(require('./channels'));
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const db_1 = __importDefault(require('../model/db'));
let cwd = process.cwd();
function normalize(value) {
  if (value.length === 1) return value;
  const lastChar = value.charAt(value.length - 1);
  if (lastChar === path_1.default.sep) {
    value = value.substr(0, value.length - 1);
  }
  return value;
}
exports.default = {
  get: () => {
    const current = db_1.default.projectList.findCurrent();
    return (current && current.path) || cwd;
  },
  set: (value, context) => {
    value = normalize(value);
    if (!fs_1.default.existsSync(value)) return;
    cwd = value;
    process.env.VUE_CLI_CONTEXT = value;
    context.pubsub.publish(channels_1.default.CWD_CHANGED, { cwdChanged: value });
    try {
      process.chdir(value);
    } catch (err) {
      console.error(err);
    }
  }
};
