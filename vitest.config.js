"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        include: ['src/**/*.test.ts'],
        globals: true,
        testTimeout: 60000, // 60 секунд на тест (для большого количества форм)
    },
    resolve: {
        alias: {
            vscode: './src/__mocks__/vscode.ts',
        },
    },
});
//# sourceMappingURL=vitest.config.js.map