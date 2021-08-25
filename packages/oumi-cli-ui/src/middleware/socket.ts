/* eslint-disable no-restricted-syntax */
import type Koa from 'koa';
import path from 'path';
import fs from 'fs';
import type { Context, Next, IOServer } from '../../typings/index';

const resolve = (dir: string) => {
  return path.resolve(__dirname, '../', dir);
};

function addSockets(socket: any, app: any, dir: string) {
  const files = fs.readdirSync(resolve(dir));
  const js_files = files.filter((f) => {
    return f.endsWith('.ts') || f.endsWith('.js');
  });

  for (const f of js_files) {
    const socketFile = require(resolve(`${dir}/${f}`)).default;
    socketFile(socket, app);
  }
}

export default (io: IOServer, app: Koa) => {
  io.on('connection', (socket: any) => {
    // console.log('socket connected!');
    addSockets(socket, app, 'socket');
  });

  io.on('error', (error: any) => {
    throw new Error(error);
  });

  return async function model(ctx: Context, next: Next) {
    await next();
  };
};
