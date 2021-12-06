#!/usr/bin/env node
/* eslint-disable no-console */

const path = require('path');
const { yParser, fork } = require('@oumi/cli-shared-utils');

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

    case 'dev':
      {
        const child = fork({
          scriptPath: require.resolve('../lib/forkedDev')
        });

        process.on('SIGINT', () => {
          child.kill('SIGINT');
          process.exit(0);
        });

        process.on('SIGTERM', () => {
          child.kill('SIGTERM');
          process.exit(1);
        });
      }
      break;

    default:
      console.log('default name');
  }
})();

function getPkgVersion() {
  return require(path.join('../', 'package.json')).version;
}
