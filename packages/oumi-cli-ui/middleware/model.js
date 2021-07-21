module.exports = (options) => {
  const modelDb = require('../db/modelDb');

  return async function model(ctx, next) {
    ctx.model = modelDb;
    await next();
  };
};
