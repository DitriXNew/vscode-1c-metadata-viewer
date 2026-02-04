/**
 * Контрол Tabs - вкладки (страницы)
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.TabControl
 * и TabDraw.java
 */
import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, ITheme, Color, Font } from '../theme';
import { TabSizes, TabControlStyles } from '../theme/ControlStyles';

// ============================================================================
// СТРАНИЦА ВКЛАДОК
// ============================================================================

/**
 * Страница (вкладка)
 */
export interface ITabPage {
    /** Идентификатор */
    id: string;
    /** Заголовок */
    title: string;
    /** Иконка (URL или имя) */
    icon?: string;
    /** Подсказка */
    tooltip?: string;
    /** Видимость */
    visible?: boolean;
    /** Отключена */
    disabled?: boolean;
    /** Можно закрыть */
    closable?: boolean;
    /** Содержимое (LightControl) */
    content?: LightControl;
}

/**
 * Создать страницу с дефолтными значениями
 */
export function createTabPage(id: string, title: string, options?: Partial<ITabPage>): ITabPage {
    return {
        id,
        title,
        visible: true,
        disabled: false,
        closable: false,
        ...options
    };
}

// ============================================================================
// ПОЗИЦИЯ ВКЛАДОК
// ============================================================================

/**
 * Позиция панели вкладок
 */
export enum TabPosition {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right'
}

/**
 * Стиль вкладок
 */
export enum TabStyle {
    /** Стандартный стиль 8.3 */
    Standard = 'standard',
    /** Компактный */
    Compact = 'compact',
    /** Без рамок (плоский) */
    Flat = 'flat'
}

// ============================================================================
// КОНТРОЛ ВКЛАДОК
// ============================================================================

/**
 * Контрол вкладок
 */
export class TabsControl extends LightComposite {
    // Страницы
    private _pages: ITabPage[] = [];
    private _activePageId: string | null = null;
    
    // Настройки
    private _tabPosition: TabPosition = TabPosition.Top;
    private _tabStyle: TabStyle = TabStyle.Standard;
    private _tabHeight: number = 28;
    private _minTabWidth: number = 50;
    private _maxTabWidth: number = 200;
    private _showCloseButtons: boolean = false;
    
    // Состояние
    private _hoveredPageId: string | null = null;
    private _hoveredCloseButton: boolean = false;
    
    // Скроллинг вкладок (если не помещаются)
    private _tabScrollOffset: number = 0;
    private _showScrollButtons: boolean = false;
    
    // Кэш размеров
    private _tabRects: Map<string, Rectangle> = new Map();

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Страницы */
    get pages(): ITabPage[] {
        return this._pages;
    }

    set pages(value: ITabPage[]) {
        this._pages = value;
        this._tabRects.clear();
        
        // Если нет активной страницы - активировать первую видимую
        if (!this._activePageId || !value.find(p => p.id === this._activePageId)) {
            const firstVisible = value.find(p => p.visible !== false && p.disabled !== true);
            this._activePageId = firstVisible?.id || null;
        }
        
        this.invalidate();
    }

    /** Активная страница */
    get activePageId(): string | null {
        return this._activePageId;
    }

    set activePageId(value: string | null) {
        if (this._activePageId !== value) {
            const page = this._pages.find(p => p.id === value);
            if (page && page.visible !== false && page.disabled !== true) {
                this._activePageId = value;
                this.invalidate();
            }
        }
    }

    /** Активная страница (объект) */
    get activePage(): ITabPage | null {
        return this._pages.find(p => p.id === this._activePageId) || null;
    }

    /** Позиция вкладок */
    get tabPosition(): TabPosition {
        return this._tabPosition;
    }

    set tabPosition(value: TabPosition) {
        this._tabPosition = value;
        this._tabRects.clear();
        this.invalidate();
    }

    /** Стиль вкладок */
    get tabStyle(): TabStyle {
        return this._tabStyle;
    }

    set tabStyle(value: TabStyle) {
        this._tabStyle = value;
        this.invalidate();
    }

    /** Высота вкладки */
    get tabHeight(): number {
        return this._tabHeight;
    }

