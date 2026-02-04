/**
 * Размер (ширина и высота)
 */
export class Dimension {
    public readonly width: number;
    public readonly height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    /**
     * Копирование
     */
    copy(): Dimension {
        return new Dimension(this.width, this.height);
    }

    /**
     * Создать новый размер с другой шириной
     */
    withWidth(width: number): Dimension {
        return new Dimension(width, this.height);
    }

    /**
     * Создать новый размер с другой высотой
     */
    withHeight(height: number): Dimension {
        return new Dimension(this.width, height);
    }

    /**
     * Проверка равенства
     */
    equals(other: Dimension): boolean {
        return this.width === other.width && this.height === other.height;
    }

    /**
     * Является ли пустым (нулевой площади)
     */
    isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * Площадь
     */
    area(): number {
        return this.width * this.height;
    }

    /**
     * Расширить на указанные значения
     */
    expand(dw: number, dh: number): Dimension {
        return new Dimension(this.width + dw, this.height + dh);
    }

    /**
     * Сжать на указанные значения
     */
    shrink(dw: number, dh: number): Dimension {
        return new Dimension(Math.max(0, this.width - dw), Math.max(0, this.height - dh));
    }

    /**
     * Преобразование к строке
     */
    toString(): string {
        return `Dimension(${this.width}, ${this.height})`;
    }

    /**
     * Пустой размер
     */
    static readonly EMPTY = new Dimension(0, 0);
}
