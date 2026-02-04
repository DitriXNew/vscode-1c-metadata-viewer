/**
 * Контрол ScrolledContentComposite - контейнер с прокруткой
 * Полный порт из com._1c.g5.lwt.controls.LightScrolledContentComposite
 */
import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';
import { getTheme, ITheme, Color } from '../theme';
import { ILightControl, ILightComposite } from '../core/interfaces';

/**
 * Размещение навигации
 */
export enum NavigationPlacement {
    Beginning = 'beginning',
    End = 'end'
}

/**
 * Видимость навигации
 */
export enum NavigationVisibility {
    AlwaysHidden = 'alwaysHidden',
    AlwaysVisible = 'alwaysVisible',
    Auto = 'auto'
}

/**
 * Позиция прокрутки
 */
export interface IScrollPosition {
    x: number;
    y: number;
}

/**
 * Слушатель изменения позиции прокрутки
 */
export type ScrollPositionChangedListener = (composite: ScrolledContentComposite, position: IScrollPosition) => void;

/**
 * Внутренний viewport контейнер с поддержкой revealRectangle
 */
class ViewportComposite extends LightComposite {
    private _scrolledParent: ScrolledContentComposite;
    
    constructor(parent: ScrolledContentComposite) {
        super();
        this._scrolledParent = parent;
    }
    
    /**
     * Показывает указанный прямоугольник, прокручивая при необходимости
     */
    revealRectangle(rectangle: Rectangle, partial: boolean = false): void {
        const bounds = new Rectangle(0, 0, this._bounds.width, this._bounds.height);
        const visibleRect = bounds.intersection(rectangle);
        
        const REVEAL_MARGIN = 12;
        const REVEAL_PARTIAL_RATIO = 0.75;
        
        if (!partial || 
            !rectangle.equals(visibleRect) && 
            (visibleRect.width / rectangle.width < REVEAL_PARTIAL_RATIO || 
             visibleRect.height / rectangle.height < REVEAL_PARTIAL_RATIO)) {
            
            let horizontalDelta = 0;
            let verticalDelta = 0;
            
            if (rectangle.x < 0) {
                horizontalDelta = rectangle.x - REVEAL_MARGIN;
            } else if (rectangle.x + rectangle.width > bounds.width) {
                horizontalDelta = rectangle.x + rectangle.width - bounds.width + REVEAL_MARGIN;
            }
            
            if (rectangle.y < 0) {
                verticalDelta = rectangle.y - REVEAL_MARGIN;
            } else if (rectangle.y + rectangle.height > bounds.height) {
                verticalDelta = rectangle.y + rectangle.height - bounds.height + REVEAL_MARGIN;
            }
            
            this._scrolledParent.scrollBy(horizontalDelta, verticalDelta);
        }
    }
}

/**
 * Контейнер с прокруткой
 * Полный порт из LWT LightScrolledContentComposite
 */
export class ScrolledContentComposite extends LightComposite {
    private static readonly REVEAL_MARGIN = 12;
    private static readonly REVEAL_PARTIAL_RATIO = 0.75;
    
    // Внутренний viewport
    private readonly _viewport: ViewportComposite;
    
    // Контент (единственный дочерний контрол viewport)
    private _content: ILightControl | null = null;
    
    // Навигация (scrollbars или другие контролы)
    private _horizontalNavigation: ILightControl | null = null;
    private _verticalNavigation: ILightControl | null = null;
    
    // Размещение навигации
    private _horizontalNavigationPlacement: NavigationPlacement = NavigationPlacement.End;
    private _verticalNavigationPlacement: NavigationPlacement = NavigationPlacement.End;
    
    // Видимость навигации
    private _horizontalNavigationVisibility: NavigationVisibility = NavigationVisibility.Auto;
    private _verticalNavigationVisibility: NavigationVisibility = NavigationVisibility.Auto;
    
    // Растягивание контента
    private _horizontalStretch: boolean = true;
    private _verticalStretch: boolean = true;
    
    // Позиция и диапазон прокрутки
    private _scrollPosition: Point = new Point(0, 0);
    private _scrollRange: Point = new Point(0, 0);
    
    // Слушатели изменения позиции
    private _scrollPositionListeners: Set<ScrollPositionChangedListener> = new Set();
    
    // Параметры встроенных scrollbars
    private _scrollbarWidth: number = 12;
    private _useBuiltinScrollbars: boolean = true;
    
