/**
 * ColorBoxControl - контрол отображения и выбора цвета
 * Порт com._1c.g5.lwt.controls.LightColorBox
 */

import { LightControl } from '../core/LightControl';
import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { Color, ITheme, getTheme } from '../theme';

/**
 * Предопределённые цвета для палитры
 */
export const DEFAULT_COLOR_PALETTE: Color[] = [
    // Строка 1 - основные
    new Color(255, 0, 0),     // Красный
    new Color(255, 127, 0),   // Оранжевый
    new Color(255, 255, 0),   // Жёлтый
    new Color(127, 255, 0),   // Лайм
    new Color(0, 255, 0),     // Зелёный
    new Color(0, 255, 127),   // Весенний
    new Color(0, 255, 255),   // Бирюзовый
    new Color(0, 127, 255),   // Небесный
    new Color(0, 0, 255),     // Синий
    new Color(127, 0, 255),   // Фиолетовый
    new Color(255, 0, 255),   // Пурпурный
    new Color(255, 0, 127),   // Розовый
    
    // Строка 2 - тёмные
    new Color(128, 0, 0),     // Тёмно-красный
    new Color(128, 64, 0),    // Коричневый
    new Color(128, 128, 0),   // Оливковый
    new Color(0, 128, 0),     // Тёмно-зелёный
    new Color(0, 128, 128),   // Тёмно-бирюзовый
    new Color(0, 0, 128),     // Тёмно-синий
    new Color(128, 0, 128),   // Тёмно-пурпурный
    new Color(128, 128, 128), // Серый
    
    // Строка 3 - светлые
    new Color(255, 192, 192), // Светло-красный
    new Color(255, 224, 192), // Светло-оранжевый
    new Color(255, 255, 192), // Светло-жёлтый
    new Color(192, 255, 192), // Светло-зелёный
    new Color(192, 255, 255), // Светло-бирюзовый
    new Color(192, 192, 255), // Светло-синий
    new Color(255, 192, 255), // Светло-пурпурный
    new Color(255, 255, 255), // Белый
    
    // Строка 4 - чёрно-белые
    new Color(0, 0, 0),       // Чёрный
    new Color(32, 32, 32),    // Очень тёмный
    new Color(64, 64, 64),    // Тёмный
    new Color(96, 96, 96),    // Средне-тёмный
    new Color(128, 128, 128), // Средний
    new Color(160, 160, 160), // Средне-светлый
    new Color(192, 192, 192), // Светлый
    new Color(224, 224, 224), // Очень светлый
];

/**
 * Слушатель изменения цвета
 */
export type ColorChangedListener = (control: ColorBoxControl, color: Color | null, oldColor: Color | null) => void;

/**
 * Контрол выбора цвета
 */
export class ColorBoxControl extends LightControl {
    // Текущий цвет
    private _color: Color | null = null;
    private _disabledColor: Color | null = null;
    
    // Размеры
    private _boxSize: number = 16;
    private _padding: number[] = [4, 4, 4, 4]; // top, right, bottom, left
    
    // Внешний вид
    private _showBorder: boolean = true;
    private _showCheckerboard: boolean = true;  // Шахматный узор для прозрачности
    private _borderRadius: number = 0;
    
    // Интерактивность
    private _clickable: boolean = true;
    private _hovered: boolean = false;
    private _pressed: boolean = false;
    private _focused: boolean = false;
    
    // Палитра (для dropdown)
    private _showPalette: boolean = false;
    private _paletteOpen: boolean = false;
    private _palette: Color[] = DEFAULT_COLOR_PALETTE;
    private _paletteColumns: number = 8;
    private _paletteColorSize: number = 20;
    private _paletteHoveredIndex: number = -1;
    
    // Nullable
    private _nullable: boolean = true;
    
    // События
    private _colorChangedListeners: ColorChangedListener[] = [];
    
    constructor() {
        super();
    }
    
    // Геттеры и сеттеры
    
    get color(): Color | null {
        return this._color;
    }
    
    set color(val: Color | null) {
        const oldColor = this._color;
        this._color = val;
        
        if (!Color.equals(oldColor, val)) {
            this.fireColorChanged(oldColor);
        }
    }
    
    get boxSize(): number {
        return this._boxSize;
    }
    
    set boxSize(val: number) {
        this._boxSize = val;
    }
    
    get padding(): number[] {
        return this._padding;
    }
    
    set padding(val: number[]) {
        if (val.length === 4) {
            this._padding = val;
        }
    }
    
