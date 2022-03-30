const { lodash } = require('@oumi/cli-shared-utils');
const { dirname } = require('path');

const { merge } = lodash;

function toObject(obj) {
  return typeof obj === 'object' ? obj : {};
}

exports.preset = (opts = {}) => {
  const defaultEnvConfig = {
    exclude: [
      'transform-typeof-symbol',
      'transform-unicode-regex',
      'transform-sticky-regex',
      'transform-new-target',
      'transform-modules-umd',
      'transform-modules-systemjs',
      'transform-modules-amd',
      'transform-literals'
    ]
  };

  const preset = {
    presets: [
      opts.env && [
        require('../compiled/babel/preset-env'),
        {
          ...lodash.merge(defaultEnvConfig, toObject(opts.env)),
          debug: opts.debug,
        },
      ],
      opts.react && [
        require('../compiled/babel/preset-react'),
        toObject(opts.react),
      ],
      opts.typescript && [
        require('../compiled/babel/preset-typescript'),
        {
          // https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support
          allowNamespaces: true,
        },
      ],
    ].filter(Boolean),
    plugins: [
      // https://github.com/webpack/webpack/issues/10227
      [
        require('../compiled/babel/plugin-proposal-optional-chaining')
          .default,
        { loose: false },
      ],
      // https://github.com/webpack/webpack/issues/10227
      [
        require('../compiled/babel/plugin-proposal-nullish-coalescing-operator')
          .default,
        { loose: false },
      ],
      require('../compiled/babel/plugin-syntax-top-level-await')
        .default,
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      [
        require('../compiled/babel/plugin-transform-destructuring')
          .default,
        { loose: false },
      ],
      // https://www.npmjs.com/package/babel-plugin-transform-typescript-metadata#usage
      // should be placed before @babel/plugin-proposal-decorators.
      opts.typescript && [
        require.resolve(
          '../compiled/babel/babel-plugin-transform-typescript-metadata',
        ),
      ],
      [
        require('../compiled/babel/plugin-proposal-decorators')
          .default,
        { legacy: true },
      ],
      [
        require('../compiled/babel/plugin-proposal-class-properties')
          .default,
        { loose: true },
      ],
      require('../compiled/babel/plugin-proposal-export-default-from')
        .default,
      [
        require('../compiled/babel/plugin-proposal-pipeline-operator')
          .default,
        {
          proposal: 'minimal',
        },
      ],
      require('../compiled/babel/plugin-proposal-do-expressions')
        .default,
      require('../compiled/babel/plugin-proposal-function-bind')
        .default,
      require('../compiled/babel/plugin-proposal-logical-assignment-operators')
        .default,
      opts.transformRuntime && [
        require('../compiled/babel/plugin-transform-runtime').default,
        {
          version: require('@babel/runtime/package.json').version,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#absoluteruntime
          // lock the version of @babel/runtime
          // make sure we are using the correct version
          absoluteRuntime: dirname(
            require.resolve('@babel/runtime/package.json'),
          ),
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          useESModules: true,
          ...toObject(opts.transformRuntime),
        },
      ],
      opts.reactRemovePropTypes && [
        require.resolve(
          '../compiled/babel/babel-plugin-transform-react-remove-prop-types',
        ),
        {
          removeImport: true,
        },
      ],
      opts.reactRequire && [
        require.resolve(
          '../compiled/babel/babel-plugin-react-require',
        ),
      ],
      opts.dynamicImportNode && [
        require.resolve(
          '../compiled/babel/babel-plugin-dynamic-import-node',
        ),
      ],
      opts.svgr && [
        require.resolve(
          '../compiled/babel/babel-plugin-named-asset-import',
        ),
        {
          loaderMap: {
            svg: {
              ReactComponent: `${require.resolve(
                '../compiled/babel/svgr-webpack',
              )}?-svgo,+titleProp,+ref![path]`,
            },
          },
        },
      ],
      ...(opts.import
        ? opts.import.map((importOpts) => {
            return [
              require.resolve('../compiled/babel/babel-plugin-import'),
              importOpts,
              importOpts.libraryName,
            ];
          })
        : []),
      // opts.autoCSSModules && [
      //   require.resolve('babel-plugin-auto-css-modules'),
      // ],
    ].filter(Boolean),
  };

  return opts.modify ? opts.modify(preset) : preset;
};
