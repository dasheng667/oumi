/* eslint-disable no-param-reassign */
const { lodash } = require('@oumi/cli-shared-utils');

exports.getBabelOpts = function (opts) {
  const { nodeEnv } = opts;
  const isDev = nodeEnv === 'development';

  const options = lodash.merge(
    {
      isDev,
      typescript: true,
      env: {
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
      },
      dynamicImportNode: true,
      react: {
        development: isDev,
      },
      transformRuntime: {},
      reactRemovePropTypes: nodeEnv === 'production',
      reactRequire: true,
      lockCoreJS3: {},
    },
    opts,
  );

  const preset = require('./preset').preset(options);

  return {
    ...preset,
    cacheDirectory: true
  };
};
