#!/usr/bin/env node

const program = require('commander');

program
  .command('ui')
  .description('start and open the oumi ui')
  .option('-H, --host <host>', 'Host used for the UI server (default: localhost)')
  .option('-p, --port <port>', 'Port used for the UI server (by default search for available port)')
  .option('-D, --dev', 'Run in dev mode')
  .action((options) => {
    // eslint-disable-next-line global-require
    require('../lib/ui')(options);
  });

program.parse(process.argv);
