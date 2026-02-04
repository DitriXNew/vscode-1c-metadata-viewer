/**
 * Контрол Checkbox - флажок
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.CheckboxViewControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Состояние флажка
 */
export enum CheckState {
    Unchecked = 0,
    Checked = 1,
    Indeterminate = 2
}

/**
 * Контрол флажка
 */
export class CheckboxControl extends LightControl {
    private _text: string = '';
    private _checkState: CheckState = CheckState.Unchecked;
    private _font: Font | null = null;
    private _textColor: Color | null = null;
    private _hovered: boolean = false;
    private _threeState: boolean = false;
    private _readOnly: boolean = false;

    private static readonly BOX_SIZE = 14;
    private static readonly BOX_MARGIN = 4;

    /**
     * Текст рядом с флажком
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
     * Состояние флажка
     */
    get checkState(): CheckState {
        return this._checkState;
    }

    set checkState(value: CheckState) {
        if (this._checkState !== value) {
            this._checkState = value;
            this.invalidate();
        }
    }

    /**
     * Проверен ли флажок
     */
    get checked(): boolean {
        return this._checkState === CheckState.Checked;
    }

    set checked(value: boolean) {
        this.checkState = value ? CheckState.Checked : CheckState.Unchecked;
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
     * Поддержка трёх состояний
     */
    get threeState(): boolean {
        return this._threeState;
    }

    set threeState(value: boolean) {
        this._threeState = value;
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
     * Получает эффективный шрифт
     */
    private getEffectiveFont(theme: ITheme): Font {
        return this._font ?? theme.defaultFont;
    }

    /**
     * Получает эффективный цвет текста
     */
    private getEffectiveTextColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledForeground;
        }
        return this._textColor ?? theme.foreground;
    }

    /**
     * Вычисляет предпочтительный размер с использованием контекста
     */
    calculatePreferredSize(ctx: CanvasRenderingContext2D): { width: number; height: number } {
        const theme = getTheme();
        const font = this.getEffectiveFont(theme);
        ctx.font = font.toCss();

        const metrics = ctx.measureText(this._text);
        const boxSize = CheckboxControl.BOX_SIZE;
        const boxMargin = CheckboxControl.BOX_MARGIN;

        return {
            width: boxSize + boxMargin + Math.ceil(metrics.width),
            height: Math.max(boxSize, font.size + 4)
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
        const { x, y, height } = this.bounds;
        const boxSize = CheckboxControl.BOX_SIZE;
        const boxMargin = CheckboxControl.BOX_MARGIN;

        ctx.save();

        // Позиция квадратика (вертикально по центру)
        const boxY = y + (height - boxSize) / 2;

        // Рисуем квадратик
        this.paintBox(ctx, x, boxY, boxSize, theme);

        // Рисуем галочку или минус
        if (this._checkState === CheckState.Checked) {
            this.paintCheckmark(ctx, x, boxY, boxSize, theme);
        } else if (this._checkState === CheckState.Indeterminate) {
            this.paintIndeterminate(ctx, x, boxY, boxSize, theme);
        }

        // Рисуем текст
        if (this._text) {
            const font = this.getEffectiveFont(theme);
            const textColor = this.getEffectiveTextColor(theme);
            ctx.font = font.toCss();
            ctx.fillStyle = textColor.toCss();

            const textX = x + boxSize + boxMargin;
            const textY = y + (height + font.size) / 2 - 2;
            ctx.fillText(this._text, textX, textY);
        }

        ctx.restore();
    }

    /**
     * Отрисовка квадратика
     */
    private paintBox(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: ITheme): void {
        // Фон
        const bgColor = this.enabled ? theme.inputBackground : theme.disabledBackground;
        ctx.fillStyle = bgColor.toCss();
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 2);
        ctx.fill();

        // Рамка
        const borderColor = this._hovered && this.enabled 
            ? theme.inputBorderFocused 
            : theme.inputBorder;
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x + 0.5, y + 0.5, size - 1, size - 1, 2);
        ctx.stroke();
    }

    /**
     * Отрисовка галочки
     */
    private paintCheckmark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: ITheme): void {
        const color = this.enabled ? Color.fromHex('#0067C0') : theme.disabledForeground;
        ctx.strokeStyle = color.toCss();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const padding = 3;
        const checkX = x + padding;
        const checkY = y + padding;
        const checkSize = size - padding * 2;

        ctx.beginPath();
        // Левая часть галочки
        ctx.moveTo(checkX, checkY + checkSize * 0.5);
        ctx.lineTo(checkX + checkSize * 0.35, checkY + checkSize * 0.75);
        // Правая часть галочки
        ctx.lineTo(checkX + checkSize, checkY + checkSize * 0.15);
        ctx.stroke();
    }

    /**
     * Отрисовка неопределённого состояния
     */
    private paintIndeterminate(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: ITheme): void {
        const color = this.enabled ? Color.fromHex('#0067C0') : theme.disabledForeground;
        ctx.fillStyle = color.toCss();

        const padding = 4;
        const barHeight = 2;
        ctx.fillRect(
            x + padding,
            y + (size - barHeight) / 2,
            size - padding * 2,
            barHeight
        );
    }

    /**
     * Переключает состояние
     */
    toggle(): void {
        if (this._readOnly || !this.enabled) {
            return;
        }

        if (this._threeState) {
            switch (this._checkState) {
                case CheckState.Unchecked:
                    this._checkState = CheckState.Checked;
                    break;
                case CheckState.Checked:
                    this._checkState = CheckState.Indeterminate;
                    break;
                case CheckState.Indeterminate:
                    this._checkState = CheckState.Unchecked;
                    break;
            }
        } else {
            this._checkState = this._checkState === CheckState.Checked 
                ? CheckState.Unchecked 
                : CheckState.Checked;
        }

        this.invalidate();
    }

    /**
     * Обработка наведения мыши
     */
    onMouseEnter(): void {
        this._hovered = true;
        this.invalidate();
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        this._hovered = false;
        this.invalidate();
    }

    /**
     * Обработка клика
     */
    onClick(): void {
        this.toggle();
    }
}
