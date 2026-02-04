/**
 * Отступы (insets/margin)
 */
export class Insets {
    constructor(
        public top: number = 0,
        public right: number = 0,
        public bottom: number = 0,
        public left: number = 0
    ) {}

    /**
     * Создаёт инсеты с одинаковыми значениями для всех сторон
     */
    static all(value: number): Insets {
        return new Insets(value, value, value, value);
    }

    /**
     * Создаёт инсеты с одинаковыми значениями по горизонтали и вертикали
     */
    static symmetric(horizontal: number, vertical: number): Insets {
        return new Insets(vertical, horizontal, vertical, horizontal);
    }

    /**
     * Ширина инсетов (left + right)
     */
    get width(): number {
        return this.left + this.right;
    }

    /**
     * Высота инсетов (top + bottom)
     */
    get height(): number {
        return this.top + this.bottom;
    }

    /**
     * Создаёт копию
     */
    clone(): Insets {
        return new Insets(this.top, this.right, this.bottom, this.left);
    }

    /**
     * Проверяет равенство
     */
    equals(other: Insets): boolean {
        return this.top === other.top &&
               this.right === other.right &&
               this.bottom === other.bottom &&
               this.left === other.left;
    }

    toString(): string {
        return `Insets(${this.top}, ${this.right}, ${this.bottom}, ${this.left})`;
    }
}