    get showBorder(): boolean {
        return this._showBorder;
    }
    
    set showBorder(val: boolean) {
        this._showBorder = val;
    }
    
    get clickable(): boolean {
        return this._clickable;
    }
    
    set clickable(val: boolean) {
        this._clickable = val;
    }
    
    get showPalette(): boolean {
        return this._showPalette;
    }
    
    set showPalette(val: boolean) {
        this._showPalette = val;
    }
    
    get palette(): Color[] {
        return this._palette;
    }
    
    set palette(val: Color[]) {
        this._palette = val;
    }
    
    get nullable(): boolean {
        return this._nullable;
    }
    
    set nullable(val: boolean) {
        this._nullable = val;
    }
    
    get isPaletteOpen(): boolean {
        return this._paletteOpen;
    }
    
    // Публичные методы
    
    /**
     * Получить HEX представление цвета
     */
    getHexColor(): string | null {
        return this._color?.toHex() ?? null;
    }
    
    /**
     * Установить цвет из HEX строки
     */
    setHexColor(hex: string): void {
        this.color = Color.fromHex(hex);
    }
    
    /**
     * Очистить цвет
     */
    clear(): void {
        if (this._nullable) {
            this.color = null;
        }
    }
    
    /**
     * Открыть палитру
     */
    openPalette(): void {
        if (this._showPalette && this._enabled && this._clickable) {
            this._paletteOpen = true;
            this._paletteHoveredIndex = -1;
        }
    }
    
    /**
     * Закрыть палитру
     */
    closePalette(): void {
        this._paletteOpen = false;
        this._paletteHoveredIndex = -1;
    }
    
    // Слушатели
    
    addColorChangedListener(listener: ColorChangedListener): void {
        this._colorChangedListeners.push(listener);
    }
    
    removeColorChangedListener(listener: ColorChangedListener): void {
        const index = this._colorChangedListeners.indexOf(listener);
        if (index >= 0) {
            this._colorChangedListeners.splice(index, 1);
        }
    }
    
    // Вычисление размера
    
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const width = widthHint !== -1 ? widthHint : 
            this._boxSize + this._padding[1] + this._padding[3];
        const height = heightHint !== -1 ? heightHint : 
            this._boxSize + this._padding[0] + this._padding[2];
        
