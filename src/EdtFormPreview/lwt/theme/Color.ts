/**
 * Цвет в формате RGB
 */
export class Color {
    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a: number = 1
    ) {}

    /**
     * Создаёт Color из HEX строки
     */
    static fromHex(hex: string): Color {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return new Color(
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            );
        }
        return new Color(0, 0, 0);
    }

    /**
     * Создаёт Color из RGB значений
     */
    static rgb(r: number, g: number, b: number): Color {
        return new Color(r, g, b);
    }

    /**
     * Создаёт Color с прозрачностью
     */
    static rgba(r: number, g: number, b: number, a: number): Color {
        return new Color(r, g, b, a);
    }

    /**
     * Преобразует в CSS строку
     */
    toCss(): string {
        if (this.a === 1) {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    /**
     * Преобразует в HEX строку
     */
    toHex(): string {
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
    }

    /**
     * Осветляет цвет
     */
    lighter(factor: number = 0.2): Color {
        return new Color(
            Math.min(255, this.r + (255 - this.r) * factor),
            Math.min(255, this.g + (255 - this.g) * factor),
            Math.min(255, this.b + (255 - this.b) * factor),
            this.a
        );
    }

    /**
     * Затемняет цвет
     */
    darker(factor: number = 0.2): Color {
        return new Color(
            Math.max(0, this.r * (1 - factor)),
            Math.max(0, this.g * (1 - factor)),
            Math.max(0, this.b * (1 - factor)),
            this.a
        );
    }

    /**
     * Создаёт копию
     */
    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }
}
