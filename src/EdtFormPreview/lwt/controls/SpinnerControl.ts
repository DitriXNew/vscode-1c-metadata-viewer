/**
 * Контрол Spinner - числовое поле с кнопками увеличения/уменьшения
 * Порт из org.eclipse.swt.widgets.Spinner
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Тип значения спиннера
 */
export enum SpinnerValueType {
    Integer = 'integer',
    Float = 'float'
}

/**
 * Слушатель изменения значения
 */
export type SpinnerChangeListener = (spinner: SpinnerControl, value: number) => void;

/**
 * Контрол спиннера - числовое поле со стрелками
 */
export class SpinnerControl extends LightControl {
    // Значение
    private _value: number = 0;
    private _minimum: number = 0;
    private _maximum: number = 100;
    private _increment: number = 1;
    private _pageIncrement: number = 10;
    private _digits: number = 0; // Количество знаков после запятой
    
    // Внешний вид
    private _font: Font | null = null;
    private _textColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    private _borderColor: Color | null = null;
    
    // Состояние
    private _readOnly: boolean = false;
    private _hovered: boolean = false;
    private _focused: boolean = false;
    private _upButtonHovered: boolean = false;
    private _downButtonHovered: boolean = false;
    private _upButtonPressed: boolean = false;
    private _downButtonPressed: boolean = false;
    
    // Размеры
    private _buttonWidth: number = 16;
    private _padding: number = 4;
    
    // Слушатели
    private _changeListeners: SpinnerChangeListener[] = [];
    
    // Статические константы
    private static readonly DEFAULT_HEIGHT = 24;
    private static readonly MIN_WIDTH = 60;
    
    /**
     * Текущее значение
     */
    get value(): number {
        return this._value;
    }
    
    set value(val: number) {
        const newValue = this.clampValue(val);
        if (this._value !== newValue) {
            this._value = newValue;
            this.fireChange();
            this.invalidate();
        }
    }
    
    /**
     * Минимальное значение
     */
    get minimum(): number {
        return this._minimum;
    }
    
    set minimum(val: number) {
        if (this._minimum !== val) {
            this._minimum = val;
            this._value = this.clampValue(this._value);
            this.invalidate();
        }
    }
    
    /**
     * Максимальное значение
     */
    get maximum(): number {
        return this._maximum;
    }
    
    set maximum(val: number) {
        if (this._maximum !== val) {
            this._maximum = val;
            this._value = this.clampValue(this._value);
            this.invalidate();
        }
    }
    
    /**
     * Шаг изменения
     */
    get increment(): number {
        return this._increment;
    }
    
    set increment(val: number) {
        this._increment = Math.max(0, val);
    }
    
    /**
     * Шаг страницы
     */
    get pageIncrement(): number {
        return this._pageIncrement;
    }
    
    set pageIncrement(val: number) {
        this._pageIncrement = Math.max(0, val);
    }
    
    /**
     * Количество знаков после запятой
     */
    get digits(): number {
        return this._digits;
    }
    
    set digits(val: number) {
        this._digits = Math.max(0, Math.floor(val));
        this.invalidate();
    }
    
    /**
     * Только для чтения
     */
    get readOnly(): boolean {
        return this._readOnly;
    }
    
    set readOnly(val: boolean) {
        this._readOnly = val;
        this.invalidate();
    }
    
    /**
     * Шрифт
     */
    get font(): Font | null {
        return this._font;
    }
    
    set font(val: Font | null) {
        this._font = val;
        this.invalidate();
    }
    
    /**
     * Цвет текста
     */
    get textColor(): Color | null {
        return this._textColor;
    }
    
    set textColor(val: Color | null) {
        this._textColor = val;
        this.invalidate();
    }
    
    /**
     * Цвет фона
     */
    get backgroundColor(): Color | null {
        return this._backgroundColor;
    }
    
    set backgroundColor(val: Color | null) {
        this._backgroundColor = val;
        this.invalidate();
    }
    
    /**
     * Цвет рамки
     */
    get borderColor(): Color | null {
        return this._borderColor;
    }
    
    set borderColor(val: Color | null) {
        this._borderColor = val;
        this.invalidate();
    }
    
    /**
     * Добавляет слушатель изменения
     */
    addChangeListener(listener: SpinnerChangeListener): void {
        this._changeListeners.push(listener);
    }
    
    /**
     * Удаляет слушатель изменения
     */
    removeChangeListener(listener: SpinnerChangeListener): void {
        const index = this._changeListeners.indexOf(listener);
        if (index >= 0) {
            this._changeListeners.splice(index, 1);
        }
    }
    
