/**
 * Рендерер формы на Canvas
 * Координирует отрисовку дерева контролов LWT
 */
import { ILightControl, ILightComposite } from '../core/interfaces';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, setTheme, LightTheme, DarkTheme } from '../theme';

/**
 * Опции рендерера
 */
export interface FormRendererOptions {
    /** Использовать тёмную тему */
    darkTheme?: boolean;
    /** Коэффициент масштабирования (DPI) */
    devicePixelRatio?: number;
    /** Включить анти-алиасинг */
    antialias?: boolean;
    /** Цвет фона формы */
    backgroundColor?: string;
}

/**
 * Рендерер формы 1С на Canvas
 */
export class FormRenderer {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _root: ILightComposite | null = null;
    private _options: FormRendererOptions;
    private _animationFrameId: number | null = null;
    private _dirty: boolean = false;

    // Обработка событий мыши
    private _hoveredControl: ILightControl | null = null;
    private _focusedControl: ILightControl | null = null;
    private _pressedControl: ILightControl | null = null;

    constructor(canvas: HTMLCanvasElement, options: FormRendererOptions = {}) {
        this._canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context');
        }
        this._ctx = ctx;
        this._options = {
            darkTheme: false,
            devicePixelRatio: window.devicePixelRatio || 1,
            antialias: true,
            backgroundColor: '#F0F0F0',
            ...options
        };

        // Применяем тему
        setTheme(this._options.darkTheme ? new DarkTheme() : new LightTheme());

        // Настраиваем canvas под DPI
        this.setupCanvas();