        return new Point(width, height);
    }
    
    // Отрисовка
    
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this._visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        // Вычисляем область цвета
        const colorBoxX = bounds.x + this._padding[3];
        const colorBoxY = bounds.y + this._padding[0];
        const colorBoxWidth = bounds.width - this._padding[1] - this._padding[3];
        const colorBoxHeight = bounds.height - this._padding[0] - this._padding[2];
        
        // Шахматный узор для прозрачности
        if (this._showCheckerboard && (this._color === null || this._color.alpha < 1)) {
            this.paintCheckerboard(ctx, colorBoxX, colorBoxY, colorBoxWidth, colorBoxHeight);
        }
        
        // Цвет
        if (this._color) {
            const displayColor = this._enabled ? this._color : (this._disabledColor ?? this.getDisabledColor(this._color));
            ctx.fillStyle = displayColor.toCss();
            
            if (this._borderRadius > 0) {
                this.drawRoundedRect(ctx, colorBoxX, colorBoxY, colorBoxWidth, colorBoxHeight, this._borderRadius);
                ctx.fill();
            } else {
                ctx.fillRect(colorBoxX, colorBoxY, colorBoxWidth, colorBoxHeight);
            }
        }
        
        // Рамка
        if (this._showBorder) {
            ctx.strokeStyle = theme.border.toCss();
            ctx.lineWidth = 1;
            
            if (this._borderRadius > 0) {
                this.drawRoundedRect(ctx, colorBoxX + 0.5, colorBoxY + 0.5, colorBoxWidth - 1, colorBoxHeight - 1, this._borderRadius);
                ctx.stroke();
            } else {
                ctx.strokeRect(colorBoxX + 0.5, colorBoxY + 0.5, colorBoxWidth - 1, colorBoxHeight - 1);
            }
        }
        
        // Hover/pressed overlay
        if (this._clickable && this._enabled) {
            if (this._pressed) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.fillRect(colorBoxX, colorBoxY, colorBoxWidth, colorBoxHeight);
            } else if (this._hovered) {
                ctx.strokeStyle = theme.focusBorder.toCss();
                ctx.lineWidth = 2;
                ctx.strokeRect(colorBoxX + 1, colorBoxY + 1, colorBoxWidth - 2, colorBoxHeight - 2);
            }
        }
        
        // Палитра
        if (this._paletteOpen) {
            this.paintPalette(ctx, theme);
        }
    }
    
    private paintCheckerboard(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        const cellSize = 4;
        const colors = ['#ffffff', '#cccccc'];
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
        
        for (let row = 0; row < Math.ceil(height / cellSize); row++) {
            for (let col = 0; col < Math.ceil(width / cellSize); col++) {
                ctx.fillStyle = colors[(row + col) % 2];
                ctx.fillRect(x + col * cellSize, y + row * cellSize, cellSize, cellSize);
            }
        }
        
        ctx.restore();
    }
    
    private paintPalette(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const paletteBounds = this.getPaletteBounds();
        
        // Тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        
        // Фон
        ctx.fillStyle = theme.inputBackground.toCss();
        ctx.fillRect(paletteBounds.x, paletteBounds.y, paletteBounds.width, paletteBounds.height);
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Рамка
        ctx.strokeStyle = theme.border.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(paletteBounds.x + 0.5, paletteBounds.y + 0.5, paletteBounds.width - 1, paletteBounds.height - 1);
        
        // Цвета палитры
        const padding = 4;
        const spacing = 2;
        
        for (let i = 0; i < this._palette.length; i++) {
            const row = Math.floor(i / this._paletteColumns);
            const col = i % this._paletteColumns;
            
            const cellX = paletteBounds.x + padding + col * (this._paletteColorSize + spacing);
            const cellY = paletteBounds.y + padding + row * (this._paletteColorSize + spacing);
            
            // Цвет
            ctx.fillStyle = this._palette[i].toCss();
            ctx.fillRect(cellX, cellY, this._paletteColorSize, this._paletteColorSize);
            
            // Рамка ячейки
            ctx.strokeStyle = theme.border.withAlpha(0.5).toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX + 0.5, cellY + 0.5, this._paletteColorSize - 1, this._paletteColorSize - 1);
            
            // Hover
            if (i === this._paletteHoveredIndex) {
                ctx.strokeStyle = theme.focusBorder.toCss();
                ctx.lineWidth = 2;
                ctx.strokeRect(cellX + 1, cellY + 1, this._paletteColorSize - 2, this._paletteColorSize - 2);
            }
            
            // Текущий выбранный
            if (this._color && Color.equals(this._color, this._palette[i])) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(cellX + 2, cellY + 2, this._paletteColorSize - 4, this._paletteColorSize - 4);
            }
        }
        
        // Кнопка очистки (если nullable)
        if (this._nullable) {
            const clearY = paletteBounds.y + paletteBounds.height - 24 - padding;
            ctx.fillStyle = theme.foreground.toCss();
            ctx.font = theme.defaultFont.toCss();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✕ Очистить', paletteBounds.x + paletteBounds.width / 2, clearY + 12);
        }
    }
    
    private getDisabledColor(color: Color): Color {
        const intensity = color.r * color.r + color.g * color.g + color.b * color.b;
        // Порог интенсивности (98304 = 192 * 512)
        return intensity < 98304 ? new Color(128, 128, 128) : new Color(192, 192, 192);
    }
    
    // Обработка событий
    
    onMouseDown(x: number, y: number, button: number): boolean {
        if (!this._enabled || !this._clickable) return false;
        
        // Клик в палитре
        if (this._paletteOpen) {
            const paletteBounds = this.getPaletteBounds();
            
            if (paletteBounds.contains(x, y)) {
                const colorIndex = this.getPaletteColorAtPoint(x, y);
                if (colorIndex >= 0) {
                    this.color = this._palette[colorIndex];
                    this.closePalette();
                    return true;
                }
                
                // Кнопка очистки
                if (this._nullable) {
                    const clearY = paletteBounds.y + paletteBounds.height - 28;
                    if (y >= clearY) {
                        this.clear();
                        this.closePalette();
                        return true;
                    }
                }
                
                return true;
            }
            
            // Клик вне палитры - закрываем
            this.closePalette();
            return true;
        }
        
        // Клик по контролу
        if (this._bounds.contains(x, y)) {
            this._pressed = true;
            
            if (this._showPalette) {
                this.openPalette();
            }
            
            return true;
        }
        
        return false;
    }
    
    onMouseUp(x: number, y: number, button: number): boolean {
        this._pressed = false;
        return true;
    }
    
    onMouseMove(x: number, y: number): boolean {
        let needsRepaint = false;
        
        // Hover в палитре
        if (this._paletteOpen) {
            const paletteBounds = this.getPaletteBounds();
            if (paletteBounds.contains(x, y)) {
                const newHovered = this.getPaletteColorAtPoint(x, y);
                if (newHovered !== this._paletteHoveredIndex) {
                    this._paletteHoveredIndex = newHovered;
                    needsRepaint = true;
                }
            } else if (this._paletteHoveredIndex !== -1) {
                this._paletteHoveredIndex = -1;
                needsRepaint = true;
            }
        }
        
        // Hover на контроле
        const wasHovered = this._hovered;
        this._hovered = this._bounds.contains(x, y);
        
        if (wasHovered !== this._hovered) {
            needsRepaint = true;
        }
        
        return needsRepaint;
    }
    
    onMouseLeave(): void {
        this._hovered = false;
        this._pressed = false;
    }
    
    onKeyDown(key: string, ctrlKey: boolean, shiftKey: boolean): boolean {
        if (!this._enabled || !this._focused) return false;
        
        if (this._paletteOpen) {
            switch (key) {
                case 'Escape':
                    this.closePalette();
                    return true;
                    
                case 'ArrowUp':
                    if (this._paletteHoveredIndex >= this._paletteColumns) {
                        this._paletteHoveredIndex -= this._paletteColumns;
                    }
                    return true;
                    
                case 'ArrowDown':
                    if (this._paletteHoveredIndex + this._paletteColumns < this._palette.length) {
                        this._paletteHoveredIndex += this._paletteColumns;
                    }
                    return true;
                    
                case 'ArrowLeft':
                    if (this._paletteHoveredIndex > 0) {
                        this._paletteHoveredIndex--;
                    }
                    return true;
                    
                case 'ArrowRight':
                    if (this._paletteHoveredIndex < this._palette.length - 1) {
                        this._paletteHoveredIndex++;
                    }
                    return true;
                    
                case 'Enter':
                case ' ':
                    if (this._paletteHoveredIndex >= 0) {
                        this.color = this._palette[this._paletteHoveredIndex];
                    }
                    this.closePalette();
                    return true;
            }
        } else {
            if (key === ' ' || key === 'Enter') {
                if (this._showPalette) {
                    this.openPalette();
                    this._paletteHoveredIndex = 0;
                }
                return true;
            }
        }
        
        return false;
    }
    
    onBlur(): void {
        this._focused = false;
        this.closePalette();
    }
    
    // Приватные методы
    
    private fireColorChanged(oldColor: Color | null): void {
        for (const listener of this._colorChangedListeners) {
            listener(this, this._color, oldColor);
        }
    }
    
    private getPaletteBounds(): Rectangle {
        const rows = Math.ceil(this._palette.length / this._paletteColumns);
        const padding = 4;
        const spacing = 2;
        
        const width = padding * 2 + this._paletteColumns * (this._paletteColorSize + spacing) - spacing;
        let height = padding * 2 + rows * (this._paletteColorSize + spacing) - spacing;
        
        if (this._nullable) {
            height += 28; // Кнопка очистки
        }
        
        return new Rectangle(
            this._bounds.x,
            this._bounds.y + this._bounds.height + 2,
            width,
            height
        );
    }
    
    private getPaletteColorAtPoint(x: number, y: number): number {
        const paletteBounds = this.getPaletteBounds();
        const padding = 4;
        const spacing = 2;
        
        const localX = x - paletteBounds.x - padding;
        const localY = y - paletteBounds.y - padding;
        
        if (localX < 0 || localY < 0) return -1;
        
        const col = Math.floor(localX / (this._paletteColorSize + spacing));
        const row = Math.floor(localY / (this._paletteColorSize + spacing));
        
        if (col >= this._paletteColumns) return -1;
        
        const index = row * this._paletteColumns + col;
        
        return index >= 0 && index < this._palette.length ? index : -1;
    }
    
    private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

/**
 * Хелпер для создания ColorBox
 */
export function createColorBox(
    color?: Color | string,
    options?: {
        showPalette?: boolean;
        nullable?: boolean;
        boxSize?: number;
    }
): ColorBoxControl {
    const control = new ColorBoxControl();
    
    if (color) {
        control.color = typeof color === 'string' ? Color.fromHex(color) : color;
    }
    
    if (options) {
        if (options.showPalette !== undefined) control.showPalette = options.showPalette;
        if (options.nullable !== undefined) control.nullable = options.nullable;
        if (options.boxSize !== undefined) control.boxSize = options.boxSize;
    }
    
    return control;
}
