/**
 * Контрол Separator - разделитель
 * Порт из SWT Label (используется как разделитель)
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';
import { getTheme, ITheme, Color } from '../theme';

/**
 * Ориентация разделителя
 */
export enum SeparatorOrientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

/**
 * Стиль разделителя
 */
export enum SeparatorStyle {
    Line = 'line',        // Простая линия
    Shadow = 'shadow',    // Линия с тенью
    Etched = 'etched',    // Вдавленная линия (3D эффект)
    Double = 'double'     // Двойная линия
}

/**
 * Контрол разделителя
 */
export class SeparatorControl extends LightControl {
    // Параметры
    private _orientation: SeparatorOrientation = SeparatorOrientation.Horizontal;
    private _style: SeparatorStyle = SeparatorStyle.Line;
    private _thickness: number = 1;
    private _color: Color | null = null;
    private _shadowColor: Color | null = null;
    private _margin: number = 2;
    
    // Статические константы
    private static readonly DEFAULT_SIZE = 2;
    
    /**
     * Ориентация
     */
    get orientation(): SeparatorOrientation {
        return this._orientation;
    }
    
    set orientation(value: SeparatorOrientation) {
        if (this._orientation !== value) {
            this._orientation = value;
            this.invalidate();
        }
    }
    
    /**
     * Стиль
     */
    get style(): SeparatorStyle {
        return this._style;
    }
    
    set style(value: SeparatorStyle) {
        if (this._style !== value) {
            this._style = value;
            this.invalidate();
        }
    }
    
    /**
     * Толщина линии
     */
    get thickness(): number {
        return this._thickness;
    }
    
    set thickness(value: number) {
        const newThickness = Math.max(1, value);
        if (this._thickness !== newThickness) {
            this._thickness = newThickness;
            this.invalidate();
        }
    }
    
    /**
     * Цвет линии
     */
    get color(): Color | null {
        return this._color;
    }
    
    set color(value: Color | null) {
        this._color = value;
        this.invalidate();
    }
    
    /**
     * Цвет тени
     */
    get shadowColor(): Color | null {
        return this._shadowColor;
    }
    
    set shadowColor(value: Color | null) {
        this._shadowColor = value;
        this.invalidate();
    }
    
    /**
     * Отступ от краёв
     */
    get margin(): number {
        return this._margin;
    }
    
    set margin(value: number) {
        if (this._margin !== value) {
            this._margin = Math.max(0, value);
            this.invalidate();
        }
    }
    
    /**
     * Вычисление предпочтительного размера
     */
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const size = this.getRequiredThickness();
        
