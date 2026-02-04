/**
 * Контрол Label - отображение текстовой метки
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.LabelControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Горизонтальное выравнивание текста
 */
export enum HorizontalAlignment {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

/**
 * Вертикальное выравнивание текста
 */
export enum VerticalAlignment {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
}

/**
 * Контрол для отображения текстовой метки
 */
export class LabelControl extends LightControl {
    private _text: string = '';
    private _font: Font | null = null;
    private _textColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    private _horizontalAlignment: HorizontalAlignment = HorizontalAlignment.Left;
    private _verticalAlignment: VerticalAlignment = VerticalAlignment.Middle;
    private _wordWrap: boolean = false;
    private _hyperlink: boolean = false;
    private _hyperlinkHover: boolean = false;

    /**
     * Текст метки
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
     * Шрифт (если null - используется шрифт из темы)
     */
    get font(): Font | null {
        return this._font;
    }

    set font(value: Font | null) {
        this._font = value;
        this.invalidate();
    }

    /**
     * Цвет текста (если null - используется цвет из темы)
     */
    get textColor(): Color | null {
        return this._textColor;
    }

    set textColor(value: Color | null) {
        this._textColor = value;
        this.invalidate();
    }

    /**
     * Цвет фона (если null - прозрачный)
     */
    get backgroundColor(): Color | null {
        return this._backgroundColor;
    }

    set backgroundColor(value: Color | null) {
        this._backgroundColor = value;
        this.invalidate();
    }

    /**
     * Горизонтальное выравнивание
     */
    get horizontalAlignment(): HorizontalAlignment {
        return this._horizontalAlignment;
    }

    set horizontalAlignment(value: HorizontalAlignment) {
        this._horizontalAlignment = value;
        this.invalidate();
    }

    /**
     * Вертикальное выравнивание
     */
    get verticalAlignment(): VerticalAlignment {
        return this._verticalAlignment;
    }

    set verticalAlignment(value: VerticalAlignment) {
        this._verticalAlignment = value;
        this.invalidate();
    }

    /**
     * Перенос слов
     */
    get wordWrap(): boolean {
        return this._wordWrap;
    }

    set wordWrap(value: boolean) {
        this._wordWrap = value;
        this.invalidate();
    }

    /**
     * Отображать как гиперссылку
     */
    get hyperlink(): boolean {
        return this._hyperlink;
    }

    set hyperlink(value: boolean) {
        this._hyperlink = value;
        this.invalidate();
    }

    /**
     * Получает эффективный шрифт с учётом темы
     */
    private getEffectiveFont(theme: ITheme): Font {
        return this._font ?? theme.defaultFont;
    }

    /**
     * Получает эффективный цвет текста с учётом темы
     */
    private getEffectiveTextColor(theme: ITheme): Color {
        if (!this.enabled) {
            return theme.disabledForeground;
        }
        if (this._hyperlink) {
            return Color.fromHex('#0066CC');
        }
        return this._textColor ?? theme.foreground;
    }

    /**
     * Вычисляет предпочтительный размер контрола с использованием контекста
     */
    calculatePreferredSize(ctx: CanvasRenderingContext2D): { width: number; height: number } {
        const theme = getTheme();
        const font = this.getEffectiveFont(theme);
        ctx.font = font.toCss();

        if (this._wordWrap && this.bounds.width > 0) {
            // Вычисление высоты с переносом слов
            const lines = this.wrapText(ctx, this._text, this.bounds.width);
            const lineHeight = font.size * 1.2;
            return {
                width: this.bounds.width,
                height: lines.length * lineHeight
            };
        } else {
            const metrics = ctx.measureText(this._text);
            return {
                width: Math.ceil(metrics.width),
                height: font.size + 4
            };
        }
    }

    /**
     * Разбивает текст на строки с учётом ширины
     */
    private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.length > 0 ? lines : [''];
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

        // Сохраняем состояние контекста
        ctx.save();

        // Устанавливаем clip region
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();

        // Рисуем фон если задан
        if (this._backgroundColor) {
            ctx.fillStyle = this._backgroundColor.toCss();
            ctx.fillRect(x, y, width, height);
        }

