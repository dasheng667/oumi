#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const { yParser, fork, resolvePkg, getCwd } = require('@oumi/cli-shared-utils');
// const { Kernel } = require('@oumi/kernel');
// const plugins = require('../lib/plugins');

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
});

const name = args._[0];

// console.log('args', args, name);

(async () => {
  if (!name) {
    if (args.v || args.V) {
      console.log(getPkgVersion());
    } else {
      console.log('Usage: oumi <command> [options]');
      console.log();
      console.log('Options:');
      console.log('  -v, --version       output the version number');
      console.log('  -h, --help          output usage information');
      console.log();
      console.log('Commands:');
      console.log('  ui                  Front end GUI Project Manager');
      console.log('  init [projectName]  Init a project with default template');
      console.log('  create              Create page for project');
      console.log('  help [cmd]          display help for [cmd]');
    }
    return;
  }

  switch (name) {
    case 'ui':
      {
        const { port, host } = args;
        require('../lib/ui')({ port, host });
      }
      break;

    // case 'dev':
    //   {
    //     const child = fork({
    //       scriptPath: require.resolve('../lib/forkedDev')
    //     });

    //     process.on('SIGINT', () => {
    //       child.kill('SIGINT');
    //       process.exit(0);
    //     });

    //     process.on('SIGTERM', () => {
    //       child.kill('SIGTERM');
    //       process.exit(1);
    //     });
    //   }
    //   break;

    // default:
    //   {
    //     if (name === 'build') {
    //       process.env.NODE_ENV = 'production';
    //     }

    //     const kernel = new Kernel({
    //       appPath: getCwd(),
    //       pkg: resolvePkg(process.cwd()),
    //       presets: [...plugins.default().plugins]
    //     });

    //     await kernel.run({
    //       name,
    //       args
    //     });
    //   }
    //   break;

    default:
      {
        const msg = '待开发中...';
        console.log(`${name} ${msg}`);
      }
      break;
  }
})();

function getPkgVersion() {
  return require(path.join('../', 'package.json')).version;
}
