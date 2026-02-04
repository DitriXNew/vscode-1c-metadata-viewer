/**
 * ImageControl - контрол для отображения изображений
 * Порт com._1c.g5.lwt.controls.LightImage
 */

import { LightControl } from '../core/LightControl';
import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { Color, ITheme, getTheme } from '../theme';

/**
 * Режим масштабирования изображения
 */
export enum ImageScaleMode {
    /** Без масштабирования (оригинальный размер) */
    None = 'none',
    /** Заполнить всю область (может обрезаться) */
    Fill = 'fill',
    /** Вписать в область (с сохранением пропорций) */
    Fit = 'fit',
    /** Растянуть (без сохранения пропорций) */
    Stretch = 'stretch',
    /** Растянуть только если больше области */
    Shrink = 'shrink'
}

/**
 * Выравнивание изображения
 */
export enum ImageAlignment {
    TopLeft = 'top-left',
    TopCenter = 'top-center',
    TopRight = 'top-right',
    MiddleLeft = 'middle-left',
    MiddleCenter = 'middle-center',
    MiddleRight = 'middle-right',
    BottomLeft = 'bottom-left',
    BottomCenter = 'bottom-center',
    BottomRight = 'bottom-right'
}

/**
 * Контрол изображения
 */
export class ImageControl extends LightControl {
    // Источники изображений
    private _imageSrc: string | null = null;
    private _disabledImageSrc: string | null = null;
    
    // Загруженные изображения
    private _image: HTMLImageElement | null = null;
    private _disabledImage: HTMLImageElement | null = null;
    private _imageLoaded: boolean = false;
    private _disabledImageLoaded: boolean = false;
    
    // Параметры отображения
    private _scaleMode: ImageScaleMode = ImageScaleMode.Fit;
    private _alignment: ImageAlignment = ImageAlignment.MiddleCenter;
    private _imageOffset: Point = new Point(0, 0);
    private _margins: Point = new Point(4, 4);
    
    // Прозрачность для disabled
    private _disabledOpacity: number = 0.4;
    
    // Placeholder
    private _showPlaceholder: boolean = true;
    private _placeholderColor: Color = new Color(200, 200, 200);
    
    // Граница
    private _showBorder: boolean = false;
    private _borderRadius: number = 0;
    
    // Размер по умолчанию (если нет изображения)
    private _defaultWidth: number = 100;
    private _defaultHeight: number = 100;
    
    // Tooltip
    private _tooltip: string = '';
    
    // Кликабельность
    private _clickable: boolean = false;
    private _hovered: boolean = false;
    private _pressed: boolean = false;
    
    // Слушатели
    private _clickListeners: ((image: ImageControl) => void)[] = [];
    private _loadListeners: ((image: ImageControl, success: boolean) => void)[] = [];
    
    constructor() {
        super();
    }
    
    // Геттеры и сеттеры
    
    get imageSrc(): string | null {
        return this._imageSrc;
    }
    
    set imageSrc(val: string | null) {
        if (this._imageSrc === val) return;
        
        this._imageSrc = val;
        this._imageLoaded = false;
        this._image = null;
        
        if (val) {
            this.loadImage(val, false);
        }
    }
    
    get disabledImageSrc(): string | null {
        return this._disabledImageSrc;
    }
    
    set disabledImageSrc(val: string | null) {
        if (this._disabledImageSrc === val) return;
        
        this._disabledImageSrc = val;
        this._disabledImageLoaded = false;
        this._disabledImage = null;
        
        if (val) {
            this.loadImage(val, true);
        }
    }
    
    get scaleMode(): ImageScaleMode {
        return this._scaleMode;
    }
    
    set scaleMode(val: ImageScaleMode) {
        this._scaleMode = val;
    }
    
    get alignment(): ImageAlignment {
        return this._alignment;
    }
    
    set alignment(val: ImageAlignment) {
        this._alignment = val;
    }
    
    get imageOffset(): Point {
        return this._imageOffset;
    }
    
    set imageOffset(val: Point) {
        this._imageOffset = val;
    }
    
    get margins(): Point {
        return this._margins;
    }
    
    set margins(val: Point) {
        this._margins = val;
    }
    
