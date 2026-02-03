/**
 * EdtFormPreview - модуль для предпросмотра форм EDT
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import { FormXmlFileReader, FormXmlReaderResult } from './parsing/FormXmlFileReader';

export { Form } from './model/Form';
export { FormXmlFileReader, FormXmlReaderResult } from './parsing/FormXmlFileReader';

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
 * Предпросмотр формы EDT
 * @param confPath Путь к конфигурации
 * @param formPath Путь к файлу формы
 * @param extensionUri URI расширения
 * @param label Метка для заголовка
 */
export function previewEdtForm(confPath: string, formPath: string, extensionUri: vscode.Uri, label: string | undefined): void {
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

    // Создаем WebView панель
    const panel = vscode.window.createWebviewPanel(
        'edtFormPreview',
        label || 'Предпросмотр формы EDT',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [extensionUri]
        }
    );

    // Генерируем HTML
    panel.webview.html = generateFormHtml(result, label);
}

/**
 * Генерирует HTML для предпросмотра формы
 */
function generateFormHtml(result: FormXmlReaderResult, label: string | undefined): string {
    const form = result.form;
    
    let content = '';
    
    if (result.errors.length > 0) {
        content = `<div class="error">
            <h3>Ошибки при парсинге формы:</h3>
            <ul>${result.errors.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>
        </div>`;
    } else {
        // Заголовок формы
        let titleHtml = '';
        if (form.title) {
            const titleText = typeof form.title === 'string' ? form.title : getLocalizedValue(form.title);
            titleHtml = `<h2 class="form-title">${escapeHtml(titleText)}</h2>`;
        }
        
        // Реквизиты формы
        let attributesHtml = '';
        if (form.attributes && form.attributes.length > 0) {
            attributesHtml = `<div class="form-attributes">
                <h4>Реквизиты (${form.attributes.length})</h4>
                <ul>${form.attributes.map(attr => `<li>${escapeHtml(attr.name || '')}</li>`).join('')}</ul>
            </div>`;
        }
        
        // Элементы формы
        let itemsHtml = '';
        if (form.items && form.items.length > 0) {
            itemsHtml = `<div class="form-items">
                <h4>Элементы формы (${form.items.length})</h4>
                ${renderFormItems(form.items)}
            </div>`;
        }
        
        // Команды формы
        let commandsHtml = '';
        if (form.formCommands && form.formCommands.length > 0) {
            commandsHtml = `<div class="form-commands">
                <h4>Команды (${form.formCommands.length})</h4>
                <ul>${form.formCommands.map(cmd => `<li>${escapeHtml(cmd.name || '')}</li>`).join('')}</ul>
            </div>`;
        }
        
        content = `<div class="edt-form-preview">
            ${titleHtml}
            ${attributesHtml}
            ${itemsHtml}
            ${commandsHtml}
        </div>`;
    }
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(label || 'Предпросмотр формы EDT')}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .error { 
            color: #cc0000; 
            background: #ffeeee; 
            padding: 15px; 
            border-radius: 4px; 
        }
        .error h3 { margin-top: 0; }
        .edt-form-preview { }
        .form-title { margin-bottom: 20px; }
        .form-attributes, .form-items, .form-commands {
            margin-bottom: 20px;
            padding: 10px;
            background: var(--vscode-sideBar-background);
            border-radius: 4px;
        }
        h4 { margin-top: 0; color: var(--vscode-textLink-foreground); }
        ul { margin: 0; padding-left: 20px; }
        li { padding: 2px 0; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
}

/**
 * Рендерит элементы формы рекурсивно
 */
function renderFormItems(items: any[], level: number = 0): string {
    let html = `<ul style="margin-left: ${level * 20}px;">`;

    for (const item of items) {
        const name = item.name || 'Unknown';
        html += `<li>${escapeHtml(name)}`;

        // Рекурсивно для дочерних элементов
        if (item.items && Array.isArray(item.items) && item.items.length > 0) {
            html += renderFormItems(item.items, level + 1);
        }

        html += `</li>`;
    }

    html += `</ul>`;
    return html;
}

/**
 * Получает значение из локализованной строки
 */
function getLocalizedValue(localized: Record<string, string>): string {
    if (!localized) return '';
    // Предпочтение русскому языку, затем английскому, затем первому доступному
    return localized['ru'] || localized['en'] || Object.values(localized)[0] || '';
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