        // Подключаем обработчики событий
        this.setupEventListeners();
    }

    /**
     * Настраивает Canvas под DPI устройства
     */
    private setupCanvas(): void {
        const dpr = this._options.devicePixelRatio || 1;
        const rect = this._canvas.getBoundingClientRect();

        // Устанавливаем физический размер
        this._canvas.width = rect.width * dpr;
        this._canvas.height = rect.height * dpr;

        // Масштабируем контекст
        this._ctx.scale(dpr, dpr);

        // CSS размер остаётся прежним
        this._canvas.style.width = `${rect.width}px`;
        this._canvas.style.height = `${rect.height}px`;
    }

    /**
     * Подключает обработчики событий мыши
     */
    private setupEventListeners(): void {
        this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this._canvas.addEventListener('click', this.handleClick.bind(this));
        this._canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    /**
     * Устанавливает корневой контрол формы
     */
    setRoot(root: ILightComposite): void {
        this._root = root;
        
        // Устанавливаем размеры корневого контрола
        const theme = getTheme();
        const rect = this._canvas.getBoundingClientRect();
        root.setBounds(0, 0, rect.width, rect.height);
        
        // Запускаем layout
        this.layout();
        
        // Запрашиваем отрисовку
        this.invalidate();
    }

    /**
     * Получает корневой контрол
     */
    getRoot(): ILightComposite | null {
        return this._root;
    }

    /**
     * Выполняет layout всех контролов
     */
    layout(): void {
        if (this._root && 'layout' in this._root && typeof this._root.layout === 'function') {
            this._root.layout();
        }
    }

    /**
     * Запрашивает перерисовку
     */
    invalidate(): void {
        this._dirty = true;
        if (this._animationFrameId === null) {
            this._animationFrameId = requestAnimationFrame(() => this.render());
        }
    }

    /**
     * Выполняет отрисовку формы
     */
    render(): void {
        this._animationFrameId = null;
        this._dirty = false;

        const theme = getTheme();
        const rect = this._canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Очищаем canvas
        this._ctx.fillStyle = this._options.backgroundColor || theme.background.toCss();
        this._ctx.fillRect(0, 0, width, height);

        // Рисуем дерево контролов
        if (this._root) {
            const clip = new Rectangle(0, 0, width, height);
            this._root.paint(this._ctx, clip);
        }
    }

    /**
     * Изменяет размер canvas
     */
    resize(width: number, height: number): void {
        this._canvas.style.width = `${width}px`;
        this._canvas.style.height = `${height}px`;
        
        this.setupCanvas();

        if (this._root) {
            this._root.setBounds(0, 0, width, height);
            this.layout();
        }

        this.invalidate();
    }

    /**
     * Находит контрол по координатам
     */
    private findControlAt(x: number, y: number): ILightControl | null {
        if (!this._root) {
            return null;
        }

        // Рекурсивный поиск
        return this.findControlAtRecursive(this._root, x, y);
    }

    /**
     * Рекурсивный поиск контрола
     */
    private findControlAtRecursive(control: ILightControl, x: number, y: number): ILightControl | null {
        // Проверяем, содержит ли контрол точку
        if (!control.contains(x, y) || !control.isVisible()) {
            return null;
        }

        // Проверяем детей (в обратном порядке - сверху вниз по z-order)
        if ('getChildren' in control && typeof control.getChildren === 'function') {
            const composite = control as ILightComposite;
            const children = composite.getChildren();
            for (let i = children.length - 1; i >= 0; i--) {
                const found = this.findControlAtRecursive(children[i], x, y);
                if (found) {
                    return found;
                }
            }
        }

        return control;
    }

    /**
     * Обработка движения мыши
     */
    private handleMouseMove(event: MouseEvent): void {
        const rect = this._canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const control = this.findControlAt(x, y);

        // Обновляем hovered контрол
        if (control !== this._hoveredControl) {
            // Уведомляем старый контрол
            if (this._hoveredControl && 'onMouseLeave' in this._hoveredControl) {
                (this._hoveredControl as any).onMouseLeave();
            }

            this._hoveredControl = control;

            // Уведомляем новый контрол
            if (control && 'onMouseEnter' in control) {
                (control as any).onMouseEnter();
            }

            // Обновляем курсор
            this.updateCursor(control);

            this.invalidate();
        }
    }

    /**
     * Обработка нажатия мыши
     */
    private handleMouseDown(event: MouseEvent): void {
        const rect = this._canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const control = this.findControlAt(x, y);
        this._pressedControl = control;

        if (control && 'onMouseDown' in control) {
            (control as any).onMouseDown(event);
        }

        // Обновляем фокус
        if (control !== this._focusedControl) {
            if (this._focusedControl && 'onBlur' in this._focusedControl) {
                (this._focusedControl as any).onBlur();
            }

            this._focusedControl = control;

            if (control && 'onFocus' in control) {
                (control as any).onFocus();
            }
        }

        this.invalidate();
    }

    /**
     * Обработка отпускания мыши
     */
    private handleMouseUp(event: MouseEvent): void {
        if (this._pressedControl && 'onMouseUp' in this._pressedControl) {
            (this._pressedControl as any).onMouseUp(event);
        }

        this._pressedControl = null;
        this.invalidate();
    }

    /**
     * Обработка клика
     */
    private handleClick(event: MouseEvent): void {
        const rect = this._canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const control = this.findControlAt(x, y);

        if (control && 'onClick' in control) {
            (control as any).onClick(event);
        }

        this.invalidate();
    }

    /**
     * Обработка ухода мыши с canvas
     */
    private handleMouseLeave(_event: MouseEvent): void {
        if (this._hoveredControl && 'onMouseLeave' in this._hoveredControl) {
            (this._hoveredControl as any).onMouseLeave();
        }

        this._hoveredControl = null;
        this._canvas.style.cursor = 'default';
        this.invalidate();
    }

    /**
     * Обновляет курсор в зависимости от контрола
     */
    private updateCursor(control: ILightControl | null): void {
        if (!control) {
            this._canvas.style.cursor = 'default';
            return;
        }

        // Проверяем специальные типы контролов
        const ctrlName = control.constructor.name;
        
        if (ctrlName === 'ButtonControl') {
            this._canvas.style.cursor = 'pointer';
        } else if (ctrlName === 'InputFieldControl') {
            this._canvas.style.cursor = 'text';
        } else if (ctrlName === 'LabelControl' && (control as any).hyperlink) {
            this._canvas.style.cursor = 'pointer';
        } else if (ctrlName === 'CheckboxControl') {
            this._canvas.style.cursor = 'pointer';
        } else {
            this._canvas.style.cursor = 'default';
        }
    }

    /**
     * Переключает тему
     */
    setDarkTheme(dark: boolean): void {
        this._options.darkTheme = dark;
        setTheme(dark ? new DarkTheme() : new LightTheme());
        this._options.backgroundColor = dark ? '#1E1E1E' : '#F0F0F0';
        this.invalidate();
    }

    /**
     * Очищает ресурсы
     */
    dispose(): void {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
        }

        this._canvas.removeEventListener('mousemove', this.handleMouseMove);
        this._canvas.removeEventListener('mousedown', this.handleMouseDown);
        this._canvas.removeEventListener('mouseup', this.handleMouseUp);
        this._canvas.removeEventListener('click', this.handleClick);
        this._canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
}
