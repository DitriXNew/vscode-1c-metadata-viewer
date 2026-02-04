/**
 * Точка входа для WebView рендеринга форм EDT
 * Этот файл будет скомпилирован в бандл для браузера
 */

import { Form } from '../model/Form';
import { FormToLwtConverter, ConversionOptions } from '../lwt/FormToLwtConverter';
import { FormRenderer, FormRendererOptions } from '../lwt/renderer/FormRenderer';
import { ILightComposite } from '../lwt/core/interfaces';

// Интерфейс для сериализованной формы
interface SerializedForm {
    form: Form;
    options?: ConversionOptions;
}

// Глобальные переменные
let renderer: FormRenderer | null = null;
let rootControl: ILightComposite | null = null;

// Получаем доступ к VS Code API
declare function acquireVsCodeApi(): {
    postMessage(message: any): void;
    getState(): any;
    setState(state: any): void;
};

const vscode = acquireVsCodeApi();

/**
 * Инициализация Canvas и рендеринга
 */
function initCanvas(): HTMLCanvasElement | null {
    const canvas = document.getElementById('formCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found');
        return null;
    }

    // Устанавливаем размер canvas на весь контейнер
    const container = canvas.parentElement;
    if (container) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    return canvas;
}

/**
 * Рендерит форму на Canvas
 */
function renderForm(serializedForm: SerializedForm): void {
    // Скрываем индикатор загрузки
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }

    const canvas = initCanvas();
    if (!canvas) {
        console.error('Failed to init canvas');
        return;
    }

    // Определяем тему по CSS переменным VS Code
    const isDark = document.body.classList.contains('vscode-dark') ||
        getComputedStyle(document.body).getPropertyValue('--vscode-editor-background').includes('#1');

    // Создаём рендерер
    const rendererOptions: FormRendererOptions = {
        darkTheme: isDark,
        devicePixelRatio: window.devicePixelRatio || 1,
        antialias: true,
        backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0'
    };

    try {
        console.log('[RENDER] Creating renderer...');
        renderer = new FormRenderer(canvas, rendererOptions);

        // Конвертируем форму в LWT
        console.log('[RENDER] Converting form');
        console.log('[RENDER] Form items count:', serializedForm.form?.items?.length || 0);
        
        // DEBUG: детальное логирование входных данных
        if (serializedForm.form?.items) {
            for (let i = 0; i < serializedForm.form.items.length; i++) {
                const item = serializedForm.form.items[i] as any;
                console.log(`[RENDER] Item ${i}:`, item?.name, 'type:', item?.type, 'title:', JSON.stringify(item?.title));
            }
        }
        if (serializedForm.form?.autoCommandBar) {
            const acb = serializedForm.form.autoCommandBar as any;
            console.log('[RENDER] AutoCommandBar:', acb?.name, 'items:', acb?.items?.length);
            if (acb?.items) {
                for (let i = 0; i < acb.items.length; i++) {
                    const btn = acb.items[i] as any;
                    console.log(`[RENDER] Button ${i}:`, btn?.name, 'title:', JSON.stringify(btn?.title));
                }
            }
        }
        
        const converter = new FormToLwtConverter(serializedForm.options || { locale: 'ru' });
        const result = converter.convert(serializedForm.form);

        console.log('[RENDER] Conversion complete:');
        console.log('[RENDER] - root children:', result.root.getChildren().length);
        console.log('[RENDER] - controls count:', result.controlsById.size);
        console.log('[RENDER] - errors:', result.errors);
        console.log('[RENDER] - warnings:', result.warnings);

        if (result.errors.length > 0) {
            console.warn('Conversion errors:', result.errors);
        }

        if (result.warnings.length > 0) {
            console.warn('Conversion warnings:', result.warnings);
        }

        rootControl = result.root;

        // Устанавливаем корневой контрол и рендерим
        renderer.setRoot(result.root);

        // Отправляем статистику обратно в расширение
        vscode.postMessage({
            type: 'renderComplete',
            data: {
                controlsCount: result.controlsById.size,
                errorsCount: result.errors.length,
                warningsCount: result.warnings.length
            }
        });
    } catch (err) {
        console.error('Render error:', err);
        vscode.postMessage({
            type: 'error',
            data: String(err)
        });
    }
}

/**
 * Обработка изменения размера окна
 */
function handleResize(): void {
    const canvas = document.getElementById('formCanvas') as HTMLCanvasElement;
    if (!canvas || !renderer) {
        return;
    }

    const container = canvas.parentElement;
    if (container) {
        renderer.resize(container.clientWidth, container.clientHeight);
    }
}

/**
 * Обработка сообщений от расширения
 */
function handleMessage(event: MessageEvent): void {
    const message = event.data;

    switch (message.type) {
        case 'renderForm':
            renderForm(message.data as SerializedForm);
            break;
        case 'setTheme':
            if (renderer) {
                renderer.setDarkTheme(message.data.dark);
            }
            break;
        case 'resize':
            handleResize();
            break;
    }
}

/**
 * Инициализация при загрузке страницы
 */
function init(): void {
    // Подписываемся на сообщения от расширения
    window.addEventListener('message', handleMessage);

    // Подписываемся на изменение размера окна
    window.addEventListener('resize', () => {
        // Debounce
        if ((window as any)._resizeTimeout) {
            clearTimeout((window as any)._resizeTimeout);
        }
        (window as any)._resizeTimeout = setTimeout(handleResize, 100);
    });

    // Сообщаем расширению что WebView готов
    vscode.postMessage({ type: 'ready' });
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
