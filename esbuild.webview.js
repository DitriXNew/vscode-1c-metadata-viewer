/**
 * Скрипт сборки WebView бандла для EdtFormPreview
 * Использует esbuild для создания браузерного бандла
 */

const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

async function build() {
    const config = {
        entryPoints: [path.resolve(__dirname, 'src/EdtFormPreview/webview/formPreviewWebview.ts')],
        bundle: true,
        outfile: path.resolve(__dirname, 'out/webview/edtFormPreview.js'),
        platform: 'browser',
        target: ['es2020', 'chrome89'],
        format: 'iife',
        minify: !isWatch,
        sourcemap: isWatch,
        define: {
            'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
        },
        external: [],
        // Polyfills для Node.js модулей которые не нужны в браузере
        alias: {
            'fs': path.resolve(__dirname, 'src/EdtFormPreview/webview/polyfills/fs.ts'),
            'path': path.resolve(__dirname, 'src/EdtFormPreview/webview/polyfills/path.ts'),
        },
        logLevel: 'info'
    };

    if (isWatch) {
        const ctx = await esbuild.context(config);
        await ctx.watch();
        console.log('Watching for changes...');
    } else {
        await esbuild.build(config);
        console.log('Build complete!');
    }
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});
