/**
 * Контрол Splitter - разделитель панелей
 * Позволяет изменять размер соседних панелей перетаскиванием
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Ориентация сплиттера
 */
export enum SplitterOrientation {
    /** Горизонтальный разделитель (панели слева и справа) */
    Horizontal = 'horizontal',
    /** Вертикальный разделитель (панели сверху и снизу) */
    Vertical = 'vertical'
}

/**
 * Стиль сплиттера
 */
export enum SplitterStyle {
    /** Тонкая линия */
    Thin = 'thin',
    /** Стандартный с ручкой */
    Standard = 'standard',
    /** Широкий с текстурой */
    Wide = 'wide'
}

// ============================================================================
// КОНТРОЛ SPLITTER
// ============================================================================

/**
 * Splitter контрол
 */
export class SplitterControl extends LightControl {
    // Настройки
    private _orientation: SplitterOrientation = SplitterOrientation.Horizontal;
    private _style: SplitterStyle = SplitterStyle.Standard;
    private _size: number = 5;
    private _minPosition: number = 50;
    private _maxPosition: number = Infinity;
    
    // Позиция (относительная или абсолютная)
    private _position: number = 200;
    private _usePercent: boolean = false;
    private _percent: number = 50;
    
    // Состояние
    private _isHovered: boolean = false;
    private _isDragging: boolean = false;
    private _dragStartPos: number = 0;
    private _dragStartPosition: number = 0;
    
    // Коллапс
    private _collapsible: boolean = false;
    private _isCollapsed: boolean = false;
    private _collapsedPosition: number = 0;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Ориентация */
    get orientation(): SplitterOrientation {
        return this._orientation;
    }

    set orientation(value: SplitterOrientation) {
        this._orientation = value;
        this.invalidate();
    }

    /** Стиль */
    get style(): SplitterStyle {
        return this._style;
    }

    set style(value: SplitterStyle) {
        this._style = value;
        this.invalidate();
    }

