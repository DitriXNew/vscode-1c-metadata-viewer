/**
 * Прямоугольник (x, y, width, height)
 * Порт из org.eclipse.swt.graphics.Rectangle
 */
import { Point } from './Point';

export class Rectangle {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public width: number = 0,
        public height: number = 0
    ) {}

    /**
     * Создаёт копию прямоугольника
     */
    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Правый край
     */
    get right(): number {
        return this.x + this.width;
    }

    /**
     * Нижний край
     */
    get bottom(): number {
        return this.y + this.height;
    }

    /**
     * Возвращает верхний левый угол
     */
    getLocation(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * Возвращает размер
     */
    getSize(): Point {
        return new Point(this.width, this.height);
    }

    /**
     * Устанавливает позицию
     */
    setLocation(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /**
     * Устанавливает размер
     */
    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    /**
     * Устанавливает все значения
     */
    setBounds(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Проверяет, пустой ли прямоугольник
     */
    isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Проверяет, содержит ли прямоугольник точку
     */
    contains(x: number, y: number): boolean;
    contains(point: Point): boolean;
    contains(xOrPoint: number | Point, y?: number): boolean {
        if (xOrPoint instanceof Point) {
            return this.containsPoint(xOrPoint.x, xOrPoint.y);
        }
        return this.containsPoint(xOrPoint, y!);
    }

    private containsPoint(x: number, y: number): boolean {
        return x >= this.x && 
               y >= this.y && 
               x < this.x + this.width && 
               y < this.y + this.height;
    }

    /**
     * Проверяет пересечение с другим прямоугольником
     */
    intersects(rect: Rectangle): boolean {
        if (this.isEmpty() || rect.isEmpty()) {
            return false;
        }
        return rect.x < this.x + this.width &&
               rect.y < this.y + this.height &&
               rect.x + rect.width > this.x &&
               rect.y + rect.height > this.y;
    }

    /**
     * Возвращает пересечение с другим прямоугольником
     */
    intersection(rect: Rectangle): Rectangle {
        if (!this.intersects(rect)) {
            return new Rectangle();
        }
        const x1 = Math.max(this.x, rect.x);
        const y1 = Math.max(this.y, rect.y);
        const x2 = Math.min(this.right, rect.right);
        const y2 = Math.min(this.bottom, rect.bottom);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * Объединяет с другим прямоугольником
     */
    union(rect: Rectangle): Rectangle {
        if (rect.isEmpty()) {
            return this.clone();
        }
        if (this.isEmpty()) {
            return rect.clone();
        }
        const x1 = Math.min(this.x, rect.x);
        const y1 = Math.min(this.y, rect.y);
        const x2 = Math.max(this.right, rect.right);
        const y2 = Math.max(this.bottom, rect.bottom);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * Добавляет точку к прямоугольнику (расширяет если нужно)
     */
    add(point: Point): void;
    add(x: number, y: number): void;
    add(xOrPoint: number | Point, y?: number): void {
        const px = xOrPoint instanceof Point ? xOrPoint.x : xOrPoint;
        const py = xOrPoint instanceof Point ? xOrPoint.y : y!;
        
        if (this.isEmpty()) {
            this.x = px;
            this.y = py;
            this.width = 0;
            this.height = 0;
            return;
        }

        const minX = Math.min(this.x, px);
        const minY = Math.min(this.y, py);
        const maxX = Math.max(this.right, px);
        const maxY = Math.max(this.bottom, py);

        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
    }

    /**
     * Расширяет прямоугольник на указанные значения (insets)
     */
    expand(h: number, v: number): Rectangle {
        return new Rectangle(
            this.x - h,
            this.y - v,
            this.width + h * 2,
            this.height + v * 2
        );
    }

    /**
     * Сжимает прямоугольник на указанные значения
     */
    shrink(h: number, v: number): Rectangle {
        return this.expand(-h, -v);
    }

    /**
     * Сдвигает прямоугольник
     */
    translate(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Создаёт новый сдвинутый прямоугольник
     */
    translated(dx: number, dy: number): Rectangle {
        return new Rectangle(this.x + dx, this.y + dy, this.width, this.height);
    }

    /**
     * Проверяет равенство с другим прямоугольником
     */
    equals(other: Rectangle): boolean {
        return this.x === other.x && 
               this.y === other.y && 
               this.width === other.width && 
               this.height === other.height;
    }

    toString(): string {
        return `Rectangle(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
    }

    /**
     * Пустой прямоугольник
     */
    static EMPTY = new Rectangle(0, 0, 0, 0);
}
