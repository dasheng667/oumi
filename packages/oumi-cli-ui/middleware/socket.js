/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');

const resolve = (dir) => {
  return path.resolve(__dirname, '../', dir);
};

function addSockets(socket, app, dir) {
  const files = fs.readdirSync(resolve(dir));
  const js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (const f of js_files) {
    const socketFile = require(resolve(`${dir}/${f}`));
    socketFile(socket, app);
  }
}

module.exports = (io, app) => {
  io.on('connection', (socket) => {
    // console.log('socket connected!');
    addSockets(socket, app, 'socket');
  });

  io.on('error', (error) => {
    throw new Error(error);
  });

  return async function model(ctx, next) {
    await next();
  };
};
