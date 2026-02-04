/**
 * Контрол FormattedText - форматированный текст
 * Порт из com._1c.g5.lwt.controls.FormattedTextLabelControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Тип сегмента текста
 */
export enum TextSegmentType {
    Text = 'text',
    Link = 'link',
    Image = 'image'
}

/**
 * Стиль текста
 */
export interface ITextStyle {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    color?: Color;
    backgroundColor?: Color;
    fontSize?: number;
}

/**
 * Сегмент форматированного текста
 */
export interface ITextSegment {
    type: TextSegmentType;
    text?: string;
    style?: ITextStyle;
    href?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
}

/**
 * Слушатель клика по ссылке
 */
export type LinkClickListener = (segment: ITextSegment, href: string) => void;

/**
 * Контрол форматированного текста
 */
export class FormattedTextControl extends LightControl {
    // Сегменты текста
    private _segments: ITextSegment[] = [];
    
    // Базовые параметры
    private _font: Font | null = null;
    private _textColor: Color | null = null;
    private _linkColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    
    // Выравнивание
    private _horizontalAlignment: 'left' | 'center' | 'right' = 'left';
    private _verticalAlignment: 'top' | 'middle' | 'bottom' = 'top';
    
    // Параметры отображения
    private _wrapText: boolean = true;
    private _lineSpacing: number = 1.2;
    private _padding: number = 2;
    
    // Состояние
    private _hoveredLinkIndex: number = -1;
    
    // Слушатели
    private _linkClickListeners: LinkClickListener[] = [];
    
    // Кэш для вычисленных строк
    private _layoutLines: ILayoutLine[] = [];
    
    /**
     * Сегменты текста
     */
    get segments(): ITextSegment[] {
        return this._segments;
    }
    