    // Состояние scrollbar
    private _verticalThumbHovered: boolean = false;
    private _verticalThumbDragging: boolean = false;
    private _horizontalThumbHovered: boolean = false;
    private _horizontalThumbDragging: boolean = false;
    private _dragStartY: number = 0;
    private _dragStartX: number = 0;
    private _dragStartScrollY: number = 0;
    private _dragStartScrollX: number = 0;
    
    // Цвета
    private _backgroundColor: Color | null = null;
    private _borderColor: Color | null = null;
    
    // Кэш для layout
    private _showHorizontalScrollbar: boolean = false;
    private _showVerticalScrollbar: boolean = false;
    private _viewportBounds: Rectangle = new Rectangle(0, 0, 0, 0);
    
    constructor() {
        super();
        this._viewport = new ViewportComposite(this);
        // Добавляем viewport как дочерний контрол
        super.addChild(this._viewport);
    }
    
    /**
     * Проверяет, является ли контрол частью навигации
     */
    static isNavigationControl(control: ILightControl): boolean {
        let current: ILightControl | null = control;
        while (current) {
            const parent: ILightComposite | null = current.parent;
            if (parent instanceof ScrolledContentComposite) {
                if (parent._horizontalNavigation === current || parent._verticalNavigation === current) {
                    return true;
                }
            }
            current = parent as ILightControl | null;
        }
        return false;
    }
    
    // ===== Контент =====
    
    /**
     * Возвращает контент
     */
    getContent(): ILightControl | null {
        return this._content;
    }
    
    /**
     * Устанавливает контент
     */
    setContent(content: ILightControl | null): void {
        if (this._content === content) return;
        
        if (this._content) {
            this._viewport.removeChild(this._content);
        }
        
        this._content = content;
        
        if (content) {
            this._viewport.addChild(content);
        }
        
        this.invalidate();
    }
    
    // ===== Горизонтальная навигация =====
    
    /**
     * Возвращает горизонтальную навигацию
     */
    getHorizontalNavigation(): ILightControl | null {
        return this._horizontalNavigation;
    }
    
    /**
     * Устанавливает горизонтальную навигацию
     */
    setHorizontalNavigation(navigation: ILightControl | null): void {
        if (this._horizontalNavigation) {
            super.removeChild(this._horizontalNavigation);
        }
        this._horizontalNavigation = navigation;
        if (navigation) {
            super.addChild(navigation);
        }
        this.invalidate();
    }
    
    /**
     * Видимость горизонтальной навигации
     */
    get horizontalNavigationVisibility(): NavigationVisibility {
        return this._horizontalNavigationVisibility;
    }
    
    set horizontalNavigationVisibility(value: NavigationVisibility) {
        this._horizontalNavigationVisibility = value;
        this.invalidate();
    }
    
    /**
     * Размещение горизонтальной навигации
     */
    get horizontalNavigationPlacement(): NavigationPlacement {
        return this._horizontalNavigationPlacement;
    }
    
    set horizontalNavigationPlacement(value: NavigationPlacement) {
        this._horizontalNavigationPlacement = value;
        this.invalidate();
    }
    
    // ===== Вертикальная навигация =====
    
    /**
     * Возвращает вертикальную навигацию
     */
    getVerticalNavigation(): ILightControl | null {
        return this._verticalNavigation;
    }
    
    /**
     * Устанавливает вертикальную навигацию
     */
    setVerticalNavigation(navigation: ILightControl | null): void {
        if (this._verticalNavigation) {
            super.removeChild(this._verticalNavigation);
        }
        this._verticalNavigation = navigation;
        if (navigation) {
            super.addChild(navigation);
        }
        this.invalidate();
    }
    
    /**
     * Видимость вертикальной навигации
     */
    get verticalNavigationVisibility(): NavigationVisibility {
        return this._verticalNavigationVisibility;
    }
    
    set verticalNavigationVisibility(value: NavigationVisibility) {
        this._verticalNavigationVisibility = value;
        this.invalidate();
    }
    
    /**
     * Размещение вертикальной навигации
     */
    get verticalNavigationPlacement(): NavigationPlacement {
        return this._verticalNavigationPlacement;
    }
    
    set verticalNavigationPlacement(value: NavigationPlacement) {
        this._verticalNavigationPlacement = value;
        this.invalidate();
    }
    