        // Настраиваем шрифт и цвет
        const font = this.getEffectiveFont(theme);
        const textColor = this.getEffectiveTextColor(theme);
        ctx.font = font.toCss();
        ctx.fillStyle = textColor.toCss();

        // Рисуем текст
        if (this._wordWrap) {
            this.paintWrappedText(ctx, font);
        } else {
            this.paintSingleLine(ctx, font);
        }

        // Подчёркивание для гиперссылки
        if (this._hyperlink && (this._hyperlinkHover || !this.enabled)) {
            this.paintUnderline(ctx, font, textColor);
        }

        ctx.restore();
    }

    /**
     * Отрисовка однострочного текста
     */
    private paintSingleLine(ctx: CanvasRenderingContext2D, font: Font): void {
        const { x, y, width, height } = this.bounds;
        const metrics = ctx.measureText(this._text);
        const textWidth = metrics.width;
        const textHeight = font.size;

        // Вычисляем позицию X
        let textX: number;
        switch (this._horizontalAlignment) {
            case HorizontalAlignment.Center:
                textX = x + (width - textWidth) / 2;
                break;
            case HorizontalAlignment.Right:
                textX = x + width - textWidth;
                break;
            default:
                textX = x;
        }

        // Вычисляем позицию Y (baseline)
        let textY: number;
        switch (this._verticalAlignment) {
            case VerticalAlignment.Top:
                textY = y + textHeight;
                break;
            case VerticalAlignment.Bottom:
                textY = y + height;
                break;
            default:
                textY = y + (height + textHeight) / 2 - 2;
        }

        ctx.fillText(this._text, textX, textY);
    }

    /**
     * Отрисовка многострочного текста
     */
    private paintWrappedText(ctx: CanvasRenderingContext2D, font: Font): void {
        const { x, y, width, height } = this.bounds;
        const lines = this.wrapText(ctx, this._text, width);
        const lineHeight = font.size * 1.2;
        const totalHeight = lines.length * lineHeight;

        // Вычисляем начальную позицию Y
        let startY: number;
        switch (this._verticalAlignment) {
            case VerticalAlignment.Top:
                startY = y + font.size;
                break;
            case VerticalAlignment.Bottom:
                startY = y + height - totalHeight + font.size;
                break;
            default:
                startY = y + (height - totalHeight) / 2 + font.size;
        }

        // Рисуем каждую строку
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineY = startY + i * lineHeight;

            let lineX: number;
            switch (this._horizontalAlignment) {
                case HorizontalAlignment.Center:
                    const lineWidth = ctx.measureText(line).width;
                    lineX = x + (width - lineWidth) / 2;
                    break;
                case HorizontalAlignment.Right:
                    const lineW = ctx.measureText(line).width;
                    lineX = x + width - lineW;
                    break;
                default:
                    lineX = x;
            }

            ctx.fillText(line, lineX, lineY);
        }
    }

    /**
     * Отрисовка подчёркивания для гиперссылки
     */
    private paintUnderline(ctx: CanvasRenderingContext2D, font: Font, color: Color): void {
        const { x, y, width, height } = this.bounds;
        const metrics = ctx.measureText(this._text);
        const textWidth = metrics.width;
        const textHeight = font.size;

        // Вычисляем позицию линии
        let lineX: number;
        switch (this._horizontalAlignment) {
            case HorizontalAlignment.Center:
                lineX = x + (width - textWidth) / 2;
                break;
            case HorizontalAlignment.Right:
                lineX = x + width - textWidth;
                break;
            default:
                lineX = x;
        }

        let lineY: number;
        switch (this._verticalAlignment) {
            case VerticalAlignment.Top:
                lineY = y + textHeight + 2;
                break;
            case VerticalAlignment.Bottom:
                lineY = y + height + 2;
                break;
            default:
                lineY = y + (height + textHeight) / 2;
        }

        ctx.strokeStyle = color.toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lineX, lineY);
        ctx.lineTo(lineX + textWidth, lineY);
        ctx.stroke();
    }

    /**
     * Обработка наведения мыши (для гиперссылок)
     */
    onMouseEnter(): void {
        if (this._hyperlink) {
            this._hyperlinkHover = true;
            this.invalidate();
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hyperlink) {
            this._hyperlinkHover = false;
            this.invalidate();
        }
    }
}
