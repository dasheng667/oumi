const { log, error, openBrowser } = require('@oumi/cli-shared-utils');
const server = require('@oumi/cli-ui');

const ui = (options = {}, context = process.cwd()) => {
  const host = options.host || 'localhost';
  const port = options.port || 9000;

  log(`🚀  Starting Oumi UI...`);

  server({ host, port }, () => {
    const url = `http://${host}:${port}`;
    log(`🌠  Ready on ${url}`);
    openBrowser(url);
  });
};

module.exports = (...args) => {
  return ui(...args);
};
