const { log, error, openBrowser } = require('@oumi/cli-shared-utils');
const server = require('@oumi/cli-ui').default;

interface Options {
  host?: string;
  port?: number;
}

const ui = (options: Options = {}, context = process.cwd()) => {
  const host = options.host || 'localhost';
  const port = options.port || 9000;

  log(`🚀  Starting Oumi UI...`);

  server({ host, port }).then(({ port: port2 }: { port: string }) => {
    const url = `http://${host}:${port2}`;
    log(`🌠  Ready on ${url}`);
    openBrowser(url);
  });
};

module.exports = (...args: any) => {
  return ui(...args);
};
