const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const body = require('koa-bodyparser');
const koaStatic = require('koa-static');
const { ApolloServer } = require('apollo-server-koa');

const controller = require('./middleware/controllers');
const cors = require('./middleware/cors');
const model = require('./middleware/model');
const extend = require('./middleware/extends');
const typeDefs = require('./apollo-server/type-defs');
const resolvers = require('./apollo-server/resolvers');

module.exports = async (options, cb = null) => {
  const { port } = options;

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = new Koa();
  server.applyMiddleware({ app });

  app.use(cors());
  app.use(extend());
  app.use(body());
  app.use(koaStatic(`${__dirname}/public/assets`));
  app.use(koaStatic(`${__dirname}/public`));
  app.use(model());
  app.use(controller());

  app.use(async (ctx, next) => {
    await next();
    if (!ctx.request.url.startsWith('/api')) {
      ctx.type = 'text/html';
      ctx.body = fs.readFileSync(path.resolve(__dirname, './public/index.html'));
    }
  });

  await new Promise((resolve) => {
    app.listen({ port }, resolve);
    cb();
  });

  return { server, app };
};
