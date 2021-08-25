'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = () => {
  const modelDb = require('../model/db').default;
  return async function model(ctx, next) {
    ctx.model = modelDb;
    await next();
  };
};