    /**
     * Увеличивает значение
     */
    incrementValue(): void {
        if (this._readOnly || !this._enabled) return;
        this.value = this._value + this._increment;
    }
    
    /**
     * Уменьшает значение
     */
    decrementValue(): void {
        if (this._readOnly || !this._enabled) return;
        this.value = this._value - this._increment;
    }
    
    /**
     * Увеличивает значение на страницу
     */
    pageUp(): void {
        if (this._readOnly || !this._enabled) return;
        this.value = this._value + this._pageIncrement;
    }
    
    /**
     * Уменьшает значение на страницу
     */
    pageDown(): void {
        if (this._readOnly || !this._enabled) return;
        this.value = this._value - this._pageIncrement;
    }
    
    /**
     * Получает отформатированный текст значения
     */
    getFormattedValue(): string {
        if (this._digits === 0) {
            return Math.floor(this._value).toString();
        }
        return this._value.toFixed(this._digits);
    }
    
    /**
     * Вычисляет предпочтительный размер
     */
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const theme = getTheme();
        const font = this._font ?? theme.defaultFont;
        ctx.font = font.toCss();
        
        // Измеряем максимальное значение для ширины
        const maxText = this.getFormattedValue();
        const textWidth = ctx.measureText(maxText).width;
        
        const width = widthHint !== -1 
            ? widthHint 
            : Math.max(SpinnerControl.MIN_WIDTH, textWidth + this._padding * 2 + this._buttonWidth);
        const height = heightHint !== -1 
            ? heightHint 
            : SpinnerControl.DEFAULT_HEIGHT;
        