    set tabHeight(value: number) {
        this._tabHeight = value;
        this._tabRects.clear();
        this.invalidate();
    }

    /** Показывать кнопки закрытия */
    get showCloseButtons(): boolean {
        return this._showCloseButtons;
    }

    set showCloseButtons(value: boolean) {
        this._showCloseButtons = value;
        this._tabRects.clear();
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ РАБОТЫ СО СТРАНИЦАМИ
    // ========================================================================

    /**
     * Добавить страницу
     */
    addPage(page: ITabPage): void {
        this._pages.push(page);
        this._tabRects.clear();
        
        // Активировать первую добавленную
        if (!this._activePageId && page.visible !== false && page.disabled !== true) {
            this._activePageId = page.id;
        }
        
        this.invalidate();
    }

    /**
     * Удалить страницу
     */
    removePage(pageId: string): void {
        const index = this._pages.findIndex(p => p.id === pageId);
        if (index !== -1) {
            this._pages.splice(index, 1);
            this._tabRects.clear();
            
            // Если удалили активную - активировать соседнюю
            if (this._activePageId === pageId) {
                const visiblePages = this._pages.filter(p => p.visible !== false && p.disabled !== true);
                this._activePageId = visiblePages[Math.min(index, visiblePages.length - 1)]?.id || null;
            }
            
            this.invalidate();
        }
    }

    /**
     * Получить страницу по ID
     */
    getPage(pageId: string): ITabPage | undefined {
        return this._pages.find(p => p.id === pageId);
    }

    /**
     * Активировать страницу
     */
    activatePage(pageId: string): boolean {
        const page = this.getPage(pageId);
        if (page && page.visible !== false && page.disabled !== true) {
            this._activePageId = pageId;
            this.invalidate();
            return true;
        }
        return false;
    }

    /**
     * Активировать следующую страницу
     */
    activateNextPage(): void {
        const visiblePages = this._pages.filter(p => p.visible !== false && p.disabled !== true);
        const currentIndex = visiblePages.findIndex(p => p.id === this._activePageId);
        
        if (currentIndex !== -1 && currentIndex < visiblePages.length - 1) {
            this._activePageId = visiblePages[currentIndex + 1].id;
            this.invalidate();
        }
    }

    /**
     * Активировать предыдущую страницу
     */
    activatePrevPage(): void {
        const visiblePages = this._pages.filter(p => p.visible !== false && p.disabled !== true);
        const currentIndex = visiblePages.findIndex(p => p.id === this._activePageId);
        
        if (currentIndex > 0) {
            this._activePageId = visiblePages[currentIndex - 1].id;
            this.invalidate();
        }
    }

    // ========================================================================
    // ВЫЧИСЛЕНИЕ РАЗМЕРОВ
    // ========================================================================

    /**
     * Получить видимые страницы
     */
    private getVisiblePages(): ITabPage[] {
        return this._pages.filter(p => p.visible !== false);
    }

    /**
     * Является ли позиция вкладок горизонтальной
     */
    private isHorizontal(): boolean {
        return this._tabPosition === TabPosition.Top || this._tabPosition === TabPosition.Bottom;
    }

    /**
     * Получить область для панели вкладок
     */
    private getTabBarRect(): Rectangle {
        const { x, y, width, height } = this.bounds;
        
        switch (this._tabPosition) {
            case TabPosition.Top:
                return new Rectangle(x, y, width, this._tabHeight);
            case TabPosition.Bottom:
                return new Rectangle(x, y + height - this._tabHeight, width, this._tabHeight);
            case TabPosition.Left:
                return new Rectangle(x, y, this._tabHeight, height);
            case TabPosition.Right:
                return new Rectangle(x + width - this._tabHeight, y, this._tabHeight, height);
        }
    }

    /**
     * Получить область для содержимого
     */
    private getContentRect(): Rectangle {
        const { x, y, width, height } = this.bounds;
        
        switch (this._tabPosition) {
            case TabPosition.Top:
                return new Rectangle(x, y + this._tabHeight, width, height - this._tabHeight);
            case TabPosition.Bottom:
                return new Rectangle(x, y, width, height - this._tabHeight);
            case TabPosition.Left:
                return new Rectangle(x + this._tabHeight, y, width - this._tabHeight, height);
            case TabPosition.Right:
                return new Rectangle(x, y, width - this._tabHeight, height);
        }
    }

    /**
     * Измерить ширину вкладки
     */
    private measureTabWidth(ctx: CanvasRenderingContext2D, page: ITabPage, font: Font): number {
        let width = TabSizes.internalXOffset * 2;

        // Иконка
        if (page.icon) {
            width += 16 + TabSizes.picText;
        }

        // Текст
        ctx.font = font.toCss();
        width += ctx.measureText(page.title).width;

        // Кнопка закрытия
        if (this._showCloseButtons && page.closable) {
            width += TabSizes.closeButtonOffset + 12;
        }

        return Math.max(this._minTabWidth, Math.min(this._maxTabWidth, width));
    }

    /**
     * Вычислить прямоугольники вкладок
     */
    private calculateTabRects(ctx: CanvasRenderingContext2D): void {
        if (this._tabRects.size > 0) return;

        const theme = getTheme();
        const font = theme.defaultFont;
        const tabBarRect = this.getTabBarRect();
        const visiblePages = this.getVisiblePages();
        const isHorizontal = this.isHorizontal();

        let offset = tabBarRect.x - this._tabScrollOffset;
        
        for (const page of visiblePages) {
            let tabWidth: number;
            let tabHeight: number;
            let tabX: number;
            let tabY: number;

            if (isHorizontal) {
                tabWidth = this.measureTabWidth(ctx, page, font);
                tabHeight = this._tabHeight;
                tabX = offset;
                tabY = tabBarRect.y;
                offset += tabWidth - 1; // -1 для перекрытия рамок (стиль 8.3)
            } else {
                tabWidth = this._tabHeight;
                tabHeight = this.measureTabWidth(ctx, page, font);
                tabX = tabBarRect.x;
                tabY = offset;
                offset += tabHeight - 1;
            }

            this._tabRects.set(page.id, new Rectangle(tabX, tabY, tabWidth, tabHeight));
        }

        // Проверить нужны ли кнопки скролла
        const totalWidth = isHorizontal ? 
            offset - tabBarRect.x + this._tabScrollOffset :
            offset - tabBarRect.y + this._tabScrollOffset;
        
        this._showScrollButtons = isHorizontal ? 
            totalWidth > tabBarRect.width :
            totalWidth > tabBarRect.height;
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        return new Dimension(300, 200);
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка вкладок
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        // Вычислить позиции вкладок
        this.calculateTabRects(ctx);

        // Рисуем панель вкладок
        this.paintTabBar(ctx);

        // Рисуем область содержимого
        this.paintContentArea(ctx);

        // Рисуем содержимое активной страницы
        const activePage = this.activePage;
        if (activePage?.content) {
            const contentRect = this.getContentRect();
            activePage.content.setBounds(contentRect);
            activePage.content.paint(ctx, clip);
        }

        ctx.restore();
    }

    /**
     * Отрисовка панели вкладок
     */
    private paintTabBar(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const tabBarRect = this.getTabBarRect();
        const visiblePages = this.getVisiblePages();

        // Фон панели вкладок
        ctx.fillStyle = theme.groupBackground.toCss();
        ctx.fillRect(tabBarRect.x, tabBarRect.y, tabBarRect.width, tabBarRect.height);

        // Линия под вкладками (для top position)
        if (this._tabPosition === TabPosition.Top) {
            ctx.strokeStyle = theme.groupBorder.toCss();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(tabBarRect.x, tabBarRect.y + tabBarRect.height - 0.5);
            ctx.lineTo(tabBarRect.x + tabBarRect.width, tabBarRect.y + tabBarRect.height - 0.5);
            ctx.stroke();
        }

        // Клиппинг для вкладок
        ctx.save();
        ctx.beginPath();
        ctx.rect(tabBarRect.x, tabBarRect.y, tabBarRect.width, tabBarRect.height);
        ctx.clip();

        // Рисуем неактивные вкладки сначала
        for (const page of visiblePages) {
            if (page.id !== this._activePageId) {
                this.paintTab(ctx, page, false);
            }
        }

        // Затем активную вкладку поверх
        const activePage = this.activePage;
        if (activePage) {
            this.paintTab(ctx, activePage, true);
        }

        ctx.restore();

        // Кнопки скролла
        if (this._showScrollButtons) {
            this.paintScrollButtons(ctx, tabBarRect);
        }
    }

    /**
     * Отрисовка одной вкладки
     */
    private paintTab(ctx: CanvasRenderingContext2D, page: ITabPage, isActive: boolean): void {
        const rect = this._tabRects.get(page.id);
        if (!rect) return;

        const theme = getTheme();
        const { x, y, width, height } = rect;
        const isHovered = this._hoveredPageId === page.id;
        const isDisabled = page.disabled === true;

        // Фон вкладки
        let bgColor: Color;
        if (isActive) {
            bgColor = theme.background; // Белый для активной
        } else if (isHovered && !isDisabled) {
            bgColor = theme.buttonBackgroundHover;
        } else {
            bgColor = theme.groupBackground;
        }

        ctx.fillStyle = bgColor.toCss();
        
        if (this._tabStyle === TabStyle.Standard) {
            // Скруглённые углы сверху
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x, y + 3);
            ctx.quadraticCurveTo(x, y, x + 3, y);
            ctx.lineTo(x + width - 3, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + 3);
            ctx.lineTo(x + width, y + height);
            ctx.closePath();
            ctx.fill();

            // Рамка (кроме нижней для активной)
            ctx.strokeStyle = theme.groupBorder.toCss();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y + height);
            ctx.lineTo(x + 0.5, y + 3);
            ctx.quadraticCurveTo(x + 0.5, y + 0.5, x + 3, y + 0.5);
            ctx.lineTo(x + width - 3, y + 0.5);
            ctx.quadraticCurveTo(x + width - 0.5, y + 0.5, x + width - 0.5, y + 3);
            ctx.lineTo(x + width - 0.5, y + height);
            if (!isActive) {
                ctx.lineTo(x + 0.5, y + height);
            }
            ctx.stroke();
        } else {
            // Простой прямоугольник
            ctx.fillRect(x, y, width, height);
            
            if (!isActive) {
                ctx.strokeStyle = theme.groupBorder.toCss();
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
            }
        }

