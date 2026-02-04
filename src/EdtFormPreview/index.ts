/**
 * EdtFormPreview - модуль для предпросмотра форм EDT
 * Использует Canvas рендеринг с LWT контролами
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FormXmlFileReader, FormXmlReaderResult } from './parsing/FormXmlFileReader';
import { Form } from './model/Form';

export { Form } from './model/Form';
export { FormXmlFileReader, FormXmlReaderResult } from './parsing/FormXmlFileReader';

// Экспорт LWT для внешнего использования
export * from './lwt';

/**
 * Парсит форму EDT из XML строки
 * @param xmlContent XML содержимое файла формы
 * @param version Версия платформы (например '8.3.24' или '8.5.1')
 * @returns Результат парсинга формы
 */
export function parseEdtForm(xmlContent: string, version: string = '8.3.24'): FormXmlReaderResult {
    const reader = new FormXmlFileReader();
    return reader.read(xmlContent, version);
}

/**
 * Менеджер WebView панелей для превью форм
 */
class EdtFormPreviewManager {
    private static instance: EdtFormPreviewManager;
    private panels: Map<string, vscode.WebviewPanel> = new Map();

    private constructor() {}

    static getInstance(): EdtFormPreviewManager {
        if (!EdtFormPreviewManager.instance) {
            EdtFormPreviewManager.instance = new EdtFormPreviewManager();
        }
        return EdtFormPreviewManager.instance;
    }

    getOrCreatePanel(
        formPath: string,
        title: string,
        extensionUri: vscode.Uri
    ): vscode.WebviewPanel {
        // Проверяем есть ли уже открытая панель для этой формы
        const existingPanel = this.panels.get(formPath);
        if (existingPanel) {
            existingPanel.reveal();
            return existingPanel;
        }

        // Создаём новую панель
        const panel = vscode.window.createWebviewPanel(
            'edtFormPreview',
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'out', 'webview'),
                    vscode.Uri.joinPath(extensionUri, 'resources')
                ]
            }
        );

        // Удаляем панель из кэша при закрытии
        panel.onDidDispose(() => {
            this.panels.delete(formPath);
        });

        this.panels.set(formPath, panel);
        return panel;
    }
}

/**
 * Предпросмотр формы EDT с Canvas рендерингом
 * @param confPath Путь к конфигурации
 * @param formPath Путь к файлу формы
 * @param extensionUri URI расширения
 * @param label Метка для заголовка
 */
export function previewEdtForm(
    confPath: string,
    formPath: string,
    extensionUri: vscode.Uri,
    label: string | undefined
): void {
    // Читаем XML файл формы
    let xmlContent: string;
    try {
        xmlContent = fs.readFileSync(formPath, 'utf-8');
    } catch (err) {
        vscode.window.showErrorMessage(`Не удалось прочитать файл формы: ${formPath}`);
        return;
    }

    // Парсим форму
    const result = parseEdtForm(xmlContent);

    if (result.errors.length > 0) {
        // Показываем ошибки парсинга
        vscode.window.showWarningMessage(
            `Форма распознана с ошибками: ${result.errors.length} ошибок`
        );
    }

    // Получаем или создаём WebView панель
    const manager = EdtFormPreviewManager.getInstance();
    const title = label ? `Предпросмотр: ${label}` : 'Предпросмотр формы EDT';
    const panel = manager.getOrCreatePanel(formPath, title, extensionUri);

    // Генерируем HTML с Canvas
    const webviewScriptUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'out', 'webview', 'edtFormPreview.js')
    );

    panel.webview.html = generateCanvasHtml(webviewScriptUri, result, label);

    // Обработка сообщений от WebView
    panel.webview.onDidReceiveMessage(
        (message) => {
            switch (message.type) {
                case 'ready':
                    // WebView готов, отправляем данные формы
                    console.log('[EXT] Sending form to WebView');
                    console.log('[EXT] form.items:', result.form.items?.length);
                    if (result.form.items) {
                        for (let i = 0; i < Math.min(result.form.items.length, 3); i++) {
                            const item = result.form.items[i] as any;
                            console.log(`[EXT] Item ${i}:`, item?.name, 'type:', item?.type, 'title:', JSON.stringify(item?.title));
                        }
                    }
                    console.log('[EXT] autoCommandBar:', result.form.autoCommandBar?.name, 'items:', (result.form.autoCommandBar as any)?.items?.length);
                    panel.webview.postMessage({
                        type: 'renderForm',
                        data: {
                            form: result.form,
                            options: { locale: 'ru' }
                        }
                    });
                    break;
                case 'renderComplete':
                    console.log('Form rendered:', message.data);
                    break;
                case 'error':
                    vscode.window.showErrorMessage(`Ошибка рендеринга: ${message.data}`);
                    break;
            }
        },
        undefined,
        []
    );

    // Обновляем тему при смене
    vscode.window.onDidChangeActiveColorTheme((theme) => {
        panel.webview.postMessage({
            type: 'setTheme',
            data: { dark: theme.kind === vscode.ColorThemeKind.Dark }
        });
    });
}

/**
 * Генерирует HTML с Canvas для рендеринга формы
 */
function generateCanvasHtml(
    scriptUri: vscode.Uri,
    result: FormXmlReaderResult,
    label: string | undefined
): string {
    const nonce = getNonce();
    const title = escapeHtml(label || 'Предпросмотр формы EDT');

    // Информация о форме для отладки
    const formInfo = result.form;
    const itemsCount = countItems(formInfo.items || []);
    const attributesCount = formInfo.attributes?.length || 0;
    const commandsCount = formInfo.formCommands?.length || 0;

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--vscode-editor-background, #1e1e1e);
            color: var(--vscode-editor-foreground, #cccccc);
        }
        .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
        .toolbar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            background: var(--vscode-titleBar-activeBackground, #3c3c3c);
            border-bottom: 1px solid var(--vscode-panel-border, #454545);
            font-size: 12px;
        }
        .toolbar-title {
            flex: 1;
            font-weight: 500;
        }
        .toolbar-info {
            color: var(--vscode-descriptionForeground, #8b8b8b);
        }
        .canvas-container {
            flex: 1;
            overflow: auto;
            position: relative;
        }
        #formCanvas {
            display: block;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--vscode-progressBar-background, #0e70c0);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .error-message {
            padding: 20px;
            background: var(--vscode-inputValidation-errorBackground, #5a1d1d);
            border: 1px solid var(--vscode-inputValidation-errorBorder, #be1100);
            border-radius: 4px;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="toolbar">
            <span class="toolbar-title">${title}</span>
            <span class="toolbar-info">
                Элементов: ${itemsCount} | 
                Реквизитов: ${attributesCount} | 
                Команд: ${commandsCount}
            </span>
        </div>
        <div class="canvas-container">
            <div class="loading" id="loading">
                <div class="loading-spinner"></div>
                <p style="margin-top: 10px;">Загрузка формы...</p>
            </div>
            <canvas id="formCanvas"></canvas>
        </div>
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

/**
 * Подсчитывает количество элементов рекурсивно
 */
function countItems(items: any[]): number {
    let count = items.length;
    for (const item of items) {
        if (item.items && Array.isArray(item.items)) {
            count += countItems(item.items);
        }
    }
    return count;
}

/**
 * Генерирует уникальный nonce для CSP
 */
function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Экранирует HTML спецсимволы
 */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
