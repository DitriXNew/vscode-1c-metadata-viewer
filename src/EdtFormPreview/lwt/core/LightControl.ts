/**
 * Базовый класс легковесного контрола
 * Порт из com._1c.g5.lwt.LightControl
 */
import { Rectangle, Point } from '../geometry';
import { ILightControl, ILightComposite } from './interfaces';

let controlIdCounter = 0;

/**
 * Базовый класс для всех контролов LWT
 */
export abstract class LightControl implements ILightControl {
    readonly id: string;
    
    protected _parent: ILightComposite | null = null;
    protected _bounds: Rectangle = new Rectangle();
    protected _visible: boolean = true;
    protected _enabled: boolean = true;
    protected _disposed: boolean = false;
    
    layoutData: any = null;
    tooltip: string | null = null;

    constructor() {
        this.id = `ctrl_${++controlIdCounter}`;
    }

    // Публичные геттеры для наследников
    get bounds(): Rectangle {
        return this._bounds;
    }

    get visible(): boolean {
        return this._visible;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    // Родитель
    get parent(): ILightComposite | null {
        return this._parent;
    }

    set parent(value: ILightComposite | null) {
        this._parent = value;
    }

    /**
     * Запрос на перерисовку контрола
     */
    invalidate(): void {
        this.redraw();
    }

    // Отрисовка (абстрактный метод)
    abstract paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void;

    // Границы
    getBounds(): Rectangle {
        return this._bounds.clone();
    }

    setBounds(bounds: Rectangle): void;
    setBounds(x: number, y: number, width: number, height: number): void;
    setBounds(xOrBounds: Rectangle | number, y?: number, width?: number, height?: number): void {
        if (xOrBounds instanceof Rectangle) {
            this._bounds = xOrBounds.clone();
        } else {
            this._bounds.setBounds(xOrBounds, y!, width!, height!);
        }
    }

    // Позиция
    getLocation(): Point {
        return new Point(this._bounds.x, this._bounds.y);
    }

    setLocation(x: number, y: number): void;
    setLocation(point: Point): void;
    setLocation(xOrPoint: number | Point, y?: number): void {
        if (xOrPoint instanceof Point) {
            this._bounds.x = xOrPoint.x;
            this._bounds.y = xOrPoint.y;
        } else {
            this._bounds.x = xOrPoint;
            this._bounds.y = y!;
        }
    }

    // Размер
    getSize(): Point {
        return new Point(this._bounds.width, this._bounds.height);
    }

    setSize(width: number, height: number): void;
    setSize(size: Point): void;
    setSize(widthOrSize: number | Point, height?: number): void {
        if (widthOrSize instanceof Point) {
            this._bounds.width = widthOrSize.x;
            this._bounds.height = widthOrSize.y;
        } else {
            this._bounds.width = widthOrSize;
            this._bounds.height = height!;
        }
    }

    // Видимость
    isVisible(): boolean {
        return this._visible;
    }

    setVisible(visible: boolean): void {
        this._visible = visible;
    }

    // Доступность
    isEnabled(): boolean {
        return this._enabled;
    }

    setEnabled(enabled: boolean): void {
        this._enabled = enabled;
    }

    // Предпочтительный размер (по умолчанию возвращает текущий)
    computePreferredSize(wHint: number, hHint: number): Point {
        return new Point(
            wHint >= 0 ? wHint : this._bounds.width,
            hHint >= 0 ? hHint : this._bounds.height
        );
    }

    // Содержит ли точку
    contains(x: number, y: number): boolean;
    contains(point: Point): boolean;
    contains(xOrPoint: number | Point, y?: number): boolean {
        if (xOrPoint instanceof Point) {
            return this._bounds.contains(xOrPoint);
        }
        return this._bounds.contains(xOrPoint, y!);
    }

    // Преобразование координат в локальные
    toControl(x: number, y: number): Point;
    toControl(point: Point): Point;
    toControl(xOrPoint: number | Point, y?: number): Point {
        const px = xOrPoint instanceof Point ? xOrPoint.x : xOrPoint;
        const py = xOrPoint instanceof Point ? xOrPoint.y : y!;
        
        let offsetX = 0;
        let offsetY = 0;
        let current: ILightControl | null = this;
        
        while (current) {
            const bounds = current.getBounds();
            offsetX += bounds.x;
            offsetY += bounds.y;
            current = current.parent;
        }
        
        return new Point(px - offsetX, py - offsetY);
    }

    // Преобразование координат в глобальные
    toDisplay(x: number, y: number): Point;
    toDisplay(point: Point): Point;
    toDisplay(xOrPoint: number | Point, y?: number): Point {
        const px = xOrPoint instanceof Point ? xOrPoint.x : xOrPoint;
        const py = xOrPoint instanceof Point ? xOrPoint.y : y!;
        
        let offsetX = 0;
        let offsetY = 0;
        let current: ILightControl | null = this;
        
        while (current) {
            const bounds = current.getBounds();
            offsetX += bounds.x;
            offsetY += bounds.y;
            current = current.parent;
        }
        
        return new Point(px + offsetX, py + offsetY);
    }

    // Перерисовка
    redraw(): void;
    redraw(x: number, y: number, width: number, height: number): void;
    redraw(_x?: number, _y?: number, _width?: number, _height?: number): void {
        // TODO: Реализовать систему перерисовки
        // В реальной реализации здесь будет логика добавления dirty region
    }

    // Уничтожение
    dispose(): void {
        if (this._disposed) {
            return;
        }
        
        this._disposed = true;
        
        // Удаляем из родителя
        if (this._parent) {
            this._parent.removeChild(this);
        }
    }

    isDisposed(): boolean {
        return this._disposed;
    }

    /**
     * Проверяет, нужно ли отрисовывать контрол
     */
    protected shouldPaint(clip: Rectangle): boolean {
        if (!this._visible || this._disposed) {
            return false;
        }
        // Проверяем пересечение с clip region
        return clip.intersects(this._bounds);
    }
}