        if (this._orientation === SeparatorOrientation.Horizontal) {
            const width = widthHint !== -1 ? widthHint : 100;
            const height = heightHint !== -1 ? heightHint : size + this._margin * 2;
            return new Point(width, height);
        } else {
            const width = widthHint !== -1 ? widthHint : size + this._margin * 2;
            const height = heightHint !== -1 ? heightHint : 100;
            return new Point(width, height);
        }
    }
    
    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        ctx.save();
        
        switch (this._style) {
            case SeparatorStyle.Line:
                this.paintLine(ctx, bounds, theme);
                break;
            case SeparatorStyle.Shadow:
                this.paintShadow(ctx, bounds, theme);
                break;
            case SeparatorStyle.Etched:
                this.paintEtched(ctx, bounds, theme);
                break;
            case SeparatorStyle.Double:
                this.paintDouble(ctx, bounds, theme);
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * Отрисовка простой линии
     */
    private paintLine(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const color = this._color ?? theme.separator;
        ctx.strokeStyle = color.toCss();
        ctx.lineWidth = this._thickness;
        
        ctx.beginPath();
        if (this._orientation === SeparatorOrientation.Horizontal) {
            const y = bounds.y + bounds.height / 2;
            ctx.moveTo(bounds.x + this._margin, y);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y);
        } else {
            const x = bounds.x + bounds.width / 2;
            ctx.moveTo(x, bounds.y + this._margin);
            ctx.lineTo(x, bounds.y + bounds.height - this._margin);
        }
        ctx.stroke();
    }
    
    /**
     * Отрисовка линии с тенью
     */
    private paintShadow(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const mainColor = this._color ?? theme.separator;
        const shadow = this._shadowColor ?? theme.separatorShadow;
        
        ctx.lineWidth = this._thickness;
        
        if (this._orientation === SeparatorOrientation.Horizontal) {
            const y = bounds.y + bounds.height / 2;
            
            // Основная линия
            ctx.strokeStyle = mainColor.toCss();
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y);
            ctx.stroke();
            
            // Тень
            ctx.strokeStyle = shadow.toCss();
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y + 1);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y + 1);
            ctx.stroke();
        } else {
            const x = bounds.x + bounds.width / 2;
            
            // Основная линия
            ctx.strokeStyle = mainColor.toCss();
            ctx.beginPath();
            ctx.moveTo(x, bounds.y + this._margin);
            ctx.lineTo(x, bounds.y + bounds.height - this._margin);
            ctx.stroke();
            
            // Тень
            ctx.strokeStyle = shadow.toCss();
            ctx.beginPath();
            ctx.moveTo(x + 1, bounds.y + this._margin);
            ctx.lineTo(x + 1, bounds.y + bounds.height - this._margin);
            ctx.stroke();
        }
    }
    
    /**
     * Отрисовка вдавленной линии (3D эффект)
     */
    private paintEtched(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const darkColor = this._color ?? theme.separatorDark;
        const lightColor = this._shadowColor ?? theme.separatorLight;
        
        ctx.lineWidth = 1;
        
        if (this._orientation === SeparatorOrientation.Horizontal) {
            const y = bounds.y + bounds.height / 2;
            
            // Тёмная линия сверху
            ctx.strokeStyle = darkColor.toCss();
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y);
            ctx.stroke();
            
            // Светлая линия снизу
            ctx.strokeStyle = lightColor.toCss();
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y + 1);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y + 1);
            ctx.stroke();
        } else {
            const x = bounds.x + bounds.width / 2;
            
            // Тёмная линия слева
            ctx.strokeStyle = darkColor.toCss();
            ctx.beginPath();
            ctx.moveTo(x, bounds.y + this._margin);
            ctx.lineTo(x, bounds.y + bounds.height - this._margin);
            ctx.stroke();
            
            // Светлая линия справа
            ctx.strokeStyle = lightColor.toCss();
            ctx.beginPath();
            ctx.moveTo(x + 1, bounds.y + this._margin);
            ctx.lineTo(x + 1, bounds.y + bounds.height - this._margin);
            ctx.stroke();
        }
    }
    
    /**
     * Отрисовка двойной линии
     */
    private paintDouble(ctx: CanvasRenderingContext2D, bounds: Rectangle, theme: ITheme): void {
        const color = this._color ?? theme.separator;
        ctx.strokeStyle = color.toCss();
        ctx.lineWidth = this._thickness;
        
        const gap = 2;
        
        if (this._orientation === SeparatorOrientation.Horizontal) {
            const y = bounds.y + bounds.height / 2;
            
            // Первая линия
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y - gap);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y - gap);
            ctx.stroke();
            
            // Вторая линия
            ctx.beginPath();
            ctx.moveTo(bounds.x + this._margin, y + gap);
            ctx.lineTo(bounds.x + bounds.width - this._margin, y + gap);
            ctx.stroke();
        } else {
            const x = bounds.x + bounds.width / 2;
            
            // Первая линия
            ctx.beginPath();
            ctx.moveTo(x - gap, bounds.y + this._margin);
            ctx.lineTo(x - gap, bounds.y + bounds.height - this._margin);
            ctx.stroke();
            
            // Вторая линия
            ctx.beginPath();
            ctx.moveTo(x + gap, bounds.y + this._margin);
            ctx.lineTo(x + gap, bounds.y + bounds.height - this._margin);
            ctx.stroke();
        }
    }
    
    /**
     * Получает требуемую толщину в зависимости от стиля
     */
    private getRequiredThickness(): number {
        switch (this._style) {
            case SeparatorStyle.Line:
                return this._thickness;
            case SeparatorStyle.Shadow:
            case SeparatorStyle.Etched:
                return this._thickness + 1;
            case SeparatorStyle.Double:
                return this._thickness * 2 + 4;
            default:
                return SeparatorControl.DEFAULT_SIZE;
        }
    }
}

/**
 * Горизонтальный разделитель
 */
export class HorizontalSeparator extends SeparatorControl {
    constructor() {
        super();
        this.orientation = SeparatorOrientation.Horizontal;
    }
}

/**
 * Вертикальный разделитель
 */
export class VerticalSeparator extends SeparatorControl {
    constructor() {
        super();
        this.orientation = SeparatorOrientation.Vertical;
    }
}

/**
 * Фабричная функция для создания разделителя
 */
export function createSeparator(config: {
    orientation?: SeparatorOrientation;
    style?: SeparatorStyle;
    thickness?: number;
    color?: Color;
    margin?: number;
} = {}): SeparatorControl {
    const separator = new SeparatorControl();
    
    if (config.orientation !== undefined) separator.orientation = config.orientation;
    if (config.style !== undefined) separator.style = config.style;
    if (config.thickness !== undefined) separator.thickness = config.thickness;
    if (config.color !== undefined) separator.color = config.color;
    if (config.margin !== undefined) separator.margin = config.margin;
    
    return separator;
}