    // ===== Растягивание =====
    
    /**
     * Горизонтальное растягивание
     */
    get horizontalStretch(): boolean {
        return this._horizontalStretch;
    }
    
    set horizontalStretch(value: boolean) {
        this._horizontalStretch = value;
        this.invalidate();
    }
    
    /**
     * Вертикальное растягивание
     */
    get verticalStretch(): boolean {
        return this._verticalStretch;
    }
    
    set verticalStretch(value: boolean) {
        this._verticalStretch = value;
        this.invalidate();
    }
    
    // ===== Прокрутка =====
    
    /**
     * Возвращает диапазон прокрутки
     */
    getScrollRange(): IScrollPosition {
        return { x: this._scrollRange.x, y: this._scrollRange.y };
    }
    
    /**
     * Возвращает позицию прокрутки
     */
    getScrollPosition(): IScrollPosition {
        return { x: this._scrollPosition.x, y: this._scrollPosition.y };
    }
    
    /**
     * Прокручивает на указанное смещение
     */
    scrollBy(horizontalDelta: number, verticalDelta: number): IScrollPosition {
        const oldPosition = this.getScrollPosition();
        this.scrollTo(this._scrollPosition.x + horizontalDelta, this._scrollPosition.y + verticalDelta);
        return {
            x: this._scrollPosition.x - oldPosition.x,
            y: this._scrollPosition.y - oldPosition.y
        };
    }
    
    /**
     * Прокручивает по горизонтали на указанное смещение
     */
    scrollHorizontallyBy(delta: number): number {
        return this.scrollBy(delta, 0).x;
    }
    
    /**
     * Прокручивает по вертикали на указанное смещение
     */
    scrollVerticallyBy(delta: number): number {
        return this.scrollBy(0, delta).y;
    }
    
    /**
     * Прокручивает к указанной позиции
     */
    scrollTo(horizontalPosition: number, verticalPosition: number): void {
        const newX = Math.max(0, Math.min(this._scrollRange.x, horizontalPosition));
        const newY = Math.max(0, Math.min(this._scrollRange.y, verticalPosition));
        
        if (this._content) {
            const contentBounds = this._content.getBounds();
            const newBounds = new Rectangle(-newX, -newY, contentBounds.width, contentBounds.height);
            if (!contentBounds.equals(newBounds)) {
                this._content.setBounds(newBounds);
            }
        }
        
        if (this._scrollPosition.x !== newX || this._scrollPosition.y !== newY) {
            this._scrollPosition = new Point(newX, newY);
            this.fireScrollPositionChanged();
            this.invalidate();
        }
    }
    
    /**
     * Прокручивает по горизонтали к указанной позиции
     */
    scrollHorizontallyTo(position: number): void {
        this.scrollTo(position, this._scrollPosition.y);
    }
    
    /**
     * Прокручивает по вертикали к указанной позиции
     */
    scrollVerticallyTo(position: number): void {
        this.scrollTo(this._scrollPosition.x, position);
    }
    
    /**
     * Прокручивает к началу
     */
    scrollToTop(): void {
        this.scrollVerticallyTo(0);
    }
    
    /**
     * Прокручивает к концу
     */
    scrollToBottom(): void {
        this.scrollVerticallyTo(this._scrollRange.y);
    }
    
    /**
     * Прокручивает влево
     */
    scrollToLeft(): void {
        this.scrollHorizontallyTo(0);
    }
    
    /**
     * Прокручивает вправо
     */
    scrollToRight(): void {
        this.scrollHorizontallyTo(this._scrollRange.x);
    }
    
    /**
     * Делает прямоугольник видимым
     */
    revealRectangle(rect: Rectangle, partial: boolean = false): void {
        this._viewport.revealRectangle(rect, partial);
    }
    
    /**
     * Делает контрол видимым
     */
    ensureVisible(control: ILightControl): void {
        const bounds = control.getBounds();
        this.revealRectangle(bounds, false);
    }
    
    // ===== Слушатели =====
    
    /**
     * Добавляет слушатель изменения позиции прокрутки
     */
    addScrollPositionListener(listener: ScrollPositionChangedListener): void {
        this._scrollPositionListeners.add(listener);
    }
    
