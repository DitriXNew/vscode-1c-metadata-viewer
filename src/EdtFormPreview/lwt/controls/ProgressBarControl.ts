/**
 * Контрол ProgressBar - индикатор прогресса
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.ProgressBarControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';
import { ProgressBarStyles } from '../theme/ControlStyles';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Ориентация прогресс-бара
 */
export enum ProgressOrientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

/**
 * Стиль прогресс-бара
 */
export enum ProgressBarStyle {
    /** Сплошной */
    Solid = 'solid',
    /** Сегментированный */
    Segmented = 'segmented',
    /** Marquee (бесконечный) */
    Marquee = 'marquee'
}

// ============================================================================
// КОНТРОЛ PROGRESSBAR
// ============================================================================

/**
 * ProgressBar контрол
 */
export class ProgressBarControl extends LightControl {
    // Значения
    private _value: number = 0;
    private _minimum: number = 0;
    private _maximum: number = 100;
    
    // Настройки
    private _orientation: ProgressOrientation = ProgressOrientation.Horizontal;
    private _style: ProgressBarStyle = ProgressBarStyle.Solid;
    private _showText: boolean = false;
    private _textFormat: string = '{percent}%';
    
    // Цвета (можно переопределить)
    private _progressColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    
    // Marquee анимация
    private _marqueePosition: number = 0;
    private _marqueeWidth: number = 50;
    private _marqueeSpeed: number = 2;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Текущее значение */
    get value(): number {
        return this._value;
    }

    set value(value: number) {
        const clampedValue = Math.max(this._minimum, Math.min(this._maximum, value));
        if (this._value !== clampedValue) {
            this._value = clampedValue;
            this.invalidate();
        }
    }

    /** Минимальное значение */
    get minimum(): number {
        return this._minimum;
    }

    set minimum(value: number) {
        if (value <= this._maximum) {
            this._minimum = value;
            if (this._value < value) {
                this._value = value;
            }
            this.invalidate();
        }
    }

    /** Максимальное значение */
    get maximum(): number {
        return this._maximum;
    }

    set maximum(value: number) {
        if (value >= this._minimum) {
            this._maximum = value;
            if (this._value > value) {
                this._value = value;
            }
            this.invalidate();
        }
    }

    /** Процент заполнения */
    get percent(): number {
        const range = this._maximum - this._minimum;
        if (range <= 0) return 0;
        return ((this._value - this._minimum) / range) * 100;
    }

    set percent(value: number) {
        const clampedPercent = Math.max(0, Math.min(100, value));
        const range = this._maximum - this._minimum;
        this.value = this._minimum + (clampedPercent / 100) * range;
    }

    /** Ориентация */
    get orientation(): ProgressOrientation {
        return this._orientation;
    }

    set orientation(value: ProgressOrientation) {
        this._orientation = value;
        this.invalidate();
    }

    /** Стиль */
    get style(): ProgressBarStyle {
        return this._style;
    }

    set style(value: ProgressBarStyle) {
        this._style = value;
        this.invalidate();
    }

    /** Показывать текст */
    get showText(): boolean {
        return this._showText;
    }

    set showText(value: boolean) {
        this._showText = value;
        this.invalidate();
    }

    /** Формат текста */
    get textFormat(): string {
        return this._textFormat;
    }

    set textFormat(value: string) {
        this._textFormat = value;
        this.invalidate();
    }

    /** Цвет прогресса */
    get progressColor(): Color | null {
        return this._progressColor;
    }

