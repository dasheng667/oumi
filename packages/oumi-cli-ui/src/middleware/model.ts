import type { Next, Context } from '../../typings/index';

export default () => {
  const modelDb = require('../model/db').default;

  return async function model(ctx: Context, next: Next) {
    ctx.model = modelDb;
    await next();
  };
};
