const server = require('./index');

const host = 'localhost';
const port = 9000;

server({ host, port }, () => {
  const url = `http://${host}:${port}`;
  console.log(url);
  console.log('success');
});
