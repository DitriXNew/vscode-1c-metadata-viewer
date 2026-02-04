/**
 * Контрол ScrollBar - полоса прокрутки
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.ScrollbarControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';
import { ScrollbarStyles } from '../theme/ControlStyles';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Ориентация скроллбара
 */
export enum ScrollBarOrientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

/**
 * Часть скроллбара
 */
enum ScrollBarPart {
    None = 'none',
    Track = 'track',
    Thumb = 'thumb',
    ButtonUp = 'button-up',
    ButtonDown = 'button-down'
}

// ============================================================================
// КОНТРОЛ SCROLLBAR
// ============================================================================

/**
 * ScrollBar контрол
 */
export class ScrollBarControl extends LightControl {
    // Значения
    private _value: number = 0;
    private _minimum: number = 0;
    private _maximum: number = 100;
    private _viewportSize: number = 10;
    private _smallChange: number = 1;
    private _largeChange: number = 10;
    
    // Настройки
    private _orientation: ScrollBarOrientation = ScrollBarOrientation.Vertical;
    private _showButtons: boolean = true;
    private _buttonSize: number = 17;
    private _minThumbSize: number = 20;
    
    // Состояние
    private _hoveredPart: ScrollBarPart = ScrollBarPart.None;
    private _pressedPart: ScrollBarPart = ScrollBarPart.None;
    private _isDragging: boolean = false;
    private _dragStartValue: number = 0;
    private _dragStartPos: number = 0;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Текущее значение */
    get value(): number {
        return this._value;
    }

    set value(value: number) {
        const clampedValue = Math.max(this._minimum, Math.min(this.getMaxValue(), value));
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
        this._minimum = value;
        this.value = this._value; // Переклампить
        this.invalidate();
    }

    /** Максимальное значение */
    get maximum(): number {
        return this._maximum;
    }

    set maximum(value: number) {
        this._maximum = value;
        this.value = this._value; // Переклампить
        this.invalidate();
    }

    /** Размер видимой области */
    get viewportSize(): number {
        return this._viewportSize;
    }

    set viewportSize(value: number) {
        this._viewportSize = Math.max(1, value);
        this.invalidate();
    }

    /** Малый шаг (стрелки) */
    get smallChange(): number {
        return this._smallChange;
    }

    set smallChange(value: number) {
        this._smallChange = Math.max(1, value);
    }

    /** Большой шаг (клик по трэку) */
    get largeChange(): number {
        return this._largeChange;
    }

    set largeChange(value: number) {
        this._largeChange = Math.max(1, value);
    }

    /** Ориентация */
    get orientation(): ScrollBarOrientation {
        return this._orientation;
    }

    set orientation(value: ScrollBarOrientation) {
        this._orientation = value;
        this.invalidate();
    }

    /** Показывать кнопки */
    get showButtons(): boolean {
        return this._showButtons;
    }

    set showButtons(value: boolean) {
        this._showButtons = value;
        this.invalidate();
    }

    // ========================================================================
    // ВЫЧИСЛЕНИЯ
    // ========================================================================

    /**
     * Максимальное допустимое значение
     */
    private getMaxValue(): number {
        return Math.max(this._minimum, this._maximum - this._viewportSize);
    }

    /**
     * Получить размер трэка (область для ползунка)
     */
    private getTrackSize(): number {
        const totalSize = this._orientation === ScrollBarOrientation.Vertical ?
            this.bounds.height : this.bounds.width;
        
        return this._showButtons ? totalSize - this._buttonSize * 2 : totalSize;
    }

    /**
     * Получить размер ползунка
     */
    private getThumbSize(): number {
        const trackSize = this.getTrackSize();
        const range = this._maximum - this._minimum;
        
        if (range <= 0) return trackSize;
        
        const thumbSize = Math.round((this._viewportSize / range) * trackSize);
        return Math.max(this._minThumbSize, Math.min(trackSize, thumbSize));
    }

    /**
     * Получить позицию ползунка
     */
    private getThumbPosition(): number {
        const trackSize = this.getTrackSize();
        const thumbSize = this.getThumbSize();
        const availableTrack = trackSize - thumbSize;
        const maxValue = this.getMaxValue();
        
        if (maxValue <= this._minimum) return 0;
        
        const ratio = (this._value - this._minimum) / (maxValue - this._minimum);
        return Math.round(ratio * availableTrack);
    }

    /**
     * Получить прямоугольник верхней/левой кнопки
     */
    private getButtonUpRect(): Rectangle {
        if (!this._showButtons) return Rectangle.EMPTY;
        
        if (this._orientation === ScrollBarOrientation.Vertical) {
            return new Rectangle(this.bounds.x, this.bounds.y, this.bounds.width, this._buttonSize);
        } else {
            return new Rectangle(this.bounds.x, this.bounds.y, this._buttonSize, this.bounds.height);
        }
    }

