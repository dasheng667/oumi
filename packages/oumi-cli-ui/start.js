const server = require('./lib/src');

const host = 'localhost';

server.default({ host, port: 9000 }).then(({ port }) => {
  const url = `http://${host}:${port}`;
  console.log(url);
  console.log('start...');
});
