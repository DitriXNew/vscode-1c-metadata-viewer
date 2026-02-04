/**
 * Контрол InputField - поле ввода
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.InputFieldViewControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Контрол для отображения поля ввода
 */
export class InputFieldControl extends LightControl {
    private _text: string = '';
    private _placeholder: string = '';
    private _font: Font | null = null;
    private _textColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    private _readOnly: boolean = false;
    private _focused: boolean = false;
    private _multiline: boolean = false;
    private _passwordMode: boolean = false;
    private _maxLength: number = 0;

    // Для кнопки очистки/выбора
    private _showClearButton: boolean = false;
    private _showDropdownButton: boolean = false;

    /**
     * Текст в поле ввода
     */
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        if (this._text !== value) {
            this._text = value;
            this.invalidate();
        }
    }

    /**
     * Placeholder текст
     */
    get placeholder(): string {
        return this._placeholder;
    }

    set placeholder(value: string) {
        this._placeholder = value;
        this.invalidate();
    }

    /**
     * Шрифт
     */
    get font(): Font | null {
        return this._font;
    }

    set font(value: Font | null) {
        this._font = value;
        this.invalidate();
    }

    /**
     * Цвет текста
     */
    get textColor(): Color | null {
        return this._textColor;
    }

    set textColor(value: Color | null) {
        this._textColor = value;
        this.invalidate();
    }

    /**
     * Цвет фона
     */
    get backgroundColor(): Color | null {
        return this._backgroundColor;
    }

    set backgroundColor(value: Color | null) {
        this._backgroundColor = value;
        this.invalidate();
    }

    /**
     * Только для чтения
     */
    get readOnly(): boolean {
        return this._readOnly;
    }

    set readOnly(value: boolean) {
        this._readOnly = value;
        this.invalidate();
    }

    /**
     * В фокусе
     */
    get focused(): boolean {
        return this._focused;
    }

    set focused(value: boolean) {
        this._focused = value;
        this.invalidate();
    }

    /**
     * Многострочный режим
     */
    get multiline(): boolean {
        return this._multiline;
    }

    set multiline(value: boolean) {
        this._multiline = value;
        this.invalidate();
    }

    /**
     * Режим пароля
     */
    get passwordMode(): boolean {
        return this._passwordMode;
    }

    set passwordMode(value: boolean) {
        this._passwordMode = value;
        this.invalidate();
    }

    /**
     * Показывать кнопку очистки
     */
    get showClearButton(): boolean {
        return this._showClearButton;
    }

    set showClearButton(value: boolean) {
        this._showClearButton = value;
        this.invalidate();
    }

    /**
     * Показывать кнопку выпадающего списка
     */
    get showDropdownButton(): boolean {
        return this._showDropdownButton;
    }

    set showDropdownButton(value: boolean) {
        this._showDropdownButton = value;
        this.invalidate();
    }

    /**
     * Получает эффективный шрифт с учётом темы
     */
    private getEffectiveFont(theme: ITheme): Font {
        return this._font ?? theme.defaultFont;
    }

    /**
     * Получает эффективный цвет фона
     */
    private getEffectiveBackgroundColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledBackground;
        }
        return this._backgroundColor ?? theme.inputBackground;
    }

    /**
     * Получает эффективный цвет текста
     */
    private getEffectiveTextColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledForeground;
        }
        return this._textColor ?? theme.inputForeground;
    }

    /**
     * Получает цвет рамки
     */
    private getBorderColor(theme: ITheme): Color {
        if (this._focused) {
            return theme.inputBorderFocused;
        }
        return theme.inputBorder;
    }

    /**
     * Получает ширину кнопок справа
     */
    private getButtonsWidth(): number {
        let width = 0;
        if (this._showClearButton) width += 18;
        if (this._showDropdownButton) width += 18;
        return width;
    }

    /**
     * Получает область для текста
     */
    private getTextArea(): Rectangle {
        const theme = getTheme();
        const padding = theme.padding;
        const buttonsWidth = this.getButtonsWidth();

        return new Rectangle(
            this.bounds.x + padding,
            this.bounds.y + padding,
            this.bounds.width - padding * 2 - buttonsWidth,
            this.bounds.height - padding * 2
        );
    }

    /**
     * Вычисляет предпочтительный размер контрола с использованием контекста
     */
    calculatePreferredSize(ctx: CanvasRenderingContext2D): { width: number; height: number } {
        const theme = getTheme();
        const font = this.getEffectiveFont(theme);
        ctx.font = font.toCss();

        const metrics = ctx.measureText(this._text || this._placeholder || 'W');
        const height = this._multiline ? theme.controlHeight * 3 : theme.controlHeight;

        return {
            width: Math.max(100, Math.ceil(metrics.width) + theme.padding * 2 + this.getButtonsWidth()),
            height: height
        };
    }

    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();
        const { x, y, width, height } = this.bounds;

        ctx.save();

        // Рисуем фон
        const bgColor = this.getEffectiveBackgroundColor(theme);
        ctx.fillStyle = bgColor.toCss();
        this.fillRoundRect(ctx, x, y, width, height, theme.borderRadius);

        // Рисуем рамку
        const borderColor = this.getBorderColor(theme);
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = this._focused ? 2 : 1;
        this.strokeRoundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, theme.borderRadius);

        // Рисуем текст или placeholder
        this.paintText(ctx, theme);

        // Рисуем кнопки
        if (this._showClearButton || this._showDropdownButton) {
            this.paintButtons(ctx, theme);
        }

        ctx.restore();
    }

    /**
     * Отрисовка текста
     */
    private paintText(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const textArea = this.getTextArea();
        const font = this.getEffectiveFont(theme);
        ctx.font = font.toCss();

        // Clip по области текста
        ctx.beginPath();
        ctx.rect(textArea.x, textArea.y, textArea.width, textArea.height);
        ctx.clip();

        let displayText = this._text;
        let textColor: Color;

        if (!displayText && this._placeholder) {
            displayText = this._placeholder;
            textColor = theme.disabledForeground;
        } else {
            textColor = this.getEffectiveTextColor(theme);
        }

        // Маскируем пароль
        if (this._passwordMode && this._text) {
            displayText = '•'.repeat(this._text.length);
        }

        ctx.fillStyle = textColor.toCss();

        if (this._multiline) {
            this.paintMultilineText(ctx, displayText, textArea, font);
        } else {
            // Вертикальное центрирование
            const textY = textArea.y + (textArea.height + font.size) / 2 - 2;
            ctx.fillText(displayText, textArea.x, textY);
        }
    }

    /**
     * Отрисовка многострочного текста
     */
    private paintMultilineText(ctx: CanvasRenderingContext2D, text: string, area: Rectangle, font: Font): void {
        const lines = text.split('\n');
        const lineHeight = font.size * 1.3;
        let y = area.y + font.size;

        for (const line of lines) {
            if (y > area.y + area.height) break;
            ctx.fillText(line, area.x, y);
            y += lineHeight;
        }
    }

    /**
     * Отрисовка кнопок
     */
    private paintButtons(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const buttonSize = 16;
        let buttonX = this.bounds.x + this.bounds.width - buttonSize - 2;
        const buttonY = this.bounds.y + (this.bounds.height - buttonSize) / 2;

        // Кнопка выпадающего списка
        if (this._showDropdownButton) {
            this.paintDropdownButton(ctx, buttonX, buttonY, buttonSize, theme);
            buttonX -= buttonSize + 2;
        }

        // Кнопка очистки
        if (this._showClearButton && this._text) {
            this.paintClearButton(ctx, buttonX, buttonY, buttonSize, theme);
        }
    }

    /**
     * Рисует кнопку выпадающего списка
     */
    private paintDropdownButton(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: ITheme): void {
        const color = this.enabled ? theme.foreground : theme.disabledForeground;
        ctx.fillStyle = color.toCss();

        // Треугольник вниз
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const arrowSize = 4;

        ctx.beginPath();
        ctx.moveTo(centerX - arrowSize, centerY - arrowSize / 2);
        ctx.lineTo(centerX + arrowSize, centerY - arrowSize / 2);
        ctx.lineTo(centerX, centerY + arrowSize / 2);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Рисует кнопку очистки
     */
    private paintClearButton(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: ITheme): void {
        const color = this.enabled ? theme.disabledForeground : theme.disabledForeground.darker(0.5);
        ctx.strokeStyle = color.toCss();
        ctx.lineWidth = 1.5;

        // Крестик
        const padding = 4;
        ctx.beginPath();
        ctx.moveTo(x + padding, y + padding);
        ctx.lineTo(x + size - padding, y + size - padding);
        ctx.moveTo(x + size - padding, y + padding);
        ctx.lineTo(x + padding, y + size - padding);
        ctx.stroke();
    }

    /**
     * Рисует скруглённый прямоугольник с заливкой
     */
    private fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
    }

    /**
     * Рисует скруглённый прямоугольник с обводкой
     */
    private strokeRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.stroke();
    }

    /**
     * Обработка получения фокуса
     */
    onFocus(): void {
        this._focused = true;
        this.invalidate();
    }

    /**
     * Обработка потери фокуса
     */
    onBlur(): void {
        this._focused = false;
        this.invalidate();
    }
}