    get showBorder(): boolean {
        return this._showBorder;
    }
    
    set showBorder(val: boolean) {
        this._showBorder = val;
    }
    
    get borderRadius(): number {
        return this._borderRadius;
    }
    
    set borderRadius(val: number) {
        this._borderRadius = val;
    }
    
    getTooltipText(): string {
        return this._tooltip;
    }
    
    setTooltipText(val: string): void {
        this._tooltip = val;
        this.tooltip = val; // Also set parent's tooltip
    }
    
    get clickable(): boolean {
        return this._clickable;
    }
    
    set clickable(val: boolean) {
        this._clickable = val;
    }
    
    get isLoaded(): boolean {
        return this._imageLoaded;
    }
    
    get naturalWidth(): number {
        return this._image?.naturalWidth ?? 0;
    }
    
    get naturalHeight(): number {
        return this._image?.naturalHeight ?? 0;
    }
    
    // Публичные методы
    
    /**
     * Установить изображение напрямую (HTMLImageElement)
     */
    setImage(image: HTMLImageElement | null): void {
        this._image = image;
        this._imageLoaded = image !== null && image.complete;
    }
    
    /**
     * Загрузить изображение из data URL
     */
    loadFromDataUrl(dataUrl: string): void {
        this.imageSrc = dataUrl;
    }
    
    /**
     * Загрузить изображение из base64
     */
    loadFromBase64(base64: string, mimeType: string = 'image/png'): void {
        this.imageSrc = `data:${mimeType};base64,${base64}`;
    }
    
    /**
     * Очистить изображение
     */
    clear(): void {
        this._imageSrc = null;
        this._image = null;
        this._imageLoaded = false;
        this._disabledImageSrc = null;
        this._disabledImage = null;
        this._disabledImageLoaded = false;
    }
    
    // Слушатели
    
    addClickListener(listener: (image: ImageControl) => void): void {
        this._clickListeners.push(listener);
    }
    
    removeClickListener(listener: (image: ImageControl) => void): void {
        const index = this._clickListeners.indexOf(listener);
        if (index >= 0) {
            this._clickListeners.splice(index, 1);
        }
    }
    
    addLoadListener(listener: (image: ImageControl, success: boolean) => void): void {
        this._loadListeners.push(listener);
    }
    
    removeLoadListener(listener: (image: ImageControl, success: boolean) => void): void {
        const index = this._loadListeners.indexOf(listener);
        if (index >= 0) {
            this._loadListeners.splice(index, 1);
        }
    }
    
    // Вычисление размера
    
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        let width = this._defaultWidth;
        let height = this._defaultHeight;
        
        if (this._image && this._imageLoaded) {
            width = this._image.naturalWidth + this._margins.x * 2;
            height = this._image.naturalHeight + this._margins.y * 2;
        }
        
        if (widthHint !== -1) {
            width = widthHint;
        }
        if (heightHint !== -1) {
            height = heightHint;
        }
        
