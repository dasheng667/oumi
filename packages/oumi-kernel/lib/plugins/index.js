"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return {
        plugins: [
            // commands
            // require.resolve('./plugins/commands/build/build'),
            // require.resolve('./plugins/commands/config/config'),
            require.resolve('./plugins/commands/dev/dev'),
        ],
    };
}
exports.default = default_1;
