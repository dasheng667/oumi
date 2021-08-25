'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.load = exports.openInEditor = void 0;
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
async function openInEditor(input = {}) {
  let query;
  if (input.gitPath) {
  } else {
    query = input.file;
  }
  if (input.line) {
    query += `:${input.line}`;
    if (input.column) {
      query += `:${input.column}`;
    }
  }
  cli_shared_utils_1.launch(query);
  return true;
}
exports.openInEditor = openInEditor;
function load(file) {
  const module = require(file);
  if (module.default) {
    return module.default;
  }
  return module;
}
exports.load = load;
