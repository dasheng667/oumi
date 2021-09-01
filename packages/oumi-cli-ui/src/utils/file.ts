import path from 'path';
import { launch, fsExtra } from '@oumi/cli-shared-utils';

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

const loadCache = new Map();

const configFileName = '.racconfig.js';

export function readConfigFile(file: string, fileName = configFileName, force?: boolean) {
  if (!file) return null;

  if (!force) {
    const cachedValue = loadCache.get(file);
    if (cachedValue) {
      return cachedValue;
    }
  }

  const pkgFile = path.join(file, fileName);
  if (fsExtra.existsSync(pkgFile)) {
    const pkg = require(pkgFile);
    loadCache.set(file, pkg);
    return pkg;
  }
  return null;
}