    set segments(value: ITextSegment[]) {
        this._segments = value;
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Устанавливает простой текст (без форматирования)
     */
    setText(text: string): void {
        this._segments = [{ type: TextSegmentType.Text, text }];
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Получает простой текст (без форматирования)
     */
    getText(): string {
        return this._segments
            .filter(s => s.type === TextSegmentType.Text || s.type === TextSegmentType.Link)
            .map(s => s.text ?? '')
            .join('');
    }
    
    /**
     * Добавляет сегмент текста
     */
    addSegment(segment: ITextSegment): void {
        this._segments.push(segment);
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Добавляет простой текст
     */
    addText(text: string, style?: ITextStyle): void {
        this.addSegment({ type: TextSegmentType.Text, text, style });
    }
    
    /**
     * Добавляет ссылку
     */
    addLink(text: string, href: string, style?: ITextStyle): void {
        this.addSegment({ type: TextSegmentType.Link, text, href, style });
    }
    
    /**
     * Очищает все сегменты
     */
    clear(): void {
        this._segments = [];
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Базовый шрифт
     */
    get font(): Font | null {
        return this._font;
    }
    
    set font(value: Font | null) {
        this._font = value;
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Цвет текста
     */
    get textColor(): Color | null {
        return this._textColor;
    }
    
    set textColor(value: Color | null) {
        this._textColor = value;
        this.invalidate();
    }
    
    /**
     * Цвет ссылок
     */
    get linkColor(): Color | null {
        return this._linkColor;
    }
    
    set linkColor(value: Color | null) {
        this._linkColor = value;
        this.invalidate();
    }
    
    /**
     * Цвет фона
     */
    get backgroundColor(): Color | null {
        return this._backgroundColor;
    }
    
    set backgroundColor(value: Color | null) {
        this._backgroundColor = value;
        this.invalidate();
    }
    
    /**
     * Горизонтальное выравнивание
     */
    get horizontalAlignment(): 'left' | 'center' | 'right' {
        return this._horizontalAlignment;
    }
    
    set horizontalAlignment(value: 'left' | 'center' | 'right') {
        this._horizontalAlignment = value;
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Вертикальное выравнивание
     */
    get verticalAlignment(): 'top' | 'middle' | 'bottom' {
        return this._verticalAlignment;
    }
    
    set verticalAlignment(value: 'top' | 'middle' | 'bottom') {
        this._verticalAlignment = value;
        this.invalidate();
    }
    
    /**
     * Перенос текста
     */
    get wrapText(): boolean {
        return this._wrapText;
    }
    
    set wrapText(value: boolean) {
        this._wrapText = value;
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Межстрочный интервал
     */
    get lineSpacing(): number {
        return this._lineSpacing;
    }
    
    set lineSpacing(value: number) {
        this._lineSpacing = Math.max(1, value);
        this._layoutLines = [];
        this.invalidate();
    }
    
    /**
     * Добавляет слушатель клика по ссылке
     */
    addLinkClickListener(listener: LinkClickListener): void {
        this._linkClickListeners.push(listener);
    }
    
    /**
     * Удаляет слушатель клика по ссылке
     */
    removeLinkClickListener(listener: LinkClickListener): void {
        const index = this._linkClickListeners.indexOf(listener);
        if (index >= 0) {
            this._linkClickListeners.splice(index, 1);
        }
    }
    
    /**
     * Вычисляет предпочтительный размер
     */
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const theme = getTheme();
        const baseFont = this._font ?? theme.defaultFont;
        
        if (widthHint !== -1) {
            // Есть ограничение по ширине - вычисляем высоту
            this.layoutText(ctx, widthHint - this._padding * 2, baseFont, theme);
            const height = this.getTotalHeight(baseFont);
            return new Point(widthHint, heightHint !== -1 ? heightHint : height + this._padding * 2);
        } else {
            // Нет ограничения - вычисляем естественный размер
            ctx.font = baseFont.toCss();
            let totalWidth = 0;
            
            for (const segment of this._segments) {
                if (segment.type === TextSegmentType.Image) {
                    totalWidth += segment.imageWidth ?? 16;
                } else if (segment.text) {
                    const font = this.getSegmentFont(segment, baseFont);
                    ctx.font = font.toCss();
                    totalWidth += ctx.measureText(segment.text).width;
                }
            }
            
            const height = baseFont.size * this._lineSpacing;
            return new Point(
                Math.ceil(totalWidth) + this._padding * 2,
                heightHint !== -1 ? heightHint : Math.ceil(height) + this._padding * 2
            );
        }
    }
    
    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        const baseFont = this._font ?? theme.defaultFont;
        
        ctx.save();
        
        // Фон
        if (this._backgroundColor) {
            ctx.fillStyle = this._backgroundColor.toCss();
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        
        // Layout текста если нужно
        if (this._layoutLines.length === 0) {
            this.layoutText(ctx, bounds.width - this._padding * 2, baseFont, theme);
        }
        
        // Отрисовка строк
        const totalHeight = this.getTotalHeight(baseFont);
        let startY = bounds.y + this._padding;
        
        if (this._verticalAlignment === 'middle') {
            startY = bounds.y + (bounds.height - totalHeight) / 2;
        } else if (this._verticalAlignment === 'bottom') {
            startY = bounds.y + bounds.height - totalHeight - this._padding;
        }
        
        for (const line of this._layoutLines) {
            this.paintLine(ctx, line, bounds.x + this._padding, startY, bounds.width - this._padding * 2, baseFont, theme);
            startY += baseFont.size * this._lineSpacing;
        }
        
        ctx.restore();
    }
    
    /**
     * Layout текста
     */
    private layoutText(ctx: CanvasRenderingContext2D, maxWidth: number, baseFont: Font, theme: ITheme): void {
        this._layoutLines = [];
        
        if (this._segments.length === 0) return;
        
        let currentLine: ILayoutSegment[] = [];
        let currentLineWidth = 0;
        
        for (let i = 0; i < this._segments.length; i++) {
            const segment = this._segments[i];
            
            if (segment.type === TextSegmentType.Image) {
                const imageWidth = segment.imageWidth ?? 16;
                
                if (this._wrapText && currentLineWidth + imageWidth > maxWidth && currentLine.length > 0) {
                    this._layoutLines.push({ segments: currentLine, width: currentLineWidth });
                    currentLine = [];
                    currentLineWidth = 0;
                }
                
                currentLine.push({ segment, segmentIndex: i, width: imageWidth });
                currentLineWidth += imageWidth;
            } else if (segment.text) {
                const font = this.getSegmentFont(segment, baseFont);
                ctx.font = font.toCss();
                
                if (this._wrapText) {
                    const words = segment.text.split(/(\s+)/);
                    
                    for (const word of words) {
                        const wordWidth = ctx.measureText(word).width;
                        
                        if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
                            this._layoutLines.push({ segments: currentLine, width: currentLineWidth });
                            currentLine = [];
                            currentLineWidth = 0;
                        }
                        
                        if (word.trim()) {
                            currentLine.push({ segment: { ...segment, text: word }, segmentIndex: i, width: wordWidth });
                            currentLineWidth += wordWidth;
                        } else if (word) {
                            const spaceWidth = ctx.measureText(word).width;
                            currentLine.push({ segment: { ...segment, text: word }, segmentIndex: i, width: spaceWidth });
                            currentLineWidth += spaceWidth;
                        }
                    }
                } else {
                    const textWidth = ctx.measureText(segment.text).width;
                    currentLine.push({ segment, segmentIndex: i, width: textWidth });
                    currentLineWidth += textWidth;
                }
            }
        }
        
        if (currentLine.length > 0) {
            this._layoutLines.push({ segments: currentLine, width: currentLineWidth });
        }
    }
    
    /**
     * Отрисовка строки
     */
    private paintLine(
        ctx: CanvasRenderingContext2D,
        line: ILayoutLine,
        x: number,
        y: number,
        maxWidth: number,
        baseFont: Font,
        theme: ITheme
    ): void {
        let startX = x;
        
        if (this._horizontalAlignment === 'center') {
            startX = x + (maxWidth - line.width) / 2;
        } else if (this._horizontalAlignment === 'right') {
            startX = x + maxWidth - line.width;
        }
        
        ctx.textBaseline = 'top';
        
        for (const layoutSegment of line.segments) {
            const segment = layoutSegment.segment;
            
            if (segment.type === TextSegmentType.Image) {
                // TODO: Отрисовка изображения
                const imageWidth = segment.imageWidth ?? 16;
                const imageHeight = segment.imageHeight ?? 16;
                ctx.fillStyle = theme.disabledForeground.toCss();
                ctx.fillRect(startX, y, imageWidth, imageHeight);
                startX += imageWidth;
            } else {
                const font = this.getSegmentFont(segment, baseFont);
                const color = this.getSegmentColor(segment, theme);
                
                ctx.font = font.toCss();
                ctx.fillStyle = color.toCss();
                
                // Фон сегмента
                if (segment.style?.backgroundColor) {
                    ctx.fillStyle = segment.style.backgroundColor.toCss();
                    ctx.fillRect(startX, y, layoutSegment.width, font.size * this._lineSpacing);
                    ctx.fillStyle = color.toCss();
                }
                
                // Текст
                if (segment.text) {
                    ctx.fillText(segment.text, startX, y);
                    
                    // Подчёркивание
                    if (segment.style?.underline || segment.type === TextSegmentType.Link) {
                        const underlineY = y + font.size + 1;
                        ctx.beginPath();
                        ctx.moveTo(startX, underlineY);
                        ctx.lineTo(startX + layoutSegment.width, underlineY);
                        ctx.strokeStyle = color.toCss();
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    
                    // Зачёркивание
                    if (segment.style?.strikethrough) {
                        const strikeY = y + font.size / 2;
                        ctx.beginPath();
                        ctx.moveTo(startX, strikeY);
                        ctx.lineTo(startX + layoutSegment.width, strikeY);
                        ctx.strokeStyle = color.toCss();
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                
                startX += layoutSegment.width;
            }
        }
    }
    
    /**
     * Получает шрифт для сегмента
     */
    private getSegmentFont(segment: ITextSegment, baseFont: Font): Font {
        if (!segment.style) return baseFont;
        
        return new Font(
            baseFont.family,
            segment.style.fontSize ?? baseFont.size,
            segment.style.bold ?? baseFont.bold,
            segment.style.italic ?? baseFont.italic
        );
    }
    
    /**
     * Получает цвет для сегмента
     */
    private getSegmentColor(segment: ITextSegment, theme: ITheme): Color {
        if (segment.style?.color) return segment.style.color;
        
        if (segment.type === TextSegmentType.Link) {
            return this._linkColor ?? Color.fromHex('#0066CC');
        }
        
        return this._textColor ?? theme.foreground;
    }
    
    /**
     * Получает общую высоту текста
     */
    private getTotalHeight(baseFont: Font): number {
        return this._layoutLines.length * baseFont.size * this._lineSpacing;
    }
    
    /**
     * Обработка клика
     */
    handleClick(x: number, y: number): boolean {
        // TODO: Определение клика по ссылке
        return false;
    }
    
    /**
     * Обработка наведения мыши
     */
    handleMouseMove(x: number, y: number): void {
        // TODO: Определение наведения на ссылку
    }
}

/**
 * Вспомогательные интерфейсы для layout
 */
interface ILayoutSegment {
    segment: ITextSegment;
    segmentIndex: number;
    width: number;
}

interface ILayoutLine {
    segments: ILayoutSegment[];
    width: number;
}

/**
 * Фабричная функция для создания форматированного текста
 */
export function createFormattedText(config: {
    text?: string;
    segments?: ITextSegment[];
    font?: Font;
    textColor?: Color;
    linkColor?: Color;
    wrapText?: boolean;
    horizontalAlignment?: 'left' | 'center' | 'right';
    verticalAlignment?: 'top' | 'middle' | 'bottom';
} = {}): FormattedTextControl {
    const control = new FormattedTextControl();
    
    if (config.segments) {
        control.segments = config.segments;
    } else if (config.text) {
        control.setText(config.text);
    }
    
    if (config.font !== undefined) control.font = config.font;
    if (config.textColor !== undefined) control.textColor = config.textColor;
    if (config.linkColor !== undefined) control.linkColor = config.linkColor;
    if (config.wrapText !== undefined) control.wrapText = config.wrapText;
    if (config.horizontalAlignment !== undefined) control.horizontalAlignment = config.horizontalAlignment;
    if (config.verticalAlignment !== undefined) control.verticalAlignment = config.verticalAlignment;
    
    return control;
}
