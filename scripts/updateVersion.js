const path = require('path');
const fs = require('fs');

const publishVersion = [
  {
    name: '@oumi/cli-shared-utils',
    packagePath: path.resolve('./packages/cli-shared-utils/package.json'),
    version: '1.4.0'
  },
  {
    name: '@oumi/block-sdk',
    packagePath: path.resolve('./packages/block-sdk/package.json'),
    version: '1.1.0'
  },
  {
    name: '@oumi/cli',
    packagePath: path.resolve('./packages/oumi-cli/package.json'),
    version: '1.5.1'
  },
  {
    name: '@oumi/cli-ui',
    packagePath: path.resolve('./packages/oumi-cli-ui/package.json'),
    version: '1.5.1'
  },
  {
    name: '@oumi/swagger-api',
    packagePath: path.resolve('./packages/oumi-swagger-api/package.json'),
    version: '1.3.0'
  }
];

function writeJSON(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, () => {});
}

publishVersion.forEach((item) => {
  const { packagePath, name, version } = item;
  const pkgJson = require(packagePath);
  let flags = false;

  // 更新版本号
  if (pkgJson.version !== version) {
    pkgJson.version = version;
    flags = true;
  }

  // 更新依赖
  if (pkgJson.dependencies) {
    Object.keys(pkgJson.dependencies).forEach((depName) => {
      let depVersion = pkgJson.dependencies[depName];
      let prefix = '';
      const is = depVersion.startsWith('^') || depVersion.startsWith('~');
      if (is) {
        prefix = depVersion.substr(0, 1);
        depVersion = depVersion.substr(1);
      }
      const find = publishVersion.find((p) => p.name === depName);
      if (find && depVersion !== find.version) {
        flags = true;
        pkgJson.dependencies[depName] = `${prefix}${find.version}`;
      }
    });
  }

  if (flags) {
    writeJSON(packagePath, pkgJson);
  }
});
