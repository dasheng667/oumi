import { launch } from '@oumi/cli-shared-utils';

// 打开编辑器
export async function openInEditor(input: any = {}) {
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

export function load(file: string) {
  const module = require(file);
  if (module.default) {
    return module.default;
  }
  return module;
}
