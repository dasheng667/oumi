"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMiddleware(opt) {
    const options = opt || {};
    const defaults = {
        origin: true,
        methods: 'GET,HEAD,PUT,POST,DELETE'
    };
    Object.keys(defaults).forEach((key) => {
        if (!options.hasOwnProperty(key)) {
            options[key] = defaults[key];
        }
    });
    if (Array.isArray(options.expose)) {
        options.expose = options.expose.join(',');
    }
    if (typeof options.maxAge === 'number') {
        options.maxAge = options.maxAge.toString();
    }
    else {
        options.maxAge = null;
    }
    if (Array.isArray(options.methods)) {
        options.methods = options.methods.join(',');
    }
    if (Array.isArray(options.headers)) {
        options.headers = options.headers.join(',');
    }
    return async function cors(ctx, next) {
        let origin;
        if (typeof options.origin === 'string') {
            origin = options.origin;
        }
        else if (options.origin === true) {
            origin = ctx.get('origin') || '*';
        }
        else if (options.origin === false) {
            origin = options.origin;
        }
        else if (typeof options.origin === 'function') {
            origin = options.origin(ctx.request);
        }
        if (origin === false)
            return;
        ctx.set('Access-Control-Allow-Origin', origin);
        if (options.expose) {
            ctx.set('Access-Control-Expose-Headers', options.expose);
        }
        if (options.maxAge) {
            ctx.set('Access-Control-Max-Age', options.maxAge);
        }
        if (options.credentials === true) {
            ctx.set('Access-Control-Allow-Credentials', 'true');
        }
        ctx.set('Access-Control-Allow-Methods', options.methods);
        let headers;
        if (options.headers) {
            headers = options.headers;
        }
        else {
            headers = ctx.get('access-control-request-headers');
        }
        if (headers) {
            ctx.set('Access-Control-Allow-Headers', headers);
        }
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204;
        }
        await next();
    };
}
exports.default = getMiddleware;