    /**
     * Удаляет слушатель изменения позиции прокрутки
     */
    removeScrollPositionListener(listener: ScrollPositionChangedListener): void {
        this._scrollPositionListeners.delete(listener);
    }
    
    // ===== Прочие свойства =====
    
    /**
     * Возвращает viewport
     */
    getViewport(): LightComposite {
        return this._viewport;
    }
    
    /**
     * Ширина встроенного scrollbar
     */
    get scrollbarWidth(): number {
        return this._scrollbarWidth;
    }
    
    set scrollbarWidth(value: number) {
        this._scrollbarWidth = Math.max(8, value);
        this.invalidate();
    }
    
    /**
     * Использовать встроенные scrollbars
     */
    get useBuiltinScrollbars(): boolean {
        return this._useBuiltinScrollbars;
    }
    
    set useBuiltinScrollbars(value: boolean) {
        this._useBuiltinScrollbars = value;
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
     * Цвет рамки
     */
    get borderColor(): Color | null {
        return this._borderColor;
    }
    
    set borderColor(value: Color | null) {
        this._borderColor = value;
        this.invalidate();
    }
    
    // ===== Размеры и layout =====
    
    /**
     * Вычисляет предпочтительный размер
     */
    computePreferredSize(wHint: number, hHint: number): Point {
        if (!this._content) {
            return super.computePreferredSize(wHint, hHint);
        }
        return this._content.computePreferredSize(wHint, hHint);
    }
    
    /**
     * Возвращает bounds viewport
     */
    protected getViewportBounds(): Rectangle {
        return new Rectangle(0, 0, this._bounds.width, this._bounds.height);
    }
    
    /**
     * Вычисляет размер контента
     */
    protected computeContentSize(_ctx: CanvasRenderingContext2D): Point {
        if (!this._content) {
            return new Point(0, 0);
        }
        return this._content.computePreferredSize(-1, -1);
    }
    
    /**
     * Выполняет layout
     */
    layout(changed: boolean = true): void {
        const theme = getTheme();
        
        // Получаем размер контента
        // Создаём временный canvas для вычислений
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.font = theme.defaultFont.toCss();
        
        const contentSize = this.computeContentSize(ctx);
        let viewportBounds = this.getViewportBounds();
        
        // Вычисляем размеры навигации
        const horizontalNavigationSize = this._horizontalNavigation 
            ? this._horizontalNavigation.computePreferredSize(viewportBounds.width, -1)
            : new Point(0, 0);
        const verticalNavigationSize = this._verticalNavigation 
            ? this._verticalNavigation.computePreferredSize(-1, viewportBounds.height)
            : new Point(0, 0);
        
        // Для встроенных scrollbars
        const builtinHorizontalSize = this._useBuiltinScrollbars ? this._scrollbarWidth : 0;
        const builtinVerticalSize = this._useBuiltinScrollbars ? this._scrollbarWidth : 0;
        
        // Определяем видимость навигации
        let showHorizontalNavigation = 
            this._horizontalNavigationVisibility === NavigationVisibility.AlwaysVisible ||
            (this._horizontalNavigationVisibility === NavigationVisibility.Auto && contentSize.x > viewportBounds.width);
        
        let showVerticalNavigation = 
            this._verticalNavigationVisibility === NavigationVisibility.AlwaysVisible ||
            (this._verticalNavigationVisibility === NavigationVisibility.Auto && contentSize.y > viewportBounds.height);
        
        // Уменьшаем viewport для навигации
        if (showHorizontalNavigation) {
            const navHeight = this._horizontalNavigation ? horizontalNavigationSize.y : builtinHorizontalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x,
                viewportBounds.y,
                viewportBounds.width,
                viewportBounds.height - navHeight
            );
        }
        if (showVerticalNavigation) {
            const navWidth = this._verticalNavigation ? verticalNavigationSize.x : builtinVerticalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x,
                viewportBounds.y,
                viewportBounds.width - navWidth,
                viewportBounds.height
            );
        }
        