        // Содержимое вкладки
        let contentX = x + TabSizes.internalXOffset;
        const font = theme.defaultFont;
        ctx.font = font.toCss();

        // Иконка
        if (page.icon) {
            // TODO: отрисовка реальной иконки
            const iconSize = 16;
            const iconY = y + (height - iconSize) / 2;
            
            ctx.fillStyle = isDisabled ? theme.disabledForeground.toCss() : theme.foreground.toCss();
            ctx.fillRect(contentX, iconY, iconSize, iconSize);
            
            contentX += iconSize + TabSizes.picText;
        }

        // Текст
        const textColor = isDisabled ? TabControlStyles.textColorDisabled : theme.foreground;
        ctx.fillStyle = textColor.toCss();
        const textY = y + (height + font.size) / 2 - 2;
        ctx.fillText(page.title, contentX, textY);

        // Кнопка закрытия
        if (this._showCloseButtons && page.closable) {
            const closeX = x + width - TabSizes.closeButtonOffset - 8;
            const closeY = y + (height - 8) / 2;
            
            // Крестик
            ctx.strokeStyle = isDisabled ? TabControlStyles.textColorDisabled.toCss() : theme.foreground.toCss();
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(closeX, closeY);
            ctx.lineTo(closeX + 8, closeY + 8);
            ctx.moveTo(closeX + 8, closeY);
            ctx.lineTo(closeX, closeY + 8);
            ctx.stroke();
        }
    }

    /**
     * Отрисовка кнопок скролла
     */
    private paintScrollButtons(ctx: CanvasRenderingContext2D, tabBarRect: Rectangle): void {
        const theme = getTheme();
        const btnSize = TabSizes.defaultScrollerHeight;

        // Левая/верхняя кнопка
        const leftBtnX = tabBarRect.x;
        const leftBtnY = tabBarRect.y + (tabBarRect.height - btnSize) / 2;

        ctx.fillStyle = theme.buttonBackground.toCss();
        ctx.fillRect(leftBtnX, leftBtnY, btnSize, btnSize);
        ctx.strokeStyle = theme.buttonBorder.toCss();
        ctx.strokeRect(leftBtnX + 0.5, leftBtnY + 0.5, btnSize - 1, btnSize - 1);

        // Стрелка влево
        ctx.fillStyle = theme.foreground.toCss();
        ctx.beginPath();
        ctx.moveTo(leftBtnX + 9, leftBtnY + 4);
        ctx.lineTo(leftBtnX + 5, leftBtnY + btnSize / 2);
        ctx.lineTo(leftBtnX + 9, leftBtnY + btnSize - 4);
        ctx.closePath();
        ctx.fill();

        // Правая/нижняя кнопка
        const rightBtnX = tabBarRect.x + tabBarRect.width - btnSize;
        const rightBtnY = leftBtnY;

        ctx.fillStyle = theme.buttonBackground.toCss();
        ctx.fillRect(rightBtnX, rightBtnY, btnSize, btnSize);
        ctx.strokeStyle = theme.buttonBorder.toCss();
        ctx.strokeRect(rightBtnX + 0.5, rightBtnY + 0.5, btnSize - 1, btnSize - 1);

        // Стрелка вправо
        ctx.fillStyle = theme.foreground.toCss();
        ctx.beginPath();
        ctx.moveTo(rightBtnX + 5, rightBtnY + 4);
        ctx.lineTo(rightBtnX + 9, rightBtnY + btnSize / 2);
        ctx.lineTo(rightBtnX + 5, rightBtnY + btnSize - 4);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Отрисовка области содержимого
     */
    private paintContentArea(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const contentRect = this.getContentRect();

        // Фон
        ctx.fillStyle = theme.background.toCss();
        ctx.fillRect(contentRect.x, contentRect.y, contentRect.width, contentRect.height);

        // Рамка
        ctx.strokeStyle = theme.groupBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(
            contentRect.x + 0.5, 
            contentRect.y + 0.5, 
            contentRect.width - 1, 
            contentRect.height - 1
        );
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ МЫШИ
    // ========================================================================

    /**
     * Найти страницу по координатам
     */
    private findPageAt(x: number, y: number): ITabPage | null {
        for (const page of this.getVisiblePages()) {
            const rect = this._tabRects.get(page.id);
            if (rect && rect.contains(x, y)) {
                return page;
            }
        }
        return null;
    }

    /**
     * Проверить попадание в кнопку закрытия
     */
    private isCloseButtonHit(x: number, y: number, page: ITabPage): boolean {
        if (!this._showCloseButtons || !page.closable) return false;

        const rect = this._tabRects.get(page.id);
        if (!rect) return false;

        const closeX = rect.x + rect.width - TabSizes.closeButtonOffset - 8;
        const closeY = rect.y + (rect.height - 8) / 2;

        return x >= closeX && x <= closeX + 12 && y >= closeY && y <= closeY + 12;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        const page = this.findPageAt(x, y);
        const newHoveredId = page?.id || null;
        const newHoveredClose = page ? this.isCloseButtonHit(x, y, page) : false;
        
        if (this._hoveredPageId !== newHoveredId || this._hoveredCloseButton !== newHoveredClose) {
            this._hoveredPageId = newHoveredId;
            this._hoveredCloseButton = newHoveredClose;
            this.invalidate();
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredPageId !== null) {
            this._hoveredPageId = null;
            this._hoveredCloseButton = false;
            this.invalidate();
        }
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        const page = this.findPageAt(x, y);
        
        if (page) {
            // Клик на кнопку закрытия
            if (this.isCloseButtonHit(x, y, page)) {
                this.removePage(page.id);
                return;
            }

            // Клик на вкладку
            if (page.disabled !== true) {
                this.activatePage(page.id);
            }
        }
    }
}
