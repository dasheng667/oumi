const path = require('path');
const { fsExtra: fs, LRU, chalk, request, resolveModule, PackageManager } = require('@oumi/cli-shared-utils');
const progress = require('./progress');
const cwd = require('./cwd');
const folders = require('./folders');
const { log, resolveModuleRoot } = require('../utils/index');
const channels = require('./channels');

const PROGRESS_ID = 'dependency-installation';

// Caches
const metadataCache = new LRU({
  max: 200,
  maxAge: 1000 * 60 * 30 // 30 min.
});

// Local
let dependencies;

function runContext(data, context) {
  if (context) {
    context.pubsub.publish(channels.GET_PROJECT_DEPS, {
      data
    });
  }
}

function fetchPackage(id) {
  return request.getJSON(`https://registry.npm.taobao.org/${id}`);
}

async function getMetadata(id) {
  let metadata = metadataCache.get(id);
  if (metadata) {
    return metadata;
  }

  try {
    metadata = await fetchPackage(id);
  } catch (e) {
    // No connection?
  }

  if (metadata) {
    metadataCache.set(id, metadata);
    return metadata;
  }
  log('Dependencies', chalk.yellow("Can't load metadata"), id);
  return null;
}

function getPath({ id, file = cwd.get() }) {
  const filePath = resolveModule(path.join(id, 'package.json'), file);
  if (!filePath) return null;
  return resolveModuleRoot(filePath, id);
}

function isInstalled({ id, file = cwd.get() }) {
  const resolvedPath = getPath({ id, file });
  return resolvedPath && fs.existsSync(resolvedPath);
}

async function getDescription({ id }, context) {
  const metadata = await getMetadata(id, context);
  if (metadata) {
    return metadata.description;
  }
  return null;
}

function getAvatars(id, context) {
  return `https://avatars.dicebear.com/v2/identicon/${id}.svg`;
}

function invalidatePackage({ id, file }, context) {
  return folders.invalidatePackage(getPath({ id, file }), context);
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

function findOne(id, context) {
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

async function getProjectDeps(context) {
  const deps = list(cwd.get());
  // eslint-disable-next-line no-restricted-syntax
  for (const dep of deps) {
    // eslint-disable-next-line no-await-in-loop
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

    const pm = new PackageManager({ context: cwd.get() });
    await pm.add(arg, {
      tilde: true,
      dev: type === 'devDependencies'
    });

    list(cwd.get(), context);

    const { current, latest } = await getVersion(id);
    const find = findOne(id, context);

    return {
      ...find,
      current,
      latest,
      avatars: getAvatars(id)
    };
  });
}

function uninstall({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async (setProgress) => {
    setProgress({
      status: 'dependency-uninstall',
      args: [id]
    });

    const dep = findOne(id, context);

    const pm = new PackageManager({ context: cwd.get() });
    await pm.remove(id);

    return dep;
  });
}

function update({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async (setProgress) => {
    setProgress({
      status: 'dependency-update',
      args: [id]
    });

    const dep = findOne(id, context);
    const { current, wanted } = await getVersion(dep, context);

    const pm = new PackageManager({ context: cwd.get() });
    await pm.upgrade(id);

    invalidatePackage({ id }, context);

    return findOne(id);
  });
}

module.exports = {
  getProjectDeps,
  getVersion,
  install,
  uninstall,
  update
};
