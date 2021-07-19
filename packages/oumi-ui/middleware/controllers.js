/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');

const resolve = (dir) => {
  return path.resolve(__dirname, '../', dir);
};

function addMapping(router, mapping) {
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      const path1 = url.substring(4);
      router.get(path1, mapping[url]);
    } else if (url.startsWith('POST ')) {
      const path2 = url.substring(5);
      router.post(path2, mapping[url]);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router, dir) {
  const files = fs.readdirSync(resolve(dir));
  const js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (const f of js_files) {
    const mapping = require(resolve(`${dir}/${f}`));
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  const controllers_dir = dir || 'controllers';
  const router = require('koa-router')();
  addControllers(router, controllers_dir);
  return router.routes();
};
