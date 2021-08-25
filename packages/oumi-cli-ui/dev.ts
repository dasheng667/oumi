import server from './src/index';

const host = 'localhost';

server({ host, port: 9000 }).then(({ port }) => {
  const url = `http://${host}:${port}`;
  console.log(url);
  console.log('success');
});