    /**
     * Получить прямоугольник нижней/правой кнопки
     */
    private getButtonDownRect(): Rectangle {
        if (!this._showButtons) return Rectangle.EMPTY;
        
        if (this._orientation === ScrollBarOrientation.Vertical) {
            return new Rectangle(
                this.bounds.x,
                this.bounds.y + this.bounds.height - this._buttonSize,
                this.bounds.width,
                this._buttonSize
            );
        } else {
            return new Rectangle(
                this.bounds.x + this.bounds.width - this._buttonSize,
                this.bounds.y,
                this._buttonSize,
                this.bounds.height
            );
        }
    }

    /**
     * Получить прямоугольник трэка
     */
    private getTrackRect(): Rectangle {
        const offset = this._showButtons ? this._buttonSize : 0;
        const size = this.getTrackSize();
        
        if (this._orientation === ScrollBarOrientation.Vertical) {
            return new Rectangle(this.bounds.x, this.bounds.y + offset, this.bounds.width, size);
        } else {
            return new Rectangle(this.bounds.x + offset, this.bounds.y, size, this.bounds.height);
        }
    }

    /**
     * Получить прямоугольник ползунка
     */
    private getThumbRect(): Rectangle {
        const trackRect = this.getTrackRect();
        const thumbSize = this.getThumbSize();
        const thumbPos = this.getThumbPosition();
        
        if (this._orientation === ScrollBarOrientation.Vertical) {
            return new Rectangle(
                trackRect.x + 1,
                trackRect.y + thumbPos,
                trackRect.width - 2,
                thumbSize
            );
        } else {
            return new Rectangle(
                trackRect.x + thumbPos,
                trackRect.y + 1,
                thumbSize,
                trackRect.height - 2
            );
        }
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        if (this._orientation === ScrollBarOrientation.Vertical) {
            return new Dimension(17, 100);
        } else {
            return new Dimension(100, 17);
        }
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка скроллбара
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        ctx.save();

        // Трэк
        this.paintTrack(ctx);

        // Ползунок
        this.paintThumb(ctx);

        // Кнопки
        if (this._showButtons) {
            this.paintButton(ctx, this.getButtonUpRect(), true);
            this.paintButton(ctx, this.getButtonDownRect(), false);
        }

        ctx.restore();
    }

    /**
     * Отрисовка трэка
     */
    private paintTrack(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const trackRect = this.getTrackRect();
        
        // Фон трэка
        ctx.fillStyle = new Color(245, 245, 245).toCss();
        ctx.fillRect(trackRect.x, trackRect.y, trackRect.width, trackRect.height);
    }

