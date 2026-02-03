/**
 * Предпросмотрщик EDT форм
 * Главный класс для интеграции парсера и генератора HTML
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { EdtFormParser } from './edtFormParser';
import { EdtFormHtmlGenerator, ThemeMode } from './edtFormHtmlGenerator';

export class EdtFormPreviewer {
  public static readonly viewType = 'metadataViewer.edtFormPreview';

  private formPath: string;
  private confPath: string;
  private webpanel: vscode.WebviewPanel | undefined;
  private parser: EdtFormParser;

  constructor(confPath: string, formPath: string) {
    this.confPath = confPath;
    this.formPath = formPath;
    this.parser = new EdtFormParser();
  }

  /**
   * Открывает предпросмотр формы
   */
  public async openPreview(
    extensionUri: vscode.Uri,
    title?: string | vscode.TreeItemLabel
  ): Promise<void> {
    // Проверяем существование файла формы
    if (!fs.existsSync(this.formPath)) {
      vscode.window.showErrorMessage(`Файл формы не найден: ${this.formPath}`);
      return;
    }

    // Определяем тему
    const theme = this.getCurrentTheme();

    // Парсим форму
    const form = this.parser.parseFormFile(this.formPath);
    if (!form) {
      vscode.window.showErrorMessage('Не удалось распарсить файл формы');
      return;
    }

    // Путь к картинкам
    const picturesPath = this.resolvePicturesPath(extensionUri);

    // Генерируем HTML
    const generator = new EdtFormHtmlGenerator(theme, picturesPath);
    const html = generator.generateHtml(form);

    // Создаём или обновляем панель
    if (this.webpanel) {
      this.webpanel.webview.html = html;
      this.webpanel.reveal();
    } else {
      const formTitle = typeof title === 'string' ? title : title?.label || path.basename(this.formPath);
      
      this.webpanel = vscode.window.createWebviewPanel(
        EdtFormPreviewer.viewType,
        `Предпросмотр формы (${formTitle})`,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, 'resources', 'pictures'),
            vscode.Uri.file(this.confPath)
          ]
        }
      );

      this.webpanel.webview.html = html;

      // Обработка закрытия панели
      this.webpanel.onDidDispose(() => {
        this.webpanel = undefined;
      });

      // Обработка смены темы
      vscode.window.onDidChangeActiveColorTheme(() => {
        this.refreshPreview(extensionUri);
      });
    }
  }

  /**
   * Обновляет предпросмотр (например, при смене темы)
   */
  private refreshPreview(extensionUri: vscode.Uri): void {
    if (!this.webpanel) return;

    const form = this.parser.parseFormFile(this.formPath);
    if (!form) return;

    const theme = this.getCurrentTheme();
    const picturesPath = this.resolvePicturesPath(extensionUri);
    const generator = new EdtFormHtmlGenerator(theme, picturesPath);
    
    this.webpanel.webview.html = generator.generateHtml(form);
  }

  /**
   * Определяет текущую тему VS Code
   */
  private getCurrentTheme(): ThemeMode {
    const colorTheme = vscode.window.activeColorTheme;
    return colorTheme.kind === vscode.ColorThemeKind.Dark || 
           colorTheme.kind === vscode.ColorThemeKind.HighContrast
           ? 'dark' 
           : 'light';
  }

  /**
   * Определяет путь к картинкам
   */
  private resolvePicturesPath(extensionUri: vscode.Uri): string {
    const picturesUri = vscode.Uri.joinPath(extensionUri, 'resources', 'pictures');
    return picturesUri.toString();
  }

  /**
   * Закрывает панель предпросмотра
   */
  public dispose(): void {
    if (this.webpanel) {
      this.webpanel.dispose();
      this.webpanel = undefined;
    }
  }
}

/**
 * Фабричная функция для создания предпросмотра EDT формы
 */
export function previewEdtForm(
  confPath: string,
  formPath: string,
  extensionUri: vscode.Uri,
  title?: string | vscode.TreeItemLabel
): void {
  const previewer = new EdtFormPreviewer(confPath, formPath);
  previewer.openPreview(extensionUri, title);
}
