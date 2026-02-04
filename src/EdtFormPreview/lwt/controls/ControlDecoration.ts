/**
 * ControlDecoration - декоратор контрола с иконками валидации
 * Порт com._1c.g5.lwt.controls.LightControlDecoration
 */

import { LightControl } from '../core/LightControl';
import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { Color, ITheme, getTheme } from '../theme';

/**
 * Тип декорации
 */
export enum DecorationType {
    /** Информация */
    Info = 'info',
    /** Предупреждение */
    Warning = 'warning',
    /** Ошибка */
    Error = 'error',
    /** Успех */
    Success = 'success',
    /** Обязательное поле */
    Required = 'required',
    /** Пользовательская иконка */
    Custom = 'custom'
}

/**
 * Позиция декорации
 */
export enum DecorationPosition {
    TopLeft = 'top-left',
    TopRight = 'top-right',
    BottomLeft = 'bottom-left',
    BottomRight = 'bottom-right',
    MiddleLeft = 'middle-left',
    MiddleRight = 'middle-right'
}

/**
 * Декоратор контрола
 */
export class ControlDecoration {
    // Контрол, к которому привязана декорация
    private _control: LightControl;
    
    // Тип и внешний вид
    private _type: DecorationType = DecorationType.Info;
    private _position: DecorationPosition = DecorationPosition.TopLeft;
    private _visible: boolean = false;
    
    // Размер иконки
    private _iconSize: number = 16;
    private _margin: number = 2;
    
    // Tooltip
    private _tooltip: string = '';
    private _showingTooltip: boolean = false;
    
    // Пользовательская иконка
    private _customIcon: string | null = null;
    private _customIconImage: HTMLImageElement | null = null;
    
    // Состояние
    private _hovered: boolean = false;
    private _bounds: Rectangle = Rectangle.EMPTY;
    
    constructor(control: LightControl) {
        this._control = control;
    }
    
    // Геттеры и сеттеры
    
    get control(): LightControl {
        return this._control;
    }
    
    get type(): DecorationType {
        return this._type;
    }
    
    set type(val: DecorationType) {
        this._type = val;
    }
    
    get position(): DecorationPosition {
        return this._position;
    }
    
    set position(val: DecorationPosition) {
        this._position = val;
        this.updateBounds();
    }
    
    get visible(): boolean {
        return this._visible;
    }
    
    get iconSize(): number {
        return this._iconSize;
    }
    
    set iconSize(val: number) {
        this._iconSize = val;
        this.updateBounds();
    }
    
    get tooltip(): string {
        return this._tooltip;
    }
    
    set tooltip(val: string) {
        this._tooltip = val;
    }
    
    get customIcon(): string | null {
        return this._customIcon;
    }
    
    set customIcon(val: string | null) {
        this._customIcon = val;
        if (val) {
            const img = new Image();
            img.onload = () => {
                this._customIconImage = img;
            };
            img.src = val;
        } else {
            this._customIconImage = null;
        }
    }
    
    get bounds(): Rectangle {
        return this._bounds;
    }
    
    get hovered(): boolean {
        return this._hovered;
    }
    
    set hovered(val: boolean) {
        this._hovered = val;
    }
    
    // Публичные методы
    
    show(): void {
        if (!this._visible) {
            this._visible = true;
            this.updateBounds();
        }
    }
    
    hide(): void {
        if (this._visible) {
            this._visible = false;
            this._showingTooltip = false;
        }
    }
    
    /**
     * Установить ошибку
     */
    setError(message: string): void {
        this._type = DecorationType.Error;
        this._tooltip = message;
        this.show();
    }
    
    /**
     * Установить предупреждение
     */
    setWarning(message: string): void {
        this._type = DecorationType.Warning;
        this._tooltip = message;
        this.show();
    }
    
    /**
     * Установить информацию
     */
    setInfo(message: string): void {
        this._type = DecorationType.Info;
        this._tooltip = message;
        this.show();
    }
    
    /**
     * Установить успех
     */
    setSuccess(message: string): void {
        this._type = DecorationType.Success;
        this._tooltip = message;
        this.show();
    }
    
    /**
     * Обновить позицию
     */
    updateBounds(): void {
        if (!this._control || !this._visible) {
            this._bounds = Rectangle.EMPTY;
            return;
        }
        
        const controlBounds = this._control.getBounds();
        let x: number;
        let y: number;
        
        switch (this._position) {
            case DecorationPosition.TopLeft:
                x = controlBounds.x - this._iconSize - this._margin;
                y = controlBounds.y;
                break;
            case DecorationPosition.TopRight:
                x = controlBounds.x + controlBounds.width + this._margin;
                y = controlBounds.y;
                break;
            case DecorationPosition.BottomLeft:
                x = controlBounds.x - this._iconSize - this._margin;
                y = controlBounds.y + controlBounds.height - this._iconSize;
                break;
            case DecorationPosition.BottomRight:
                x = controlBounds.x + controlBounds.width + this._margin;
                y = controlBounds.y + controlBounds.height - this._iconSize;
                break;
            case DecorationPosition.MiddleLeft:
                x = controlBounds.x - this._iconSize - this._margin;
                y = controlBounds.y + (controlBounds.height - this._iconSize) / 2;
                break;
            case DecorationPosition.MiddleRight:
                x = controlBounds.x + controlBounds.width + this._margin;
                y = controlBounds.y + (controlBounds.height - this._iconSize) / 2;
                break;
        }
        
        this._bounds = new Rectangle(x, y, this._iconSize, this._iconSize);
    }
    