    /**
     * Отрисовка ползунка
     */
    private paintThumb(ctx: CanvasRenderingContext2D): void {
        const thumbRect = this.getThumbRect();
        
        if (thumbRect.width <= 0 || thumbRect.height <= 0) return;

        // Цвет в зависимости от состояния
        let color: Color;
        if (this._pressedPart === ScrollBarPart.Thumb || this._isDragging) {
            color = ScrollbarStyles.pressedColor;
        } else if (this._hoveredPart === ScrollBarPart.Thumb) {
            color = ScrollbarStyles.hotColor;
        } else {
            color = ScrollbarStyles.normalColor;
        }

        // Скруглённый прямоугольник
        const radius = 3;
        ctx.fillStyle = color.toCss();
        
        ctx.beginPath();
        ctx.moveTo(thumbRect.x + radius, thumbRect.y);
        ctx.lineTo(thumbRect.x + thumbRect.width - radius, thumbRect.y);
        ctx.quadraticCurveTo(thumbRect.x + thumbRect.width, thumbRect.y, 
                            thumbRect.x + thumbRect.width, thumbRect.y + radius);
        ctx.lineTo(thumbRect.x + thumbRect.width, thumbRect.y + thumbRect.height - radius);
        ctx.quadraticCurveTo(thumbRect.x + thumbRect.width, thumbRect.y + thumbRect.height,
                            thumbRect.x + thumbRect.width - radius, thumbRect.y + thumbRect.height);
        ctx.lineTo(thumbRect.x + radius, thumbRect.y + thumbRect.height);
        ctx.quadraticCurveTo(thumbRect.x, thumbRect.y + thumbRect.height,
                            thumbRect.x, thumbRect.y + thumbRect.height - radius);
        ctx.lineTo(thumbRect.x, thumbRect.y + radius);
        ctx.quadraticCurveTo(thumbRect.x, thumbRect.y, thumbRect.x + radius, thumbRect.y);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Отрисовка кнопки
     */
    private paintButton(ctx: CanvasRenderingContext2D, rect: Rectangle, isUp: boolean): void {
        const theme = getTheme();
        const part = isUp ? ScrollBarPart.ButtonUp : ScrollBarPart.ButtonDown;
        
        // Фон кнопки
        let bgColor: Color;
        if (this._pressedPart === part) {
            bgColor = new Color(220, 220, 220);
        } else if (this._hoveredPart === part) {
            bgColor = new Color(235, 235, 235);
        } else {
            bgColor = new Color(245, 245, 245);
        }
        
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        // Рамка
        ctx.strokeStyle = new Color(210, 210, 210).toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);

        // Стрелка
        ctx.fillStyle = theme.foreground.toCss();
        const arrowSize = 5;
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;

        ctx.beginPath();
        if (this._orientation === ScrollBarOrientation.Vertical) {
            if (isUp) {
                ctx.moveTo(cx, cy - arrowSize / 2);
                ctx.lineTo(cx - arrowSize, cy + arrowSize / 2);
                ctx.lineTo(cx + arrowSize, cy + arrowSize / 2);
            } else {
                ctx.moveTo(cx, cy + arrowSize / 2);
                ctx.lineTo(cx - arrowSize, cy - arrowSize / 2);
                ctx.lineTo(cx + arrowSize, cy - arrowSize / 2);
            }
        } else {
            if (isUp) {
                ctx.moveTo(cx - arrowSize / 2, cy);
                ctx.lineTo(cx + arrowSize / 2, cy - arrowSize);
                ctx.lineTo(cx + arrowSize / 2, cy + arrowSize);
            } else {
                ctx.moveTo(cx + arrowSize / 2, cy);
                ctx.lineTo(cx - arrowSize / 2, cy - arrowSize);
                ctx.lineTo(cx - arrowSize / 2, cy + arrowSize);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ
    // ========================================================================

    /**
     * Определить часть скроллбара по координатам
     */
    private getPartAtPoint(x: number, y: number): ScrollBarPart {
        if (!this.bounds.contains(x, y)) return ScrollBarPart.None;

        if (this._showButtons) {
            if (this.getButtonUpRect().contains(x, y)) return ScrollBarPart.ButtonUp;
            if (this.getButtonDownRect().contains(x, y)) return ScrollBarPart.ButtonDown;
        }

        if (this.getThumbRect().contains(x, y)) return ScrollBarPart.Thumb;
        if (this.getTrackRect().contains(x, y)) return ScrollBarPart.Track;

        return ScrollBarPart.None;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        if (this._isDragging) {
            // Перетаскивание ползунка
            const trackRect = this.getTrackRect();
            const thumbSize = this.getThumbSize();
            const availableTrack = this.getTrackSize() - thumbSize;
            
            const currentPos = this._orientation === ScrollBarOrientation.Vertical ?
                y - trackRect.y : x - trackRect.x;
            
            const delta = currentPos - this._dragStartPos;
            const maxValue = this.getMaxValue();
            
            if (availableTrack > 0) {
                const valueChange = (delta / availableTrack) * (maxValue - this._minimum);
                this.value = this._dragStartValue + valueChange;
            }
        } else {
            const newPart = this.getPartAtPoint(x, y);
            if (this._hoveredPart !== newPart) {
                this._hoveredPart = newPart;
                this.invalidate();
            }
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredPart !== ScrollBarPart.None && !this._isDragging) {
            this._hoveredPart = ScrollBarPart.None;
            this.invalidate();
        }
    }

    /**
     * Обработка нажатия мыши
     */
    onMouseDown(x: number, y: number): void {
        if (!this.enabled) return;

        const part = this.getPartAtPoint(x, y);
        this._pressedPart = part;

        switch (part) {
            case ScrollBarPart.Thumb:
                this._isDragging = true;
                this._dragStartValue = this._value;
                const trackRect = this.getTrackRect();
                this._dragStartPos = this._orientation === ScrollBarOrientation.Vertical ?
                    y - trackRect.y : x - trackRect.x;
                break;

            case ScrollBarPart.ButtonUp:
                this.value -= this._smallChange;
                break;

            case ScrollBarPart.ButtonDown:
                this.value += this._smallChange;
                break;

            case ScrollBarPart.Track:
                // Клик по трэку - большой шаг в сторону клика
                const thumbRect = this.getThumbRect();
                const pos = this._orientation === ScrollBarOrientation.Vertical ? y : x;
                const thumbCenter = this._orientation === ScrollBarOrientation.Vertical ?
                    thumbRect.y + thumbRect.height / 2 : thumbRect.x + thumbRect.width / 2;
                
                if (pos < thumbCenter) {
                    this.value -= this._largeChange;
                } else {
                    this.value += this._largeChange;
                }
                break;
        }

        this.invalidate();
    }

    /**
     * Обработка отпускания мыши
     */
    onMouseUp(x: number, y: number): void {
        this._isDragging = false;
        this._pressedPart = ScrollBarPart.None;
        this._hoveredPart = this.getPartAtPoint(x, y);
        this.invalidate();
    }

    /**
     * Обработка скролла колесом
     */
    onWheel(deltaY: number): void {
        if (deltaY > 0) {
            this.value += this._smallChange * 3;
        } else {
            this.value -= this._smallChange * 3;
        }
    }
}
