const path = require('path');
const fs = require('fs');

const publishVersion = [
  {
    name: '@oumi/cli-shared-utils',
    packagePath: path.resolve('./packages/cli-shared-utils/package.json'),
    version: '1.0.1'
  },
  {
    name: '@oumi/block-sdk',
    packagePath: path.resolve('./packages/block-sdk/package.json'),
    version: '1.0.0-beta'
  },
  {
    name: '@oumi/cli',
    packagePath: path.resolve('./packages/oumi-cli/package.json'),
    version: '1.0.1-beta'
  },
  {
    name: '@oumi/cli-ui',
    packagePath: path.resolve('./packages/oumi-cli-ui/package.json'),
    version: '1.0.1-beta'
  },
  {
    name: '@oumi/swagger-api',
    packagePath: path.resolve('./packages/oumi-swagger-api/package.json'),
    version: '1.0.0-beta'
  }
];

function writeJSON(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, '\t'), null, () => {});
}

publishVersion.forEach((item) => {
  const { packagePath, name, version } = item;
  const pkgJson = require(packagePath);

  // 更新版本号
  if (pkgJson.version !== version) {
    pkgJson.version = version;
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
        pkgJson.dependencies[depName] = `${prefix}${find.version}`;
      }
    });
  }

  writeJSON(packagePath, pkgJson);
});
