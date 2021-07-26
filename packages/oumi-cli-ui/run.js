const server = require('./index');

const host = 'localhost';

server({ host, port: 9000 }, ({ port }) => {
  const url = `http://${host}:${port}`;
  console.log(url);
  console.log('success');
});