        // Повторная проверка после уменьшения viewport
        if (!showHorizontalNavigation && this._horizontalNavigationVisibility === NavigationVisibility.Auto && 
            contentSize.x > viewportBounds.width) {
            showHorizontalNavigation = true;
            const navHeight = this._horizontalNavigation ? horizontalNavigationSize.y : builtinHorizontalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x,
                viewportBounds.y,
                viewportBounds.width,
                viewportBounds.height - navHeight
            );
        }
        if (!showVerticalNavigation && this._verticalNavigationVisibility === NavigationVisibility.Auto && 
            contentSize.y > viewportBounds.height) {
            showVerticalNavigation = true;
            const navWidth = this._verticalNavigation ? verticalNavigationSize.x : builtinVerticalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x,
                viewportBounds.y,
                viewportBounds.width - navWidth,
                viewportBounds.height
            );
        }
        
        // Смещение viewport в зависимости от placement
        if (showHorizontalNavigation && this._horizontalNavigationPlacement === NavigationPlacement.Beginning) {
            const navHeight = this._horizontalNavigation ? horizontalNavigationSize.y : builtinHorizontalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x,
                viewportBounds.y + navHeight,
                viewportBounds.width,
                viewportBounds.height
            );
        }
        if (showVerticalNavigation && this._verticalNavigationPlacement === NavigationPlacement.Beginning) {
            const navWidth = this._verticalNavigation ? verticalNavigationSize.x : builtinVerticalSize;
            viewportBounds = new Rectangle(
                viewportBounds.x + navWidth,
                viewportBounds.y,
                viewportBounds.width,
                viewportBounds.height
            );
        }
        
        // Применяем stretch
        let finalContentSize = new Point(contentSize.x, contentSize.y);
        if (this._horizontalStretch && !showHorizontalNavigation) {
            finalContentSize = new Point(viewportBounds.width, finalContentSize.y);
        }
        if (this._verticalStretch && !showVerticalNavigation) {
            finalContentSize = new Point(finalContentSize.x, viewportBounds.height);
        }
        
        // Обновляем диапазон прокрутки
        this._scrollRange = new Point(
            Math.max(0, finalContentSize.x - viewportBounds.width),
            Math.max(0, finalContentSize.y - viewportBounds.height)
        );
        
        // Корректируем позицию прокрутки
        this._scrollPosition = new Point(
            Math.min(this._scrollRange.x, this._scrollPosition.x),
            Math.min(this._scrollRange.y, this._scrollPosition.y)
        );
        
        // Устанавливаем bounds viewport
        this._viewport.setBounds(viewportBounds);
        
        // Устанавливаем bounds контента
        if (this._content) {
            this._content.setBounds(new Rectangle(
                -this._scrollPosition.x,
                -this._scrollPosition.y,
                finalContentSize.x,
                finalContentSize.y
            ));
            
            if (this._content instanceof LightComposite) {
                (this._content as LightComposite).layout(changed);
            }
        }
        
        // Layout навигации
        if (this._horizontalNavigation) {
            if (showHorizontalNavigation) {
                this._horizontalNavigation.setVisible(true);
                const navY = this._horizontalNavigationPlacement === NavigationPlacement.Beginning
                    ? viewportBounds.y - horizontalNavigationSize.y
                    : viewportBounds.y + viewportBounds.height;
                this._horizontalNavigation.setBounds(new Rectangle(
                    viewportBounds.x,
                    navY,
                    viewportBounds.width,
                    horizontalNavigationSize.y
                ));
                if (this._horizontalNavigation instanceof LightComposite) {
                    (this._horizontalNavigation as LightComposite).layout(changed);
                }
            } else {
                this._horizontalNavigation.setVisible(false);
            }
        }
        
        if (this._verticalNavigation) {
            if (showVerticalNavigation) {
                this._verticalNavigation.setVisible(true);
                const navX = this._verticalNavigationPlacement === NavigationPlacement.Beginning
                    ? viewportBounds.x - verticalNavigationSize.x
                    : viewportBounds.x + viewportBounds.width;
                this._verticalNavigation.setBounds(new Rectangle(
                    navX,
                    viewportBounds.y,
                    verticalNavigationSize.x,
                    viewportBounds.height
                ));
                if (this._verticalNavigation instanceof LightComposite) {
                    (this._verticalNavigation as LightComposite).layout(changed);
                }
            } else {
                this._verticalNavigation.setVisible(false);
            }
        }
        
        // Сохраняем флаги видимости для отрисовки встроенных scrollbars
        this._showHorizontalScrollbar = showHorizontalNavigation && this._useBuiltinScrollbars && !this._horizontalNavigation;
        this._showVerticalScrollbar = showVerticalNavigation && this._useBuiltinScrollbars && !this._verticalNavigation;
        this._viewportBounds = viewportBounds;
    }
    
    // ===== Отрисовка =====
    
    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        
        ctx.save();
        
        // Фон
        this.paintBackground(ctx, clip);
        
        // Выполняем layout если нужно
        this.layout(false);
        
        // Отрисовываем viewport с контентом
        this.paintViewport(ctx, clip);
        
        // Отрисовываем встроенные scrollbars
        if (this._showVerticalScrollbar) {
            this.paintBuiltinVerticalScrollbar(ctx, theme);
        }
        if (this._showHorizontalScrollbar) {
            this.paintBuiltinHorizontalScrollbar(ctx, theme);
        }
        
        // Отрисовываем внешнюю навигацию
        if (this._horizontalNavigation?.isVisible()) {
            this.paintChild(ctx, this._horizontalNavigation, clip);
        }
        if (this._verticalNavigation?.isVisible()) {
            this.paintChild(ctx, this._verticalNavigation, clip);
        }
        
        // Рамка
        this.paintBorder(ctx, clip);
        
        ctx.restore();
    }
    
    /**
     * Отрисовывает дочерний контрол
     */
    private paintChild(ctx: CanvasRenderingContext2D, child: ILightControl, clip: Rectangle): void {
        const bounds = child.getBounds();
        const childClip = clip.intersection(bounds);
        if (childClip.isEmpty()) return;
        
        ctx.save();
        ctx.translate(bounds.x, bounds.y);
        const localClip = childClip.translated(-bounds.x, -bounds.y);
        child.paint(ctx, localClip);
        ctx.restore();
    }
    
    /**
     * Отрисовка фона
     */
    protected override paintBackground(ctx: CanvasRenderingContext2D, _clip: Rectangle): void {
        if (this._backgroundColor) {
            ctx.fillStyle = this._backgroundColor.toCss();
            ctx.fillRect(this._bounds.x, this._bounds.y, this._bounds.width, this._bounds.height);
        }
    }
    
    /**
     * Отрисовка рамки
     */
    protected override paintBorder(ctx: CanvasRenderingContext2D, _clip: Rectangle): void {
        if (this._borderColor) {
            ctx.strokeStyle = this._borderColor.toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(
                this._bounds.x + 0.5, 
                this._bounds.y + 0.5, 
                this._bounds.width - 1, 
                this._bounds.height - 1
            );
        }
    }
    
    /**
     * Отрисовка viewport
     */
    private paintViewport(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this._viewportBounds) return;
        
        ctx.save();
        
        // Clip viewport
        ctx.beginPath();
        ctx.rect(
            this._bounds.x + this._viewportBounds.x, 
            this._bounds.y + this._viewportBounds.y, 
            this._viewportBounds.width, 
            this._viewportBounds.height
        );
        ctx.clip();
        
        // Смещаем для прокрутки
        ctx.translate(this._bounds.x + this._viewportBounds.x, this._bounds.y + this._viewportBounds.y);
        
        // Отрисовываем контент
        if (this._content?.isVisible()) {
            const contentBounds = this._content.getBounds();
            const contentClip = new Rectangle(
                -contentBounds.x,
                -contentBounds.y,
                this._viewportBounds.width,
                this._viewportBounds.height
            );
            
            ctx.save();
            ctx.translate(contentBounds.x, contentBounds.y);
            this._content.paint(ctx, contentClip);
            ctx.restore();
        }
        
        ctx.restore();
    }
    
    /**
     * Отрисовка встроенного вертикального scrollbar
     */
    private paintBuiltinVerticalScrollbar(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        if (!this._viewportBounds) return;
        
        const scrollbarX = this._bounds.x + this._viewportBounds.x + this._viewportBounds.width;
        const scrollbarY = this._bounds.y + this._viewportBounds.y;
        const scrollbarHeight = this._viewportBounds.height;
        
        // Track
        ctx.fillStyle = theme.scrollbarTrack.toCss();
        ctx.fillRect(scrollbarX, scrollbarY, this._scrollbarWidth, scrollbarHeight);
        
        // Thumb
        if (this._scrollRange.y > 0) {
            const thumbHeight = Math.max(20, (this._viewportBounds.height / (this._viewportBounds.height + this._scrollRange.y)) * scrollbarHeight);
            const thumbY = scrollbarY + (this._scrollPosition.y / this._scrollRange.y) * (scrollbarHeight - thumbHeight);
            
            let thumbColor: Color;
            if (this._verticalThumbDragging) {
                thumbColor = theme.scrollbarThumbActive;
            } else if (this._verticalThumbHovered) {
                thumbColor = theme.scrollbarThumbHover;
            } else {
                thumbColor = theme.scrollbarThumb;
            }
            
            ctx.fillStyle = thumbColor.toCss();
            this.drawRoundedRect(ctx, scrollbarX + 2, thumbY + 2, this._scrollbarWidth - 4, thumbHeight - 4, 3);
            ctx.fill();
        }
    }
    
    /**
     * Отрисовка встроенного горизонтального scrollbar
     */
    private paintBuiltinHorizontalScrollbar(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        if (!this._viewportBounds) return;
        
        const scrollbarX = this._bounds.x + this._viewportBounds.x;
        const scrollbarY = this._bounds.y + this._viewportBounds.y + this._viewportBounds.height;
        const scrollbarWidth = this._viewportBounds.width;
        
        // Track
        ctx.fillStyle = theme.scrollbarTrack.toCss();
        ctx.fillRect(scrollbarX, scrollbarY, scrollbarWidth, this._scrollbarWidth);
        
        // Thumb
        if (this._scrollRange.x > 0) {
            const thumbWidth = Math.max(20, (this._viewportBounds.width / (this._viewportBounds.width + this._scrollRange.x)) * scrollbarWidth);
            const thumbX = scrollbarX + (this._scrollPosition.x / this._scrollRange.x) * (scrollbarWidth - thumbWidth);
            
            let thumbColor: Color;
            if (this._horizontalThumbDragging) {
                thumbColor = theme.scrollbarThumbActive;
            } else if (this._horizontalThumbHovered) {
                thumbColor = theme.scrollbarThumbHover;
            } else {
                thumbColor = theme.scrollbarThumb;
            }
            
            ctx.fillStyle = thumbColor.toCss();
            this.drawRoundedRect(ctx, thumbX + 2, scrollbarY + 2, thumbWidth - 4, this._scrollbarWidth - 4, 3);
            ctx.fill();
        }
    }
    
    /**
     * Обработка колеса мыши
     */
    handleWheel(deltaX: number, deltaY: number): boolean {
        const scrolled = this.scrollBy(deltaX, deltaY * 4);
        return scrolled.x !== 0 || scrolled.y !== 0;
    }
    
    /**
     * Устанавливает состояние наведения на вертикальный thumb
     */
    setVerticalThumbHovered(hovered: boolean): void {
        if (this._verticalThumbHovered !== hovered) {
            this._verticalThumbHovered = hovered;
            this.invalidate();
        }
    }
    
    /**
     * Устанавливает состояние перетаскивания вертикального thumb
     */
    setVerticalThumbDragging(dragging: boolean, startY?: number): void {
        if (this._verticalThumbDragging !== dragging) {
            this._verticalThumbDragging = dragging;
            if (dragging && startY !== undefined) {
                this._dragStartY = startY;
                this._dragStartScrollY = this._scrollPosition.y;
            }
            this.invalidate();
        }
    }
    
    /**
     * Устанавливает состояние наведения на горизонтальный thumb
     */
    setHorizontalThumbHovered(hovered: boolean): void {
        if (this._horizontalThumbHovered !== hovered) {
            this._horizontalThumbHovered = hovered;
            this.invalidate();
        }
    }
    
    /**
     * Устанавливает состояние перетаскивания горизонтального thumb
     */
    setHorizontalThumbDragging(dragging: boolean, startX?: number): void {
        if (this._horizontalThumbDragging !== dragging) {
            this._horizontalThumbDragging = dragging;
            if (dragging && startX !== undefined) {
                this._dragStartX = startX;
                this._dragStartScrollX = this._scrollPosition.x;
            }
            this.invalidate();
        }
    }
    
    /**
     * Обрабатывает перетаскивание вертикального thumb
     */
    handleVerticalThumbDrag(currentY: number): void {
        if (!this._verticalThumbDragging || this._scrollRange.y <= 0) return;
        
        const scrollbarHeight = this._viewportBounds.height;
        const thumbHeight = Math.max(20, (this._viewportBounds.height / (this._viewportBounds.height + this._scrollRange.y)) * scrollbarHeight);
        const deltaY = currentY - this._dragStartY;
        const scrollDelta = (deltaY / (scrollbarHeight - thumbHeight)) * this._scrollRange.y;
        
        this.scrollVerticallyTo(this._dragStartScrollY + scrollDelta);
    }
    
    /**
     * Обрабатывает перетаскивание горизонтального thumb
     */
    handleHorizontalThumbDrag(currentX: number): void {
        if (!this._horizontalThumbDragging || this._scrollRange.x <= 0) return;
        
        const scrollbarWidth = this._viewportBounds.width;
        const thumbWidth = Math.max(20, (this._viewportBounds.width / (this._viewportBounds.width + this._scrollRange.x)) * scrollbarWidth);
        const deltaX = currentX - this._dragStartX;
        const scrollDelta = (deltaX / (scrollbarWidth - thumbWidth)) * this._scrollRange.x;
        
        this.scrollHorizontallyTo(this._dragStartScrollX + scrollDelta);
    }
    
    /**
     * Проверяет, попадает ли точка в вертикальный scrollbar
     */
    isPointInVerticalScrollbar(x: number, y: number): boolean {
        if (!this._showVerticalScrollbar) return false;
        
        const scrollbarX = this._viewportBounds.x + this._viewportBounds.width;
        const scrollbarY = this._viewportBounds.y;
        
        return x >= scrollbarX && x < scrollbarX + this._scrollbarWidth &&
               y >= scrollbarY && y < scrollbarY + this._viewportBounds.height;
    }
    
    /**
     * Проверяет, попадает ли точка в горизонтальный scrollbar
     */
    isPointInHorizontalScrollbar(x: number, y: number): boolean {
        if (!this._showHorizontalScrollbar) return false;
        
        const scrollbarX = this._viewportBounds.x;
        const scrollbarY = this._viewportBounds.y + this._viewportBounds.height;
        
        return x >= scrollbarX && x < scrollbarX + this._viewportBounds.width &&
               y >= scrollbarY && y < scrollbarY + this._scrollbarWidth;
    }
    
    /**
     * Рисует закруглённый прямоугольник
     */
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
    
    /**
     * Вызывает слушателей изменения позиции прокрутки
     */
    private fireScrollPositionChanged(): void {
        const position = this.getScrollPosition();
        for (const listener of this._scrollPositionListeners) {
            listener(this, position);
        }
    }
}

