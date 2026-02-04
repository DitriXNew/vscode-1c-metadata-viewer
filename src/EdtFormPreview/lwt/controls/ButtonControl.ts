/**
 * Контрол Button - кнопка
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.ButtonControlBase
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Тип кнопки
 */
export enum ButtonType {
    Regular = 'regular',
    Default = 'default',     // Кнопка по умолчанию (синяя)
    Hyperlink = 'hyperlink'  // Гиперссылка
}

/**
 * Контрол кнопки
 */
export class ButtonControl extends LightControl {
    private _title: string = '';
    private _font: Font | null = null;
    private _buttonType: ButtonType = ButtonType.Regular;
    private _pressed: boolean = false;
    private _hovered: boolean = false;
    private _iconPath: string | null = null;

    /**
     * Текст кнопки
     */
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.invalidate();
        }
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
     * Тип кнопки
     */
    get buttonType(): ButtonType {
        return this._buttonType;
    }

    set buttonType(value: ButtonType) {
        this._buttonType = value;
        this.invalidate();
    }

    /**
     * Нажата
     */
    get pressed(): boolean {
        return this._pressed;
    }

    set pressed(value: boolean) {
        this._pressed = value;
        this.invalidate();
    }

    /**
     * Под курсором
     */
    get hovered(): boolean {
        return this._hovered;
    }

    set hovered(value: boolean) {
        this._hovered = value;
        this.invalidate();
    }

    /**
     * Путь к иконке
     */
    get iconPath(): string | null {
        return this._iconPath;
    }

    set iconPath(value: string | null) {
        this._iconPath = value;
        this.invalidate();
    }

    /**
     * Получает эффективный шрифт
     */
    private getEffectiveFont(theme: ITheme): Font {
        return this._font ?? theme.defaultFont;
    }

    /**
     * Получает цвет фона кнопки
     */
    private getBackgroundColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledBackground;
        }

        if (this._buttonType === ButtonType.Default) {
            if (this._pressed) {
                return Color.fromHex('#005A9E');
            } else if (this._hovered) {
                return Color.fromHex('#0078D4');
            }
            return Color.fromHex('#0067C0');
        }

        if (this._pressed) {
            return theme.buttonBackgroundPressed;
        } else if (this._hovered) {
            return theme.buttonBackgroundHover;
        }
        return theme.buttonBackground;
    }

    /**
     * Получает цвет текста кнопки
     */
    private getTextColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledForeground;
        }

        if (this._buttonType === ButtonType.Default) {
            return Color.fromHex('#FFFFFF');
        }

        if (this._buttonType === ButtonType.Hyperlink) {
            return this._hovered ? Color.fromHex('#0055AA') : Color.fromHex('#0066CC');
        }

        return theme.buttonForeground;
    }

    /**
     * Получает цвет рамки
     */
    private getBorderColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledForeground;
        }

        if (this._buttonType === ButtonType.Default) {
            return Color.fromHex('#005A9E');
        }

        return theme.buttonBorder;
    }

    /**
     * Вычисляет предпочтительный размер с использованием контекста
     */
    calculatePreferredSize(ctx: CanvasRenderingContext2D): { width: number; height: number } {
        const theme = getTheme();
        const font = this.getEffectiveFont(theme);
        ctx.font = font.toCss();

        const metrics = ctx.measureText(this._title);
        const iconWidth = this._iconPath ? 20 : 0;
        const padding = theme.padding * 2;

        return {
            width: Math.ceil(metrics.width) + iconWidth + padding * 2,
            height: theme.controlHeight + 4
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

        if (this._buttonType === ButtonType.Hyperlink) {
            this.paintHyperlink(ctx, theme);
        } else {
            this.paintButton(ctx, theme);
        }
    }

    /**
     * Отрисовка обычной кнопки
     */
    private paintButton(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;

        ctx.save();

        // Фон
        const bgColor = this.getBackgroundColor(theme);
        ctx.fillStyle = bgColor.toCss();
        this.fillRoundRect(ctx, x, y, width, height, theme.borderRadius);

        // Рамка
        const borderColor = this.getBorderColor(theme);
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        this.strokeRoundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, theme.borderRadius);

        // Эффект нажатия
        if (this._pressed) {
            ctx.translate(0, 1);
        }

        // Текст
        const font = this.getEffectiveFont(theme);
        const textColor = this.getTextColor(theme);
        ctx.font = font.toCss();
        ctx.fillStyle = textColor.toCss();

        const metrics = ctx.measureText(this._title);
        const textX = x + (width - metrics.width) / 2;
        const textY = y + (height + font.size) / 2 - 2;

        ctx.fillText(this._title, textX, textY);

        ctx.restore();
    }

    /**
     * Отрисовка гиперссылки
     */
    private paintHyperlink(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;

        ctx.save();

        const font = this.getEffectiveFont(theme);
        const textColor = this.getTextColor(theme);
        ctx.font = font.toCss();
        ctx.fillStyle = textColor.toCss();

        const textY = y + (height + font.size) / 2 - 2;
        ctx.fillText(this._title, x, textY);

        // Подчёркивание при наведении
        if (this._hovered) {
            const metrics = ctx.measureText(this._title);
            ctx.strokeStyle = textColor.toCss();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, textY + 2);
            ctx.lineTo(x + metrics.width, textY + 2);
            ctx.stroke();
        }

        ctx.restore();
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
        this._pressed = false;
        this.invalidate();
    }

    /**
     * Обработка нажатия мыши
     */
    onMouseDown(): void {
        this._pressed = true;
        this.invalidate();
    }

    /**
     * Обработка отпускания мыши
     */
    onMouseUp(): void {
        this._pressed = false;
        this.invalidate();
    }
}