    /** Толщина сплиттера */
    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = Math.max(1, value);
        this.invalidate();
    }

    /** Позиция (в пикселях или процентах) */
    get position(): number {
        return this._position;
    }

    set position(value: number) {
        const clampedValue = Math.max(this._minPosition, 
            Math.min(this._maxPosition, value));
        if (this._position !== clampedValue) {
            this._position = clampedValue;
            this.invalidate();
        }
    }

    /** Минимальная позиция */
    get minPosition(): number {
        return this._minPosition;
    }

    set minPosition(value: number) {
        this._minPosition = value;
        this.position = this._position; // Переклампить
    }

    /** Максимальная позиция */
    get maxPosition(): number {
        return this._maxPosition;
    }

    set maxPosition(value: number) {
        this._maxPosition = value;
        this.position = this._position; // Переклампить
    }

    /** Можно ли сворачивать */
    get collapsible(): boolean {
        return this._collapsible;
    }

    set collapsible(value: boolean) {
        this._collapsible = value;
        this.invalidate();
    }

    /** Свёрнут ли */
    get isCollapsed(): boolean {
        return this._isCollapsed;
    }

    /** Идёт ли перетаскивание */
    get isDragging(): boolean {
        return this._isDragging;
    }

    // ========================================================================
    // МЕТОДЫ
    // ========================================================================

    /**
     * Свернуть панель
     */
    collapse(): void {
        if (this._collapsible && !this._isCollapsed) {
            this._collapsedPosition = this._position;
            this._position = this._minPosition;
            this._isCollapsed = true;
            this.invalidate();
        }
    }

    /**
     * Развернуть панель
     */
    expand(): void {
        if (this._isCollapsed) {
            this._position = this._collapsedPosition;
            this._isCollapsed = false;
            this.invalidate();
        }
    }

    /**
     * Переключить состояние
     */
    toggle(): void {
        if (this._isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        if (this._orientation === SplitterOrientation.Horizontal) {
            return new Dimension(this._size, 100);
        } else {
            return new Dimension(100, this._size);
        }
    }

    /**
     * Получить область первой панели
     */
    getFirstPanelRect(containerBounds: Rectangle): Rectangle {
        if (this._orientation === SplitterOrientation.Horizontal) {
            return new Rectangle(
                containerBounds.x,
                containerBounds.y,
                this._position,
                containerBounds.height
            );
        } else {
            return new Rectangle(
                containerBounds.x,
                containerBounds.y,
                containerBounds.width,
                this._position
            );
        }
    }

    /**
     * Получить область сплиттера
     */
    getSplitterRect(containerBounds: Rectangle): Rectangle {
        if (this._orientation === SplitterOrientation.Horizontal) {
            return new Rectangle(
                containerBounds.x + this._position,
                containerBounds.y,
                this._size,
                containerBounds.height
            );
        } else {
            return new Rectangle(
                containerBounds.x,
                containerBounds.y + this._position,
                containerBounds.width,
                this._size
            );
        }
    }

    /**
     * Получить область второй панели
     */
    getSecondPanelRect(containerBounds: Rectangle): Rectangle {
        if (this._orientation === SplitterOrientation.Horizontal) {
            const x = containerBounds.x + this._position + this._size;
            return new Rectangle(
                x,
                containerBounds.y,
                containerBounds.width - this._position - this._size,
                containerBounds.height
            );
        } else {
            const y = containerBounds.y + this._position + this._size;
            return new Rectangle(
                containerBounds.x,
                y,
                containerBounds.width,
                containerBounds.height - this._position - this._size
            );
        }
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка сплиттера
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        switch (this._style) {
            case SplitterStyle.Thin:
                this.paintThin(ctx);
                break;
            case SplitterStyle.Wide:
                this.paintWide(ctx);
                break;
            default:
                this.paintStandard(ctx);
                break;
        }

        // Кнопка коллапса
        if (this._collapsible) {
            this.paintCollapseButton(ctx);
        }

        ctx.restore();
    }

    /**
     * Тонкий стиль
     */
    private paintThin(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const { x, y, width, height } = this.bounds;
        
        // Фон
        const bgColor = this._isHovered || this._isDragging ?
            theme.buttonBackgroundHover : theme.groupBackground;
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, height);

        // Линия посередине
        ctx.strokeStyle = theme.groupBorder.toCss();
        ctx.lineWidth = 1;
        
        if (this._orientation === SplitterOrientation.Horizontal) {
            const lineX = x + width / 2;
            ctx.beginPath();
            ctx.moveTo(lineX + 0.5, y);
            ctx.lineTo(lineX + 0.5, y + height);
            ctx.stroke();
        } else {
            const lineY = y + height / 2;
            ctx.beginPath();
            ctx.moveTo(x, lineY + 0.5);
            ctx.lineTo(x + width, lineY + 0.5);
            ctx.stroke();
        }
    }

    /**
     * Стандартный стиль с ручкой
     */
    private paintStandard(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const { x, y, width, height } = this.bounds;
        
        // Фон
        const bgColor = this._isHovered || this._isDragging ?
            new Color(230, 230, 230) : theme.groupBackground;
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, height);

        // Рамки
        ctx.strokeStyle = theme.groupBorder.toCss();
        ctx.lineWidth = 1;

        if (this._orientation === SplitterOrientation.Horizontal) {
            // Левая и правая рамка
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y);
            ctx.lineTo(x + 0.5, y + height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + width - 0.5, y);
            ctx.lineTo(x + width - 0.5, y + height);
            ctx.stroke();

            // Ручка (точки)
            this.paintGrip(ctx, x + width / 2, y + height / 2, true);
        } else {
            // Верхняя и нижняя рамка
            ctx.beginPath();
            ctx.moveTo(x, y + 0.5);
            ctx.lineTo(x + width, y + 0.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, y + height - 0.5);
            ctx.lineTo(x + width, y + height - 0.5);
            ctx.stroke();

            // Ручка (точки)
            this.paintGrip(ctx, x + width / 2, y + height / 2, false);
        }
    }

    /**
     * Широкий стиль
     */
    private paintWide(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const { x, y, width, height } = this.bounds;
        
        // Градиент
        let gradient: CanvasGradient;
        if (this._orientation === SplitterOrientation.Horizontal) {
            gradient = ctx.createLinearGradient(x, y, x + width, y);
        } else {
            gradient = ctx.createLinearGradient(x, y, x, y + height);
        }
        
        const baseColor = this._isHovered || this._isDragging ?
            new Color(220, 220, 220) : new Color(240, 240, 240);
        
        gradient.addColorStop(0, baseColor.darker(0.05).toCss());
        gradient.addColorStop(0.5, baseColor.toCss());
        gradient.addColorStop(1, baseColor.darker(0.05).toCss());
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Рамки
        ctx.strokeStyle = theme.groupBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        // Ручка
        this.paintGrip(ctx, x + width / 2, y + height / 2, 
            this._orientation === SplitterOrientation.Horizontal);
    }

    /**
     * Отрисовка ручки (точки)
     */
    private paintGrip(ctx: CanvasRenderingContext2D, cx: number, cy: number, vertical: boolean): void {
        const dotColor = new Color(160, 160, 160);
        const dotSize = 2;
        const dotSpacing = 4;
        const dotCount = 3;

        ctx.fillStyle = dotColor.toCss();

        for (let i = -1; i <= 1; i++) {
            for (let j = 0; j < dotCount; j++) {
                const offset = (j - (dotCount - 1) / 2) * dotSpacing;
                
                let dx: number, dy: number;
                if (vertical) {
                    dx = i * dotSpacing;
                    dy = offset;
                } else {
                    dx = offset;
                    dy = i * dotSpacing;
                }
                
                ctx.beginPath();
                ctx.arc(cx + dx, cy + dy, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /**
     * Кнопка коллапса
     */
    private paintCollapseButton(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const { x, y, width, height } = this.bounds;
        
        const btnSize = 16;
        let btnX: number, btnY: number;
        
        if (this._orientation === SplitterOrientation.Horizontal) {
            btnX = x + (width - btnSize) / 2;
            btnY = y + 4;
        } else {
            btnX = x + 4;
            btnY = y + (height - btnSize) / 2;
        }

        // Фон кнопки
        ctx.fillStyle = new Color(255, 255, 255).toCss();
        ctx.fillRect(btnX, btnY, btnSize, btnSize);
        
        ctx.strokeStyle = theme.groupBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(btnX + 0.5, btnY + 0.5, btnSize - 1, btnSize - 1);

        // Стрелка
        ctx.fillStyle = theme.foreground.toCss();
        const arrowSize = 4;
        const arrowCx = btnX + btnSize / 2;
        const arrowCy = btnY + btnSize / 2;

        ctx.beginPath();
        if (this._orientation === SplitterOrientation.Horizontal) {
            if (this._isCollapsed) {
                // Стрелка вправо
                ctx.moveTo(arrowCx - arrowSize / 2, arrowCy - arrowSize);
                ctx.lineTo(arrowCx + arrowSize / 2, arrowCy);
                ctx.lineTo(arrowCx - arrowSize / 2, arrowCy + arrowSize);
            } else {
                // Стрелка влево
                ctx.moveTo(arrowCx + arrowSize / 2, arrowCy - arrowSize);
                ctx.lineTo(arrowCx - arrowSize / 2, arrowCy);
                ctx.lineTo(arrowCx + arrowSize / 2, arrowCy + arrowSize);
            }
        } else {
            if (this._isCollapsed) {
                // Стрелка вниз
                ctx.moveTo(arrowCx - arrowSize, arrowCy - arrowSize / 2);
                ctx.lineTo(arrowCx, arrowCy + arrowSize / 2);
                ctx.lineTo(arrowCx + arrowSize, arrowCy - arrowSize / 2);
            } else {
                // Стрелка вверх
                ctx.moveTo(arrowCx - arrowSize, arrowCy + arrowSize / 2);
                ctx.lineTo(arrowCx, arrowCy - arrowSize / 2);
                ctx.lineTo(arrowCx + arrowSize, arrowCy + arrowSize / 2);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ
    // ========================================================================

    /**
     * Проверка попадания в кнопку коллапса
     */
    private isCollapseButtonHit(x: number, y: number): boolean {
        if (!this._collapsible) return false;
        
        const btnSize = 16;
        let btnX: number, btnY: number;
        
        if (this._orientation === SplitterOrientation.Horizontal) {
            btnX = this.bounds.x + (this.bounds.width - btnSize) / 2;
            btnY = this.bounds.y + 4;
        } else {
            btnX = this.bounds.x + 4;
            btnY = this.bounds.y + (this.bounds.height - btnSize) / 2;
        }

        return x >= btnX && x <= btnX + btnSize && y >= btnY && y <= btnY + btnSize;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        if (this._isDragging) {
            const currentPos = this._orientation === SplitterOrientation.Horizontal ? x : y;
            const delta = currentPos - this._dragStartPos;
            this.position = this._dragStartPosition + delta;
        } else {
            const newHovered = this.bounds.contains(x, y);
            if (this._isHovered !== newHovered) {
                this._isHovered = newHovered;
                this.invalidate();
            }
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._isHovered && !this._isDragging) {
            this._isHovered = false;
            this.invalidate();
        }
    }

    /**
     * Обработка нажатия мыши
     */
    onMouseDown(x: number, y: number): void {
        if (!this.enabled) return;
        
        if (this.isCollapseButtonHit(x, y)) {
            return; // Будет обработано в onClick
        }

        this._isDragging = true;
        this._dragStartPos = this._orientation === SplitterOrientation.Horizontal ? x : y;
        this._dragStartPosition = this._position;
        this.invalidate();
    }

    /**
     * Обработка отпускания мыши
     */
    onMouseUp(x: number, y: number): void {
        this._isDragging = false;
        this._isHovered = this.bounds.contains(x, y);
        this.invalidate();
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        if (this.isCollapseButtonHit(x, y)) {
            this.toggle();
        }
    }

    /**
     * Обработка двойного клика
     */
    onDoubleClick(x: number, y: number): void {
        if (this._collapsible) {
            this.toggle();
        }
    }

    /**
     * Получить курсор
     */
    getCursor(): string {
        if (this._orientation === SplitterOrientation.Horizontal) {
            return 'col-resize';
        } else {
            return 'row-resize';
        }
    }
}
