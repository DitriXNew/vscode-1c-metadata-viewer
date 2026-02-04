/**
 * Точка (координаты x, y)
 * Порт из org.eclipse.swt.graphics.Point
 */
export class Point {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    /**
     * Создаёт копию точки
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * Проверяет равенство с другой точкой
     */
    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Сдвигает точку на указанные значения
     */
    translate(dx: number, dy: number): Point {
        this.x += dx;
        this.y += dy;
        return this;
    }

    /**
     * Создаёт новую точку со сдвигом
     */
    translated(dx: number, dy: number): Point {
        return new Point(this.x + dx, this.y + dy);
    }

    toString(): string {
        return `Point(${this.x}, ${this.y})`;
    }
}
