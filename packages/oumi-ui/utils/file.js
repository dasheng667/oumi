const { launch } = require('@oumi/cli-shared-utils');
const path = require('path');
// Connectors
// const cwd = require('./cwd')
// const git = require('./git')
// const logs = require('./logs')

// 打开编辑器
async function openInEditor(input = {}, context) {
  let query;
  if (input.gitPath) {
    // query = await git.resolveFile(input.file, context)
  } else {
    query = input.file;
    // query = path.resolve(cwd.get(), input.file)
  }
  if (input.line) {
    query += `:${input.line}`;
    if (input.column) {
      query += `:${input.column}`;
    }
  }

  launch(query);
  return true;
}

function load(file) {
  const module = require(file);
  if (module.default) {
    return module.default;
  }
  return module;
}

module.exports = {
  openInEditor,
  load
};
