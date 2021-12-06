"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api) => {
    api.registerCommand({
        name: 'dev',
        async fn({ args }) {
            console.log('dev.args', args);
        }
    });
};
