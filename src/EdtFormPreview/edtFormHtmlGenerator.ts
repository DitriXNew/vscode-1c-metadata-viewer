/**
 * Генератор HTML для предпросмотра EDT форм
 * Поддерживает тёмную и светлую темы
 */

import {
  EdtForm,
  FormItem,
  FormField,
  FormGroup,
  FormTable,
  FormDecoration,
  FormButton,
  LocalizedString
} from './edtFormInterfaces';

export type ThemeMode = 'dark' | 'light';

export class EdtFormHtmlGenerator {
  private theme: ThemeMode;
  private picturesBasePath: string;

  constructor(theme: ThemeMode = 'light', picturesBasePath: string = '') {
    this.theme = theme;
    this.picturesBasePath = picturesBasePath;
  }

  /**
   * Генерирует полный HTML для предпросмотра формы
   */
  generateHtml(form: EdtForm): string {
    const content = this.generateFormContent(form);
    const styles = this.generateStyles();
    const scripts = this.generateScripts();

    return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EDT Form Preview</title>
  <style>${styles}</style>
</head>
<body class="theme-${this.theme}">
  <div class="form-window">
    <div class="form-header">
      <span class="form-title">${this.getLocalizedString(form.title) || 'Форма'}</span>
    </div>
    <div class="form-content">
      ${content}
    </div>
  </div>
  <script>${scripts}</script>
</body>
</html>`;
  }

  /**
   * Генерирует CSS стили с поддержкой тем
   */
  private generateStyles(): string {
    return `
      :root {
        --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        --font-size: 13px;
        --border-radius: 3px;
        --transition: all 0.2s ease;
      }

      /* Светлая тема */
      .theme-light {
        --bg-primary: #ffffff;
        --bg-secondary: #f5f5f5;
        --bg-tertiary: #e8e8e8;
        --bg-header: #bfcddb;
        --text-primary: #1e1e1e;
        --text-secondary: #666666;
        --text-muted: #888888;
        --text-link: #0066cc;
        --border-color: #d0d0d0;
        --border-color-light: #e0e0e0;
        --input-bg: #ffffff;
        --input-border: #a0a0a0;
        --button-bg: #f0f0f0;
        --button-border: #a0a0a0;
        --group-title-color: #009690;
        --table-header-bg: #efefef;
        --table-row-hover: #f8f8f8;
        --tab-active-bg: #ffffff;
        --tab-inactive-bg: #efefef;
        --tooltip-color: #807a59;
        --shadow-color: rgba(0, 0, 0, 0.1);
      }

      /* Тёмная тема */
      .theme-dark {
        --bg-primary: #1e1e1e;
        --bg-secondary: #252526;
        --bg-tertiary: #2d2d2d;
        --bg-header: #3c3c3c;
        --text-primary: #cccccc;
        --text-secondary: #999999;
        --text-muted: #666666;
        --text-link: #4fc1ff;
        --border-color: #454545;
        --border-color-light: #3c3c3c;
        --input-bg: #3c3c3c;
        --input-border: #555555;
        --button-bg: #3c3c3c;
        --button-border: #555555;
        --group-title-color: #4ec9b0;
        --table-header-bg: #2d2d2d;
        --table-row-hover: #2a2d2e;
        --tab-active-bg: #1e1e1e;
        --tab-inactive-bg: #2d2d2d;
        --tooltip-color: #9d9d9d;
        --shadow-color: rgba(0, 0, 0, 0.3);
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body {
        font-family: var(--font-family);
        font-size: var(--font-size);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        line-height: 1.4;
      }

      /* Окно формы */
      .form-window {
        max-width: 960px;
        margin: 10px auto;
        background-color: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: 0 2px 8px var(--shadow-color);
      }

      .form-header {
        height: 28px;
        background-color: var(--bg-header);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
      }

      .form-title {
        font-weight: 500;
        color: var(--text-primary);
      }

      .form-content {
        padding: 12px;
      }

      /* Группы */
      .form-group {
        margin-bottom: 8px;
      }

      .form-group-title {
        color: var(--group-title-color);
        font-weight: 500;
        margin-bottom: 6px;
        padding: 2px 0;
      }

      .form-group-content {
        display: flex;
        gap: 8px;
      }

      .form-group-content.vertical {
        flex-direction: column;
      }

      .form-group-content.horizontal {
        flex-direction: row;
        flex-wrap: wrap;
      }

      /* Страницы (табы) */
      .form-pages {
        margin-bottom: 8px;
      }

      .form-pages-tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 0;
      }

      .form-pages-tab {
        padding: 6px 12px;
        border: 1px solid var(--border-color);
        border-bottom: none;
        background-color: var(--tab-inactive-bg);
        cursor: pointer;
        margin-right: -1px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        color: var(--text-secondary);
        transition: var(--transition);
      }

      .form-pages-tab:hover {
        background-color: var(--bg-tertiary);
      }

      .form-pages-tab.active {
        background-color: var(--tab-active-bg);
        color: var(--text-primary);
        border-bottom: 1px solid var(--tab-active-bg);
        margin-bottom: -1px;
      }

      .form-pages-content {
        border: 1px solid var(--border-color);
        border-top: none;
        padding: 10px;
        background-color: var(--bg-primary);
      }

      .form-page {
        display: none;
      }

      .form-page.active {
        display: block;
      }

      /* Элементы ввода */
      .form-field {
        display: flex;
        align-items: flex-start;
        margin-bottom: 6px;
        min-width: 0;
      }

      .form-field.label-top {
        flex-direction: column;
      }

      .form-field-label {
        white-space: nowrap;
        min-width: 100px;
        padding-right: 8px;
        color: var(--text-primary);
        line-height: 26px;
        flex-shrink: 0;
      }

      .form-field.label-top .form-field-label {
        margin-bottom: 2px;
        line-height: 1.4;
      }

      .form-field-input {
        flex: 1;
        min-width: 0;
      }

      .form-input {
        width: 100%;
        height: 26px;
        padding: 2px 6px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--text-primary);
        font-size: var(--font-size);
        transition: var(--transition);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--text-link);
      }

      .form-input:disabled {
        background-color: var(--bg-tertiary);
        color: var(--text-muted);
      }

      /* Чекбоксы */
      .form-checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 26px;
      }

      .form-checkbox {
        width: 16px;
        height: 16px;
        accent-color: var(--text-link);
      }

      /* Кнопки */
      .form-button {
        height: 26px;
        padding: 2px 12px;
        border: 1px solid var(--button-border);
        border-radius: var(--border-radius);
        background-color: var(--button-bg);
        color: var(--text-primary);
        cursor: pointer;
        font-size: var(--font-size);
        transition: var(--transition);
        margin-right: 4px;
      }

      .form-button:hover {
        background-color: var(--bg-tertiary);
      }

      .form-button:active {
        background-color: var(--border-color);
      }

      .form-button-icon {
        padding: 2px 6px;
      }

      /* Панель команд */
      .form-command-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 4px 0;
        margin-bottom: 8px;
        border-bottom: 1px solid var(--border-color-light);
      }

      /* Декорации */
      .form-decoration {
        margin-bottom: 4px;
      }

      .form-decoration-label {
        color: var(--text-primary);
      }

      .form-decoration-label.hyperlink {
        color: var(--text-link);
        cursor: pointer;
        text-decoration: underline;
      }

      .form-decoration-label.hyperlink:hover {
        text-decoration: none;
      }

      .form-decoration-picture {
        max-width: 100%;
        height: auto;
      }

      /* Таблицы */
      .form-table-container {
        margin-bottom: 8px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        overflow: hidden;
      }

      .form-table-title {
        padding: 6px 8px;
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        font-weight: 500;
      }

      .form-table-wrapper {
        max-height: 300px;
        overflow: auto;
      }

      .form-table {
        width: 100%;
        border-collapse: collapse;
      }

      .form-table th,
      .form-table td {
        padding: 6px 8px;
        text-align: left;
        border-bottom: 1px solid var(--border-color-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }

      .form-table th {
        position: sticky;
        top: 0;
        background-color: var(--table-header-bg);
        font-weight: 500;
        color: var(--text-secondary);
      }

      .form-table tbody tr:hover {
        background-color: var(--table-row-hover);
      }

      .form-table-command-bar {
        display: flex;
        gap: 4px;
        padding: 4px 8px;
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
      }

      /* Подсказки */
      .form-tooltip {
        color: var(--tooltip-color);
        font-size: 11px;
        margin-top: 2px;
      }

      /* Скрытые элементы */
      .hidden {
        display: none !important;
      }
    `;
  }

  /**
   * Генерирует JavaScript для интерактивности
   */
  private generateScripts(): string {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        // Обработка табов
        const tabs = document.querySelectorAll('.form-pages-tab');
        tabs.forEach(tab => {
          tab.addEventListener('click', function() {
            const pagesContainer = this.closest('.form-pages');
            const targetId = this.dataset.target;
            
            // Деактивируем все табы и страницы
            pagesContainer.querySelectorAll('.form-pages-tab').forEach(t => t.classList.remove('active'));
            pagesContainer.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
            
            // Активируем текущий таб и страницу
            this.classList.add('active');
            const targetPage = pagesContainer.querySelector('#' + targetId);
            if (targetPage) {
              targetPage.classList.add('active');
            }
          });
        });

        // Выравнивание меток в вертикальных группах
        const verticalGroups = document.querySelectorAll('.form-group-content.vertical');
        verticalGroups.forEach(group => {
          let maxWidth = 0;
          const labels = group.querySelectorAll('.form-field-label');
          labels.forEach(label => {
            maxWidth = Math.max(maxWidth, label.offsetWidth);
          });
          if (maxWidth > 0 && maxWidth < 250) {
            labels.forEach(label => {
              label.style.minWidth = maxWidth + 'px';
            });
          }
        });
      });
    `;
  }

  /**
   * Генерирует содержимое формы
   */
  private generateFormContent(form: EdtForm): string {
    let html = '';

    // Командная панель
    if (form.autoCommandBar && form.autoCommandBar.items && form.autoCommandBar.items.length > 0) {
      html += this.generateCommandBar(form.autoCommandBar.items);
    }

    // Элементы формы
    if (form.items) {
      html += this.generateItems(form.items);
    }

    return html;
  }

  /**
   * Генерирует командную панель
   */
  private generateCommandBar(items: FormItem[]): string {
    const buttons = items.map(item => this.generateItem(item)).join('');
    return `<div class="form-command-bar">${buttons}</div>`;
  }

  /**
   * Генерирует массив элементов
   */
  private generateItems(items: FormItem[]): string {
    return items.map(item => this.generateItem(item)).join('');
  }

  /**
   * Генерирует отдельный элемент формы
   */
  private generateItem(item: FormItem): string {
    // Проверяем видимость
    if (item.visible === false) {
      return '';
    }

    // Определяем тип элемента по наличию характерных свойств
    if (this.isFormGroup(item)) {
      return this.generateGroup(item);
    }
    if (this.isFormTable(item)) {
      return this.generateTable(item);
    }
    if (this.isFormField(item)) {
      return this.generateField(item);
    }
    if (this.isFormButton(item)) {
      return this.generateButton(item);
    }
    if (this.isFormDecoration(item)) {
      return this.generateDecoration(item);
    }

    return `<!-- Unknown item: ${(item as any).name || 'unknown'} -->`;
  }

  /**
   * Генерирует группу
   */
  private generateGroup(group: FormGroup): string {
    const groupType = group.type || 'UsualGroup';
    
    // Страницы (табы)
    if (groupType === 'Pages') {
      return this.generatePages(group);
    }

    // Обычная группа
    const direction = this.getGroupDirection(group);
    const title = this.getLocalizedString(group.title);
    const showTitle = group.titleLocation !== 'None' && title;

    let html = `<div class="form-group" data-name="${group.name}">`;
    
    if (showTitle) {
      html += `<div class="form-group-title">${this.escapeHtml(title)}</div>`;
    }

    html += `<div class="form-group-content ${direction}">`;
    
    if (group.items) {
      html += this.generateItems(group.items);
    }

    html += '</div></div>';
    return html;
  }

  /**
   * Генерирует страницы (табы)
   */
  private generatePages(pages: FormGroup): string {
    if (!pages.items || pages.items.length === 0) {
      return '';
    }

    let tabsHtml = '<div class="form-pages-tabs">';
    let contentHtml = '';

    pages.items.forEach((page, index) => {
      if (!this.isFormGroup(page)) return;

      const pageId = `page-${pages.name}-${index}`;
      const title = this.getLocalizedString(page.title) || page.name;
      const isActive = index === 0;

      tabsHtml += `
        <div class="form-pages-tab ${isActive ? 'active' : ''}" data-target="${pageId}">
          ${this.escapeHtml(title)}
        </div>
      `;

      contentHtml += `
        <div id="${pageId}" class="form-page ${isActive ? 'active' : ''}">
          ${page.items ? this.generateItems(page.items) : ''}
        </div>
      `;
    });

    tabsHtml += '</div>';

    return `
      <div class="form-pages" data-name="${pages.name}">
        ${tabsHtml}
        <div class="form-pages-content">
          ${contentHtml}
        </div>
      </div>
    `;
  }

  /**
   * Генерирует поле формы
   */
  private generateField(field: FormField): string {
    const fieldType = field.type || 'InputField';
    const title = this.getLocalizedString(field.title);
    const dataPath = field.dataPath?.segments || '';
    const label = title || this.extractLabelFromDataPath(dataPath);
    const showTitle = field.titleLocation !== 'None';

    switch (fieldType) {
      case 'CheckBoxField':
        return this.generateCheckBoxField(field, label);
      case 'LabelField':
        return this.generateLabelField(field, label);
      case 'ImageField':
        return this.generateImageField(field, label);
      default:
        return this.generateInputField(field, label, showTitle);
    }
  }

  /**
   * Генерирует поле ввода
   */
  private generateInputField(field: FormField, label: string, showTitle: boolean): string {
    const disabled = field.enabled === false ? 'disabled' : '';
    const width = field.maxWidth ? `style="max-width: ${field.maxWidth * 8}px;"` : '';

    return `
      <div class="form-field" data-name="${field.name}">
        ${showTitle ? `<label class="form-field-label">${this.escapeHtml(label)}</label>` : ''}
        <div class="form-field-input" ${width}>
          <input type="text" class="form-input" placeholder="${this.escapeHtml(label)}" ${disabled} />
        </div>
      </div>
    `;
  }

  /**
   * Генерирует чекбокс
   */
  private generateCheckBoxField(field: FormField, label: string): string {
    const disabled = field.enabled === false ? 'disabled' : '';

    return `
      <div class="form-field" data-name="${field.name}">
        <div class="form-checkbox-wrapper">
          <input type="checkbox" class="form-checkbox" ${disabled} />
          <label class="form-checkbox-label">${this.escapeHtml(label)}</label>
        </div>
      </div>
    `;
  }

  /**
   * Генерирует поле-надпись
   */
  private generateLabelField(field: FormField, label: string): string {
    const isHyperlink = (field.extInfo as any)?.hyperlink;

    return `
      <div class="form-field" data-name="${field.name}">
        <label class="form-field-label">${this.escapeHtml(label)}</label>
        <div class="form-field-input">
          <span class="form-label-value ${isHyperlink ? 'hyperlink' : ''}">—</span>
        </div>
      </div>
    `;
  }

  /**
   * Генерирует поле картинки
   */
  private generateImageField(field: FormField, label: string): string {
    return `
      <div class="form-field" data-name="${field.name}">
        <label class="form-field-label">${this.escapeHtml(label)}</label>
        <div class="form-field-input">
          <div class="form-image-placeholder" style="width: 100px; height: 100px; border: 1px dashed var(--border-color);"></div>
        </div>
      </div>
    `;
  }

  /**
   * Генерирует декорацию
   */
  private generateDecoration(decoration: FormDecoration): string {
    const decorationType = decoration.type || 'Label';
    const title = this.getLocalizedString(decoration.title);

    if (decorationType === 'Picture') {
      const picturePath = (decoration.extInfo as any)?.picture?.picture || '';
      return `
        <div class="form-decoration" data-name="${decoration.name}">
          <img class="form-decoration-picture" src="${this.resolvePicturePath(picturePath)}" alt="${this.escapeHtml(title)}" />
        </div>
      `;
    }

    const isHyperlink = decoration.extInfo?.hyperlink;
    return `
      <div class="form-decoration" data-name="${decoration.name}">
        <span class="form-decoration-label ${isHyperlink ? 'hyperlink' : ''}">${this.escapeHtml(title)}</span>
      </div>
    `;
  }

  /**
   * Генерирует кнопку
   */
  private generateButton(button: FormButton): string {
    const title = this.getLocalizedString(button.title) || button.name;
    const disabled = button.enabled === false ? 'disabled' : '';
    const isIcon = button.representation === 'Picture';

    return `
      <button class="form-button ${isIcon ? 'form-button-icon' : ''}" ${disabled} data-name="${button.name}">
        ${this.escapeHtml(title)}
      </button>
    `;
  }

  /**
   * Генерирует таблицу
   */
  private generateTable(table: FormTable): string {
    const title = this.getLocalizedString(table.title);
    const dataPath = table.dataPath?.segments || '';
    const tableTitle = title || this.extractLabelFromDataPath(dataPath);
    const showTitle = table.titleLocation !== 'None';

    // Получаем колонки из items таблицы
    const columns = table.items?.filter(item => this.isFormField(item)) as FormField[] || [];

    let html = `<div class="form-table-container" data-name="${table.name}">`;
    
    if (showTitle && tableTitle) {
      html += `<div class="form-table-title">${this.escapeHtml(tableTitle)}</div>`;
    }

    // Командная панель таблицы
    html += `
      <div class="form-table-command-bar">
        <button class="form-button form-button-icon" title="Добавить">+</button>
        <button class="form-button form-button-icon" title="Удалить">−</button>
      </div>
    `;

    html += '<div class="form-table-wrapper"><table class="form-table"><thead><tr>';
    
    columns.forEach(col => {
      const colTitle = this.getLocalizedString(col.title) || 
                       this.extractLabelFromDataPath(col.dataPath?.segments || '');
      html += `<th>${this.escapeHtml(colTitle)}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    // Добавляем несколько пустых строк для демонстрации
    for (let i = 0; i < 3; i++) {
      html += '<tr>';
      columns.forEach(() => {
        html += '<td></td>';
      });
      html += '</tr>';
    }
    
    html += '</tbody></table></div></div>';
    return html;
  }

  // === Вспомогательные методы ===

  private isFormGroup(item: FormItem): item is FormGroup {
    return 'items' in item && !('dataPath' in item && 'type' in item && (item as FormField).type !== undefined);
  }

  private isFormTable(item: FormItem): item is FormTable {
    return 'dataPath' in item && 'items' in item;
  }

  private isFormField(item: FormItem): item is FormField {
    return 'dataPath' in item && !('items' in item);
  }

  private isFormButton(item: FormItem): item is FormButton {
    return 'commandName' in item || ('name' in item && item.name.includes('Button'));
  }

  private isFormDecoration(item: FormItem): item is FormDecoration {
    return 'type' in item && ((item as FormDecoration).type === 'Label' || (item as FormDecoration).type === 'Picture');
  }

  private getGroupDirection(group: FormGroup): string {
    const extInfo = group.extInfo as any;
    if (!extInfo) return 'vertical';
    
    switch (extInfo.group) {
      case 'AlwaysHorizontal':
      case 'HorizontalIfPossible':
        return 'horizontal';
      default:
        return 'vertical';
    }
  }

  private getLocalizedString(value: LocalizedString | LocalizedString[] | undefined): string {
    if (!value) return '';
    
    if (Array.isArray(value)) {
      // Предпочитаем русский язык, затем английский
      const ru = value.find(v => v.key === 'ru');
      if (ru) return ru.value;
      const en = value.find(v => v.key === 'en');
      if (en) return en.value;
      return value[0]?.value || '';
    }
    
    return value.value || '';
  }

  private extractLabelFromDataPath(dataPath: string): string {
    if (!dataPath) return '';
    const parts = dataPath.split('.');
    return parts[parts.length - 1] || '';
  }

  private resolvePicturePath(picture: string): string {
    if (!picture) return '';
    
    // StdPicture и CommonPicture
    if (picture.startsWith('StdPicture.') || picture.startsWith('CommonPicture.')) {
      return `${this.picturesBasePath}/${picture}.png`;
    }
    
    return picture;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
