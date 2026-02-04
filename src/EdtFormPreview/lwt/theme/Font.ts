/**
 * Настройки шрифта
 */
export class Font {
    constructor(
        public family: string = 'Segoe UI, Arial, sans-serif',
        public size: number = 12,
        public bold: boolean = false,
        public italic: boolean = false
    ) {}

    /**
     * Преобразует в CSS font string
     */
    toCss(): string {
        const style = this.italic ? 'italic' : 'normal';
        const weight = this.bold ? 'bold' : 'normal';
        return `${style} ${weight} ${this.size}px ${this.family}`;
    }

    /**
     * Создаёт копию
     */
    clone(): Font {
        return new Font(this.family, this.size, this.bold, this.italic);
    }

    /**
     * Создаёт жирный вариант
     */
    withBold(bold: boolean = true): Font {
        const copy = this.clone();
        copy.bold = bold;
        return copy;
    }

    /**
     * Создаёт курсивный вариант
     */
    withItalic(italic: boolean = true): Font {
        const copy = this.clone();
        copy.italic = italic;
        return copy;
    }

    /**
     * Создаёт вариант с другим размером
     */
    withSize(size: number): Font {
        const copy = this.clone();
        copy.size = size;
        return copy;
    }
}