/**
 * Фабричная функция для создания ScrolledContentComposite
 */
export function createScrolledContentComposite(config: {
    content?: ILightControl;
    horizontalNavigationVisibility?: NavigationVisibility;
    verticalNavigationVisibility?: NavigationVisibility;
    horizontalNavigationPlacement?: NavigationPlacement;
    verticalNavigationPlacement?: NavigationPlacement;
    horizontalStretch?: boolean;
    verticalStretch?: boolean;
    scrollbarWidth?: number;
    useBuiltinScrollbars?: boolean;
    backgroundColor?: Color;
    borderColor?: Color;
} = {}): ScrolledContentComposite {
    const composite = new ScrolledContentComposite();
    
    if (config.content !== undefined) composite.setContent(config.content);
    if (config.horizontalNavigationVisibility !== undefined) composite.horizontalNavigationVisibility = config.horizontalNavigationVisibility;
    if (config.verticalNavigationVisibility !== undefined) composite.verticalNavigationVisibility = config.verticalNavigationVisibility;
    if (config.horizontalNavigationPlacement !== undefined) composite.horizontalNavigationPlacement = config.horizontalNavigationPlacement;
    if (config.verticalNavigationPlacement !== undefined) composite.verticalNavigationPlacement = config.verticalNavigationPlacement;
    if (config.horizontalStretch !== undefined) composite.horizontalStretch = config.horizontalStretch;
    if (config.verticalStretch !== undefined) composite.verticalStretch = config.verticalStretch;
    if (config.scrollbarWidth !== undefined) composite.scrollbarWidth = config.scrollbarWidth;
    if (config.useBuiltinScrollbars !== undefined) composite.useBuiltinScrollbars = config.useBuiltinScrollbars;
    if (config.backgroundColor !== undefined) composite.backgroundColor = config.backgroundColor;
    if (config.borderColor !== undefined) composite.borderColor = config.borderColor;
    
    return composite;
}
