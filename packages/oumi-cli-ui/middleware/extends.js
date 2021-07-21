/* eslint-disable @typescript-eslint/no-unused-expressions */

module.exports = (opt) => {
  return async function extend(ctx, next) {
    ctx.returnSuccess = (data, options) => {
      ctx.set('Content-Type', 'application/json');
      ctx.body = { code: 200, data, success: true, ...options };
    };

    ctx.returnError = (options) => {
      let msg = '';
      if (typeof options === 'string') {
        msg = options;
        // eslint-disable-next-line no-param-reassign
        options = {};
      } else {
        msg = options.message || '服务繁忙，请稍后再试~';
      }
      ctx.set('Content-Type', 'application/json');
      ctx.body = { code: -1, success: false, msg, ...options };
    };

    await next();
  };
};
