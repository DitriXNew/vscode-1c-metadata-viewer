import { defineConfig } from 'vitest/config';

export default defineConfig({
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
