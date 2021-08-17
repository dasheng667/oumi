const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const body = require('koa-bodyparser');
const koaStatic = require('koa-static');
// const { ApolloServer } = require('apollo-server-koa');
const portfinder = require('portfinder');
const IO = require('koa-socket-2');

const controller = require('./middleware/controllers');
const socket = require('./middleware/socket');
const cors = require('./middleware/cors');
const model = require('./middleware/model');
const extend = require('./middleware/extends');
// const typeDefs = require('./apollo-server/type-defs');
// const resolvers = require('./apollo-server/resolvers');

module.exports = async (options, cb = null) => {
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
  app.use(koaStatic(`${__dirname}/public/assets`));
  app.use(koaStatic(`${__dirname}/public`));
  app.use(model());

  io.attach(app);
  app.use(socket(io, app));

  app.use(controller());

  app.use(async (ctx, next) => {
    await next();
    if (!ctx.request.url.startsWith('/api')) {
      ctx.type = 'text/html';
      ctx.body = fs.readFileSync(path.resolve(__dirname, './public/index.html'));
    }
  });

  await new Promise((resolve) => {
    portfinder.basePort = port;
    portfinder.getPort((err, port2) => {
      if (err) {
        throw new Error(err);
      } else {
        app.listen({ port: port2 }, resolve);
        cb({ port: port2 });
      }
    });
  });

  return { app };
};