        return new Point(width, height);
    }
    
    // Отрисовка
    
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this._visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        // Clipping для borderRadius
        if (this._borderRadius > 0) {
            ctx.save();
            this.drawRoundedRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, this._borderRadius);
            ctx.clip();
        }
        
        // Фон (если нет изображения или placeholder)
        if (!this._imageLoaded && this._showPlaceholder) {
            ctx.fillStyle = this._placeholderColor.toCss();
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            
            // Иконка placeholder
            this.paintPlaceholderIcon(ctx, theme);
        }
        
        // Изображение
        const imageToDraw = this.getImageToDraw();
        if (imageToDraw && (this._enabled ? this._imageLoaded : (this._disabledImageLoaded || this._imageLoaded))) {
            this.paintImage(ctx, imageToDraw, theme);
        }
        
        // Hover overlay
        if (this._clickable && this._enabled) {
            if (this._pressed) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            } else if (this._hovered) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        }
        
        if (this._borderRadius > 0) {
            ctx.restore();
        }
        
        // Рамка
        if (this._showBorder) {
            ctx.strokeStyle = theme.border.toCss();
            ctx.lineWidth = 1;
            
            if (this._borderRadius > 0) {
                this.drawRoundedRect(ctx, bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1, this._borderRadius);
                ctx.stroke();
            } else {
                ctx.strokeRect(bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1);
            }
        }
    }
    
    private paintImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, theme: ITheme): void {
        const bounds = this._bounds;
        const contentArea = new Rectangle(
            bounds.x + this._margins.x,
            bounds.y + this._margins.y,
            bounds.width - this._margins.x * 2,
            bounds.height - this._margins.y * 2
        );
        
        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;
        
        if (imgWidth === 0 || imgHeight === 0) return;
        
        let drawWidth: number;
        let drawHeight: number;
        let srcX = 0;
        let srcY = 0;
        let srcWidth = imgWidth;
        let srcHeight = imgHeight;
        
        // Вычисляем размеры в зависимости от режима масштабирования
        switch (this._scaleMode) {
            case ImageScaleMode.None:
                drawWidth = imgWidth;
                drawHeight = imgHeight;
                break;
                
            case ImageScaleMode.Fill: {
                const scaleX = contentArea.width / imgWidth;
                const scaleY = contentArea.height / imgHeight;
                const scale = Math.max(scaleX, scaleY);
                drawWidth = contentArea.width;
                drawHeight = contentArea.height;
                srcWidth = contentArea.width / scale;
                srcHeight = contentArea.height / scale;
                srcX = (imgWidth - srcWidth) / 2;
                srcY = (imgHeight - srcHeight) / 2;
                break;
            }
                
            case ImageScaleMode.Fit: {
                const scaleX = contentArea.width / imgWidth;
                const scaleY = contentArea.height / imgHeight;
                const scale = Math.min(scaleX, scaleY);
                drawWidth = imgWidth * scale;
                drawHeight = imgHeight * scale;
                break;
            }
                
            case ImageScaleMode.Stretch:
                drawWidth = contentArea.width;
                drawHeight = contentArea.height;
                break;
                
            case ImageScaleMode.Shrink: {
                if (imgWidth <= contentArea.width && imgHeight <= contentArea.height) {
                    drawWidth = imgWidth;
                    drawHeight = imgHeight;
                } else {
                    const scaleX = contentArea.width / imgWidth;
                    const scaleY = contentArea.height / imgHeight;
                    const scale = Math.min(scaleX, scaleY);
                    drawWidth = imgWidth * scale;
                    drawHeight = imgHeight * scale;
                }
                break;
            }
        }
        
        // Вычисляем позицию в зависимости от выравнивания
        let drawX: number;
        let drawY: number;
        
        switch (this._alignment) {
            case ImageAlignment.TopLeft:
            case ImageAlignment.MiddleLeft:
            case ImageAlignment.BottomLeft:
                drawX = contentArea.x;
                break;
            case ImageAlignment.TopCenter:
            case ImageAlignment.MiddleCenter:
            case ImageAlignment.BottomCenter:
                drawX = contentArea.x + (contentArea.width - drawWidth) / 2;
                break;
            case ImageAlignment.TopRight:
            case ImageAlignment.MiddleRight:
            case ImageAlignment.BottomRight:
                drawX = contentArea.x + contentArea.width - drawWidth;
                break;
        }
        
        switch (this._alignment) {
            case ImageAlignment.TopLeft:
            case ImageAlignment.TopCenter:
            case ImageAlignment.TopRight:
                drawY = contentArea.y;
                break;
            case ImageAlignment.MiddleLeft:
            case ImageAlignment.MiddleCenter:
            case ImageAlignment.MiddleRight:
                drawY = contentArea.y + (contentArea.height - drawHeight) / 2;
                break;
            case ImageAlignment.BottomLeft:
            case ImageAlignment.BottomCenter:
            case ImageAlignment.BottomRight:
                drawY = contentArea.y + contentArea.height - drawHeight;
                break;
        }
        
        // Применяем смещение
        drawX += this._imageOffset.x;
        drawY += this._imageOffset.y;
        
        // Отрисовка
        if (!this._enabled && this._disabledImage === null) {
            // Рисуем с прозрачностью для disabled
            ctx.globalAlpha = this._disabledOpacity;
        }
        
        if (this._scaleMode === ImageScaleMode.Fill) {
            // Обрезка при Fill
            ctx.drawImage(
                image,
                srcX, srcY, srcWidth, srcHeight,
                drawX, drawY, drawWidth, drawHeight
            );
        } else {
            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    private paintPlaceholderIcon(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const bounds = this._bounds;
        const iconSize = Math.min(32, Math.min(bounds.width, bounds.height) / 2);
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        
        // Простая иконка изображения
        ctx.strokeStyle = theme.disabledForeground.toCss();
        ctx.lineWidth = 2;
        
        // Рамка
        const rectSize = iconSize * 0.8;
        ctx.strokeRect(
            centerX - rectSize / 2,
            centerY - rectSize / 2,
            rectSize,
            rectSize
        );
        
        // Горы (треугольники)
        ctx.beginPath();
        const mountainY = centerY + rectSize * 0.2;
        // Маленькая гора
        ctx.moveTo(centerX - rectSize * 0.3, mountainY);
        ctx.lineTo(centerX - rectSize * 0.1, centerY);
        ctx.lineTo(centerX + rectSize * 0.1, mountainY);
        // Большая гора
        ctx.moveTo(centerX, mountainY);
        ctx.lineTo(centerX + rectSize * 0.25, centerY - rectSize * 0.1);
        ctx.lineTo(centerX + rectSize * 0.4, mountainY);
        ctx.stroke();
        
        // Солнце (круг)
        ctx.beginPath();
        ctx.arc(centerX - rectSize * 0.2, centerY - rectSize * 0.2, iconSize * 0.1, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    private getImageToDraw(): HTMLImageElement | null {
        if (!this._enabled && this._disabledImage && this._disabledImageLoaded) {
            return this._disabledImage;
        }
        return this._image;
    }
    
    // Загрузка изображения
    
    private loadImage(src: string, isDisabled: boolean): void {
        const img = new Image();
        
        img.onload = () => {
            if (isDisabled) {
                this._disabledImage = img;
                this._disabledImageLoaded = true;
            } else {
                this._image = img;
                this._imageLoaded = true;
                
                for (const listener of this._loadListeners) {
                    listener(this, true);
                }
            }
            this.invalidate();
        };
        
        img.onerror = () => {
            if (!isDisabled) {
                this._imageLoaded = false;
                
                for (const listener of this._loadListeners) {
                    listener(this, false);
                }
            }
            this.invalidate();
        };
        
        img.src = src;
    }
    
    // Обработка событий
    
    onMouseDown(x: number, y: number, button: number): boolean {
        if (!this._enabled || !this._clickable) return false;
        
        if (this._bounds.contains(x, y)) {
            this._pressed = true;
            return true;
        }
        return false;
    }
    
    onMouseUp(x: number, y: number, button: number): boolean {
        if (this._pressed && this._bounds.contains(x, y)) {
            this._pressed = false;
            
            // Fire click
            for (const listener of this._clickListeners) {
                listener(this);
            }
            return true;
        }
        
        this._pressed = false;
        return false;
    }
    
    onMouseMove(x: number, y: number): boolean {
        const wasHovered = this._hovered;
        this._hovered = this._bounds.contains(x, y);
        return wasHovered !== this._hovered;
    }
    
    onMouseLeave(): void {
        this._hovered = false;
        this._pressed = false;
    }
    
    // Утилиты
    
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
 * Хелпер для создания изображения
 */
export function createImage(
    src: string,
    options?: {
        scaleMode?: ImageScaleMode;
        alignment?: ImageAlignment;
        showBorder?: boolean;
        borderRadius?: number;
        clickable?: boolean;
    }
): ImageControl {
    const image = new ImageControl();
    image.imageSrc = src;
    
    if (options) {
        if (options.scaleMode) image.scaleMode = options.scaleMode;
        if (options.alignment) image.alignment = options.alignment;
        if (options.showBorder !== undefined) image.showBorder = options.showBorder;
        if (options.borderRadius !== undefined) image.borderRadius = options.borderRadius;
        if (options.clickable !== undefined) image.clickable = options.clickable;
    }
    
    return image;
}
