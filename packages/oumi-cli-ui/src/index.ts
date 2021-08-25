import path from 'path';
import fs from 'fs';
import Koa from 'koa';
import body from 'koa-bodyparser';
import koaStatic from 'koa-static';
import portfinder from 'portfinder';
import IO from 'koa-socket-2';

import controller from './middleware/controllers';
import socket from './middleware/socket';
import cors from './middleware/cors';
import model from './middleware/model';
import extend from './middleware/extends';

// const { ApolloServer } = from 'apollo-server-koa';
// const typeDefs = from './apollo-server/type-defs';
// const resolvers = from './apollo-server/resolvers';

interface IProps {
  host: string;
  port: number;
}

const pathJoin = (p: string) => {
  return path.join(__dirname, '../', p);
};

export default async (options: IProps): Promise<{ port: number }> => {
  const { port } = options;

  // const server = new ApolloServer({ typeDefs, resolvers });
  // await server.start();

  const app = new Koa();
  const io = new IO({
    ioOptions: {
      cors: {
        origin: '*'
      }
    }
  });
  // server.applyMiddleware({ app });

  app.use(cors());
  app.use(extend());
  app.use(body());
  app.use(koaStatic(pathJoin('/public/assets')));
  app.use(koaStatic(pathJoin('/public')));
  app.use(model());

  io.attach(app);
  app.use(socket(io, app));

  app.use(controller());

  app.use(async (ctx, next) => {
    await next();
    if (!ctx.request.url.startsWith('/api')) {
      ctx.type = 'text/html';
      ctx.body = fs.readFileSync(pathJoin('/public/index.html'));
    }
  });

  return new Promise((resolve, reject) => {
    portfinder.basePort = port;
    portfinder.getPort((err: any, port2: number) => {
      if (err) {
        reject(err);
      } else {
        app.listen({ port: port2 });
        resolve({ port: port2 });
      }
    });
  });
};