    set progressColor(value: Color | null) {
        this._progressColor = value;
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ
    // ========================================================================

    /**
     * Увеличить значение
     */
    increment(amount: number = 1): void {
        this.value += amount;
    }

    /**
     * Уменьшить значение
     */
    decrement(amount: number = 1): void {
        this.value -= amount;
    }

    /**
     * Сбросить значение
     */
    reset(): void {
        this._value = this._minimum;
        this.invalidate();
    }

    /**
     * Шаг анимации marquee
     */
    stepMarquee(): void {
        if (this._style === ProgressBarStyle.Marquee) {
            const totalWidth = this._orientation === ProgressOrientation.Horizontal ?
                this.bounds.width : this.bounds.height;
            
            this._marqueePosition += this._marqueeSpeed;
            if (this._marqueePosition > totalWidth + this._marqueeWidth) {
                this._marqueePosition = -this._marqueeWidth;
            }
            this.invalidate();
        }
    }

    /**
     * Получить форматированный текст
     */
    private getFormattedText(): string {
        return this._textFormat
            .replace('{value}', String(Math.round(this._value)))
            .replace('{minimum}', String(this._minimum))
            .replace('{maximum}', String(this._maximum))
            .replace('{percent}', String(Math.round(this.percent)));
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        if (this._orientation === ProgressOrientation.Horizontal) {
            return new Dimension(200, 20);
        } else {
            return new Dimension(20, 200);
        }
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка прогресс-бара
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        // Фон
        this.paintBackground(ctx);

        // Прогресс
        if (this._style === ProgressBarStyle.Marquee) {
            this.paintMarquee(ctx);
        } else {
            this.paintProgress(ctx);
        }

        // Рамка
        this.paintBorder(ctx);

        // Текст
        if (this._showText && this._style !== ProgressBarStyle.Marquee) {
            this.paintText(ctx);
        }

        ctx.restore();
    }

    /**
     * Отрисовка фона
     */
    private paintBackground(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const bgColor = this._backgroundColor || theme.inputBackground;
        
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    }

    /**
     * Отрисовка прогресса
     */
    private paintProgress(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const percent = this.percent;
        
        if (percent <= 0) return;

        // Цвет прогресса - жёлтый 1С по умолчанию
        const progressColor = this._progressColor || new Color(255, 225, 0);
        
        let progressWidth: number;
        let progressHeight: number;
        let progressX = this.bounds.x + 1;
        let progressY = this.bounds.y + 1;

        if (this._orientation === ProgressOrientation.Horizontal) {
            progressWidth = Math.round((this.bounds.width - 2) * (percent / 100));
            progressHeight = this.bounds.height - 2;
        } else {
            progressWidth = this.bounds.width - 2;
            progressHeight = Math.round((this.bounds.height - 2) * (percent / 100));
            progressY = this.bounds.y + this.bounds.height - 1 - progressHeight;
        }

        if (this._style === ProgressBarStyle.Segmented) {
            // Сегментированный стиль
            this.paintSegmented(ctx, progressX, progressY, progressWidth, progressHeight, progressColor);
        } else {
            // Сплошной стиль
            ctx.fillStyle = progressColor.toCss();
            ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
            
            // Лёгкий градиент для объёма
            const gradient = this._orientation === ProgressOrientation.Horizontal ?
                ctx.createLinearGradient(progressX, progressY, progressX, progressY + progressHeight) :
                ctx.createLinearGradient(progressX, progressY, progressX + progressWidth, progressY);
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
        }
    }

    /**
     * Отрисовка сегментированного стиля
     */
    private paintSegmented(
        ctx: CanvasRenderingContext2D,
        x: number, y: number,
        width: number, height: number,
        color: Color
    ): void {
        const segmentWidth = this._orientation === ProgressOrientation.Horizontal ? 8 : height;
        const segmentHeight = this._orientation === ProgressOrientation.Horizontal ? height : 8;
        const gap = 2;

        ctx.fillStyle = color.toCss();

        if (this._orientation === ProgressOrientation.Horizontal) {
            let currentX = x;
            while (currentX < x + width) {
                const w = Math.min(segmentWidth, x + width - currentX);
                ctx.fillRect(currentX, y, w - gap, segmentHeight);
                currentX += segmentWidth;
            }
        } else {
            let currentY = y + height;
            while (currentY > y) {
                const h = Math.min(segmentHeight, currentY - y);
                ctx.fillRect(x, currentY - h + gap, width, h - gap);
                currentY -= segmentHeight;
            }
        }
    }

    /**
     * Отрисовка marquee
     */
    private paintMarquee(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const color = this._progressColor || new Color(255, 225, 0);
        
        ctx.fillStyle = color.toCss();
        
        if (this._orientation === ProgressOrientation.Horizontal) {
            const x = Math.max(this.bounds.x + 1, this.bounds.x + 1 + this._marqueePosition);
            const maxX = this.bounds.x + this.bounds.width - 1;
            const w = Math.min(this._marqueeWidth, maxX - x);
            
            if (w > 0 && x < maxX) {
                ctx.fillRect(x, this.bounds.y + 1, w, this.bounds.height - 2);
            }
        } else {
            const y = Math.max(this.bounds.y + 1, this.bounds.y + 1 + this._marqueePosition);
            const maxY = this.bounds.y + this.bounds.height - 1;
            const h = Math.min(this._marqueeWidth, maxY - y);
            
            if (h > 0 && y < maxY) {
                ctx.fillRect(this.bounds.x + 1, y, this.bounds.width - 2, h);
            }
        }
    }

    /**
     * Отрисовка рамки
     */
    private paintBorder(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(
            this.bounds.x + 0.5,
            this.bounds.y + 0.5,
            this.bounds.width - 1,
            this.bounds.height - 1
        );
    }

    /**
     * Отрисовка текста
     */
    private paintText(ctx: CanvasRenderingContext2D): void {
        const text = this.getFormattedText();
        const font = getTheme().defaultFont;
        
        ctx.font = font.toCss();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Цвет текста прогресса
        ctx.fillStyle = ProgressBarStyles.textColor.toCss();
        
        const textX = this.bounds.x + this.bounds.width / 2;
        const textY = this.bounds.y + this.bounds.height / 2;
        
        ctx.fillText(text, textX, textY);
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }
}
