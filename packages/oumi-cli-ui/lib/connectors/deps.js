'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.setup =
  exports.update =
  exports.uninstall =
  exports.install =
  exports.getProjectDeps =
  exports.getVersion =
    void 0;
const path_1 = __importDefault(require('path'));
const cli_shared_utils_1 = require('@oumi/cli-shared-utils');
const progress = __importStar(require('./progress'));
const cwd_1 = __importDefault(require('./cwd'));
const folders = __importStar(require('./folders'));
const index_1 = require('../utils/index');
const channels_1 = __importDefault(require('./channels'));
const PROGRESS_ID = 'dependency-installation';
const metadataCache = new cli_shared_utils_1.LRU({
  max: 200,
  maxAge: 1000 * 60 * 30
});
let dependencies = [];
function runContext(data, context) {
  if (context) {
    context.pubsub.publish(channels_1.default.GET_PROJECT_DEPS, {
      data
    });
  }
}
function fetchPackage(id) {
  return cli_shared_utils_1.request.getJSON(`https://registry.npm.taobao.org/${id}`);
}
async function getMetadata(id) {
  let metadata = metadataCache.get(id);
  if (metadata) {
    return metadata;
  }
  try {
    metadata = await fetchPackage(id);
  } catch (e) {}
  if (metadata) {
    metadataCache.set(id, metadata);
    return metadata;
  }
  index_1.log('Dependencies', cli_shared_utils_1.chalk.yellow("Can't load metadata"), id);
  return null;
}
function getPath({ id, file = cwd_1.default.get() }) {
  const filePath = cli_shared_utils_1.resolveModule(path_1.default.join(id, 'package.json'), file);
  if (!filePath) return null;
  return index_1.resolveModuleRoot(filePath, id);
}
function isInstalled({ id, file = cwd_1.default.get() }) {
  const resolvedPath = getPath({ id, file });
  return resolvedPath && cli_shared_utils_1.fsExtra.existsSync(resolvedPath);
}
function getAvatars(id) {
  return `https://avatars.dicebear.com/v2/identicon/${id}.svg`;
}
function invalidatePackage({ id, file }) {
  return folders.invalidatePackage(getPath({ id, file }));
}
function getLink({ id, file }, context) {
  const pkg = folders.readPackage(file, context);
  if (!pkg) return '';
  return (
    pkg.homepage || (pkg.repository && pkg.repository.url) || `https://www.npmjs.com/package/${id.replace('/', '%2F')}`
  );
}
function findDependencies(deps, type, file, context) {
  return Object.keys(deps).map((id) => ({
    id,
    versionRange: deps[id],
    installed: isInstalled({ id, file }),
    website: getLink({ id, file }, context),
    type,
    baseFir: file
  }));
}
function list(file, context) {
  const pkg = folders.readPackage(file, context);
  if (!pkg) return [];
  dependencies = [];
  dependencies = dependencies.concat(findDependencies(pkg.devDependencies || {}, 'devDependencies', file, context));
  dependencies = dependencies.concat(findDependencies(pkg.dependencies || {}, 'dependencies', file, context));
  return dependencies;
}
function findOne(id) {
  return dependencies.find((p) => p.id === id);
}
async function getVersion(id, version) {
  let current = version;
  let latest;
  try {
    const metadata = await getMetadata(id);
    if (metadata && metadata['dist-tags']) {
      latest = metadata['dist-tags'].latest;
      if (!current) {
        current = latest;
      }
    } else if (current) {
      latest = current;
    }
  } catch (e) {
    console.error(e);
    latest = current;
  }
  if (typeof current === 'string' && current.startsWith('http')) {
    const index = current.indexOf('#');
    if (index > -1) {
      current = current.substr(index + 1);
      latest = current;
    }
  }
  if (typeof current === 'string' && !/\d/.test(current.substr(0, 1))) {
    current = current.substr(1);
  }
  return {
    current,
    latest
  };
}
exports.getVersion = getVersion;
async function getProjectDeps(context) {
  const deps = list(cwd_1.default.get());
  for (const dep of deps) {
    const { current, latest } = await getVersion(dep.id, dep.versionRange);
    const avatars = getAvatars(dep.id);
    const data = {
      ...dep,
      avatars,
      current,
      latest
    };
    runContext(data, context);
  }
}
exports.getProjectDeps = getProjectDeps;
function install({ id, type, range }, context) {
  return progress.wrap(PROGRESS_ID, context, async (setProgress) => {
    setProgress({
      status: 'dependency-install',
      args: [id]
    });
    let arg;
    if (range) {
      arg = `${id}@${range}`;
    } else {
      arg = id;
    }
    const pm = new cli_shared_utils_1.PackageManager({ context: cwd_1.default.get() });
    await pm.add(arg, {
      tilde: true,
      dev: type === 'devDependencies'
    });
    list(cwd_1.default.get(), context);
    const { current, latest } = await getVersion(id);
    const find = findOne(id);
    return {
      ...find,
      current,
      latest,
      avatars: getAvatars(id)
    };
  });
}
exports.install = install;
function uninstall({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async (setProgress) => {
    setProgress({
      status: 'dependency-uninstall',
      args: [id]
    });
    const dep = findOne(id);
    const pm = new cli_shared_utils_1.PackageManager({ context: cwd_1.default.get() });
    await pm.remove(id);
    return dep;
  });
}
exports.uninstall = uninstall;
function update({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async (setProgress) => {
    setProgress({
      status: 'dependency-update',
      args: [id]
    });
    const pm = new cli_shared_utils_1.PackageManager({ context: cwd_1.default.get() });
    await pm.upgrade(id);
    invalidatePackage({ id, file: '' });
    return findOne(id);
  });
}
exports.update = update;
function setup(context) {
  const fun = index_1.throttle((value) => {
    progress.set({ id: PROGRESS_ID, progress: value }, context);
  }, 100);
  cli_shared_utils_1.progress.on('progress', (value) => {
    if (progress.get(PROGRESS_ID)) {
      fun(value);
    }
  });
}
exports.setup = setup;