    /**
     * Проверить, содержит ли точку
     */
    containsPoint(x: number, y: number): boolean {
        return this._visible && this._bounds.contains(x, y);
    }
    
    /**
     * Отрисовка
     */
    paint(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        if (!this._visible) return;
        
        this.updateBounds();
        const b = this._bounds;
        
        if (this._type === DecorationType.Custom && this._customIconImage) {
            ctx.drawImage(this._customIconImage, b.x, b.y, b.width, b.height);
            return;
        }
        
        // Рисуем встроенные иконки
        const centerX = b.x + b.width / 2;
        const centerY = b.y + b.height / 2;
        const radius = b.width / 2 - 1;
        
        switch (this._type) {
            case DecorationType.Error:
                this.paintErrorIcon(ctx, centerX, centerY, radius);
                break;
            case DecorationType.Warning:
                this.paintWarningIcon(ctx, centerX, centerY, radius);
                break;
            case DecorationType.Info:
                this.paintInfoIcon(ctx, centerX, centerY, radius);
                break;
            case DecorationType.Success:
                this.paintSuccessIcon(ctx, centerX, centerY, radius);
                break;
            case DecorationType.Required:
                this.paintRequiredIcon(ctx, centerX, centerY, radius);
                break;
        }
        
        // Highlight при наведении
        if (this._hovered && this._tooltip) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    private paintErrorIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
        // Красный круг с X
        ctx.fillStyle = '#dc3545';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // X
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const offset = radius * 0.4;
        ctx.beginPath();
        ctx.moveTo(cx - offset, cy - offset);
        ctx.lineTo(cx + offset, cy + offset);
        ctx.moveTo(cx + offset, cy - offset);
        ctx.lineTo(cx - offset, cy + offset);
        ctx.stroke();
    }
    
    private paintWarningIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
        // Жёлтый треугольник с !
        ctx.fillStyle = '#ffc107';
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx + radius, cy + radius * 0.8);
        ctx.lineTo(cx - radius, cy + radius * 0.8);
        ctx.closePath();
        ctx.fill();
        
        // !
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', cx, cy + radius * 0.1);
    }
    
    private paintInfoIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
        // Синий круг с i
        ctx.fillStyle = '#17a2b8';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // i
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${radius * 1.2}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('i', cx, cy);
    }
    
    private paintSuccessIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
        // Зелёный круг с галочкой
        ctx.fillStyle = '#28a745';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Галочка
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.4, cy);
        ctx.lineTo(cx - radius * 0.1, cy + radius * 0.3);
        ctx.lineTo(cx + radius * 0.4, cy - radius * 0.3);
        ctx.stroke();
    }
    
    private paintRequiredIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
        // Красная звёздочка
        ctx.fillStyle = '#dc3545';
        ctx.font = `bold ${radius * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('*', cx, cy);
    }
}

/**
 * Менеджер декораций для нескольких контролов
 */
export class DecorationManager {
    private _decorations: Map<LightControl, ControlDecoration[]> = new Map();
    
    /**
     * Добавить декорацию к контролу
     */
    addDecoration(control: LightControl, type: DecorationType, message: string, position?: DecorationPosition): ControlDecoration {
        const decoration = new ControlDecoration(control);
        decoration.type = type;
        decoration.tooltip = message;
        if (position) {
            decoration.position = position;
        }
        decoration.show();
        
        let list = this._decorations.get(control);
        if (!list) {
            list = [];
            this._decorations.set(control, list);
        }
        list.push(decoration);
        
        return decoration;
    }
    
    /**
     * Удалить все декорации контрола
     */
    clearDecorations(control: LightControl): void {
        const list = this._decorations.get(control);
        if (list) {
            for (const d of list) {
                d.hide();
            }
            this._decorations.delete(control);
        }
    }
    
    /**
     * Удалить все декорации
     */
    clearAll(): void {
        for (const [, list] of this._decorations) {
            for (const d of list) {
                d.hide();
            }
        }
        this._decorations.clear();
    }
    
    /**
     * Получить декорации контрола
     */
    getDecorations(control: LightControl): ControlDecoration[] {
        return this._decorations.get(control) ?? [];
    }
    
    /**
     * Получить все декорации
     */
    getAllDecorations(): ControlDecoration[] {
        const result: ControlDecoration[] = [];
        for (const [, list] of this._decorations) {
            result.push(...list);
        }
        return result;
    }
    
    /**
     * Отрисовать все декорации
     */
    paintAll(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        for (const [, list] of this._decorations) {
            for (const d of list) {
                d.paint(ctx, theme);
            }
        }
    }
    
    /**
     * Обработать движение мыши
     */
    handleMouseMove(x: number, y: number): ControlDecoration | null {
        for (const [, list] of this._decorations) {
            for (const d of list) {
                const wasHovered = d.hovered;
                d.hovered = d.containsPoint(x, y);
                if (d.hovered) {
                    return d;
                }
            }
        }
        return null;
    }
}

/**
 * Хелпер для создания декорации с ошибкой
 */
export function createErrorDecoration(control: LightControl, message: string): ControlDecoration {
    const decoration = new ControlDecoration(control);
    decoration.setError(message);
    return decoration;
}

/**
 * Хелпер для создания декорации с предупреждением
 */
export function createWarningDecoration(control: LightControl, message: string): ControlDecoration {
    const decoration = new ControlDecoration(control);
    decoration.setWarning(message);
    return decoration;
}