        return new Point(width, height);
    }
    
    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        ctx.save();
        
        // Фон
        this.paintBackground(ctx, bounds, theme);
        
        // Рамка
        this.paintBorder(ctx, bounds, theme);
        
        // Текст значения
        this.paintValue(ctx, bounds, theme);
        
        // Кнопки
        this.paintButtons(ctx, bounds, theme);
        
        ctx.restore();
    }
    
    /**
     * Отрисовка фона
     */
    private paintBackground(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const bgColor = !this._enabled 
            ? theme.disabledBackground 
            : (this._backgroundColor ?? theme.inputBackground);
        
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
    
    /**
     * Отрисовка рамки
     */
    private paintBorder(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        let borderColor: Color;
        if (!this._enabled) {
            borderColor = theme.disabledForeground;
        } else if (this._focused) {
            borderColor = theme.inputBorderFocused;
        } else if (this._hovered) {
            borderColor = theme.inputBorderFocused;
        } else {
            borderColor = this._borderColor ?? theme.inputBorder;
        }
        
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1);
    }
    
    /**
     * Отрисовка текста значения
     */
    private paintValue(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const font = this._font ?? theme.defaultFont;
        const textColor = !this._enabled 
            ? theme.disabledForeground 
            : (this._textColor ?? theme.foreground);
        
        ctx.font = font.toCss();
        ctx.fillStyle = textColor.toCss();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'right';
        
        const text = this.getFormattedValue();
        const textX = bounds.x + bounds.width - this._buttonWidth - this._padding;
        const textY = bounds.y + bounds.height / 2;
        
        ctx.fillText(text, textX, textY);
    }
    
    /**
     * Отрисовка кнопок
     */
    private paintButtons(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const buttonX = bounds.x + bounds.width - this._buttonWidth;
        const buttonHeight = bounds.height / 2;
        
        // Кнопка вверх
        this.paintButton(
            ctx, 
            buttonX, 
            bounds.y, 
            this._buttonWidth, 
            buttonHeight,
            true, // isUp
            this._upButtonHovered,
            this._upButtonPressed,
            theme
        );
        
        // Кнопка вниз
        this.paintButton(
            ctx,
            buttonX,
            bounds.y + buttonHeight,
            this._buttonWidth,
            buttonHeight,
            false, // isDown
            this._downButtonHovered,
            this._downButtonPressed,
            theme
        );
        
        // Разделитель между полем и кнопками
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.beginPath();
        ctx.moveTo(buttonX, bounds.y);
        ctx.lineTo(buttonX, bounds.y + bounds.height);
        ctx.stroke();
    }
    
    /**
     * Отрисовка одной кнопки
     */
    private paintButton(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        isUp: boolean,
        hovered: boolean,
        pressed: boolean,
        theme: ITheme
    ): void {
        // Фон кнопки
        let bgColor: Color;
        if (!this._enabled) {
            bgColor = theme.disabledBackground;
        } else if (pressed) {
            bgColor = theme.controlPressedBackground;
        } else if (hovered) {
            bgColor = theme.controlHoverBackground;
        } else {
            bgColor = theme.controlBackground;
        }
        
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, height);
        
        // Стрелка
        const arrowColor = !this._enabled 
            ? theme.disabledForeground 
            : theme.foreground;
        
        ctx.fillStyle = arrowColor.toCss();
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const arrowSize = 4;
        
        ctx.beginPath();
        if (isUp) {
            ctx.moveTo(centerX, centerY - arrowSize / 2);
            ctx.lineTo(centerX + arrowSize, centerY + arrowSize / 2);
            ctx.lineTo(centerX - arrowSize, centerY + arrowSize / 2);
        } else {
            ctx.moveTo(centerX, centerY + arrowSize / 2);
            ctx.lineTo(centerX + arrowSize, centerY - arrowSize / 2);
            ctx.lineTo(centerX - arrowSize, centerY - arrowSize / 2);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Обработка клика
     */
    handleClick(x: number, y: number): boolean {
        if (!this._enabled || this._readOnly) return false;
        
        const bounds = this._bounds;
        const buttonX = bounds.x + bounds.width - this._buttonWidth;
        
        if (x >= buttonX) {
            const buttonHeight = bounds.height / 2;
            if (y < bounds.y + buttonHeight) {
                this.incrementValue();
            } else {
                this.decrementValue();
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * Обработка наведения мыши
     */
    handleMouseMove(x: number, y: number): void {
        const bounds = this._bounds;
        const wasHovered = this._hovered;
        const wasUpHovered = this._upButtonHovered;
        const wasDownHovered = this._downButtonHovered;
        
        this._hovered = bounds.contains(x, y);
        
        if (this._hovered) {
            const buttonX = bounds.x + bounds.width - this._buttonWidth;
            const buttonHeight = bounds.height / 2;
            
            if (x >= buttonX) {
                this._upButtonHovered = y < bounds.y + buttonHeight;
                this._downButtonHovered = !this._upButtonHovered;
            } else {
                this._upButtonHovered = false;
                this._downButtonHovered = false;
            }
        } else {
            this._upButtonHovered = false;
            this._downButtonHovered = false;
        }
        
        if (wasHovered !== this._hovered || 
            wasUpHovered !== this._upButtonHovered || 
            wasDownHovered !== this._downButtonHovered) {
            this.invalidate();
        }
    }
    
    /**
     * Обработка покидания мыши
     */
    handleMouseLeave(): void {
        if (this._hovered || this._upButtonHovered || this._downButtonHovered) {
            this._hovered = false;
            this._upButtonHovered = false;
            this._downButtonHovered = false;
            this.invalidate();
        }
    }
    
    /**
     * Установка фокуса
     */
    setFocus(focused: boolean): void {
        if (this._focused !== focused) {
            this._focused = focused;
            this.invalidate();
        }
    }
    
    /**
     * Ограничивает значение диапазоном
     */
    private clampValue(val: number): number {
        return Math.max(this._minimum, Math.min(this._maximum, val));
    }
    
    /**
     * Вызывает слушателей изменения
     */
    private fireChange(): void {
        for (const listener of this._changeListeners) {
            listener(this, this._value);
        }
    }
}

/**
 * Целочисленный спиннер
 */
export class IntegerSpinnerControl extends SpinnerControl {
    constructor() {
        super();
        this.digits = 0;
    }
    
    get value(): number {
        return Math.floor(super.value);
    }
    
    set value(val: number) {
        super.value = Math.floor(val);
    }
}

/**
 * Спиннер с плавающей точкой
 */
export class FloatSpinnerControl extends SpinnerControl {
    constructor() {
        super();
        this.digits = 2;
        this.increment = 0.1;
    }
}

/**
 * Фабричная функция для создания спиннера
 */
export function createSpinner(config: {
    value?: number;
    minimum?: number;
    maximum?: number;
    increment?: number;
    digits?: number;
    readOnly?: boolean;
} = {}): SpinnerControl {
    const spinner = new SpinnerControl();
    
    if (config.minimum !== undefined) spinner.minimum = config.minimum;
    if (config.maximum !== undefined) spinner.maximum = config.maximum;
    if (config.increment !== undefined) spinner.increment = config.increment;
    if (config.digits !== undefined) spinner.digits = config.digits;
    if (config.value !== undefined) spinner.value = config.value;
    if (config.readOnly !== undefined) spinner.readOnly = config.readOnly;
    
    return spinner;
}
