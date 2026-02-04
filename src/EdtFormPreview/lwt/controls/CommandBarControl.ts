/**
 * Контрол CommandBar - панель команд
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.CommandBarControl
 */
import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, ITheme, Color, Font } from '../theme';
import { Button83Styles, HippoThemeLargeFont } from '../theme/ControlStyles';

// ============================================================================
// ЭЛЕМЕНТ ПАНЕЛИ КОМАНД
// ============================================================================

/**
 * Тип элемента панели команд
 */
export enum CommandBarItemType {
    /** Кнопка */
    Button = 'button',
    /** Разделитель */
    Separator = 'separator',
    /** Подменю */
    Submenu = 'submenu',
    /** Поле поиска */
    SearchField = 'searchField'
}

/**
 * Элемент панели команд
 */
export interface ICommandBarItem {
    /** Идентификатор */
    id: string;
    /** Тип элемента */
    type: CommandBarItemType;
    /** Заголовок */
    title: string;
    /** Иконка (URL или имя) */
    icon?: string;
    /** Подсказка */
    tooltip?: string;
    /** Отключён */
    disabled?: boolean;
    /** Видимость */
    visible?: boolean;
    /** Это кнопка по умолчанию */
    isDefault?: boolean;
    /** Показывать только иконку */
    iconOnly?: boolean;
    /** Дочерние элементы (для подменю) */
    children?: ICommandBarItem[];
    /** Обработчик клика */
    onClick?: () => void;
}

/**
 * Создать элемент с дефолтными значениями
 */
export function createCommandBarItem(id: string, title: string, options?: Partial<ICommandBarItem>): ICommandBarItem {
    return {
        id,
        type: CommandBarItemType.Button,
        title,
        visible: true,
        disabled: false,
        ...options
    };
}

/**
 * Создать разделитель
 */
export function createSeparator(id?: string): ICommandBarItem {
    return {
        id: id || `sep_${Date.now()}`,
        type: CommandBarItemType.Separator,
        title: '',
        visible: true
    };
}

// ============================================================================
// КОНТРОЛ ПАНЕЛИ КОМАНД
// ============================================================================

/**
 * Контрол панели команд
 */
export class CommandBarControl extends LightComposite {
    // Элементы
    private _items: ICommandBarItem[] = [];
    
    // Настройки
    private _rowHeight: number = HippoThemeLargeFont.commandBarRowHeight;
    private _spacing: number = HippoThemeLargeFont.cmdBarBetweenButtonsSpacing;
    private _separatorWidth: number = HippoThemeLargeFont.cmdBarSeparatorWidth;
    private _padding: number = 4;
    
    // Состояние
    private _hoveredItemId: string | null = null;
    private _pressedItemId: string | null = null;
    
    // Кэш размеров элементов
    private _itemRects: Map<string, Rectangle> = new Map();

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Элементы панели */
    get items(): ICommandBarItem[] {
        return this._items;
    }

    set items(value: ICommandBarItem[]) {
        this._items = value;
        this._itemRects.clear();
        this.invalidate();
    }

    /** Высота строки */
    get rowHeight(): number {
        return this._rowHeight;
    }

    set rowHeight(value: number) {
        this._rowHeight = value;
        this.invalidate();
    }

    /** Расстояние между элементами */
    get spacing(): number {
        return this._spacing;
    }

    set spacing(value: number) {
        this._spacing = value;
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ РАБОТЫ С ЭЛЕМЕНТАМИ
    // ========================================================================

    /**
     * Добавить элемент
     */
    addItem(item: ICommandBarItem): void {
        this._items.push(item);
        this._itemRects.clear();
        this.invalidate();
    }

    /**
     * Удалить элемент
     */
    removeItem(itemId: string): void {
        const index = this._items.findIndex(i => i.id === itemId);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._itemRects.clear();
            this.invalidate();
        }
    }

    /**
     * Получить элемент по ID
     */
    getItem(itemId: string): ICommandBarItem | undefined {
        return this._items.find(i => i.id === itemId);
    }

    /**
     * Включить/отключить элемент
     */
    setItemEnabled(itemId: string, enabled: boolean): void {
        const item = this.getItem(itemId);
        if (item) {
            item.disabled = !enabled;
            this.invalidate();
        }
    }

    /**
     * Показать/скрыть элемент
     */
    setItemVisible(itemId: string, visible: boolean): void {
        const item = this.getItem(itemId);
        if (item) {
            item.visible = visible;
            this._itemRects.clear();
            this.invalidate();
        }
    }

    // ========================================================================
    // ВЫЧИСЛЕНИЕ РАЗМЕРОВ
    // ========================================================================

    /**
     * Получить видимые элементы
     */
    private getVisibleItems(): ICommandBarItem[] {
        return this._items.filter(i => i.visible !== false);
    }

    /**
     * Измерить ширину элемента
     */
    private measureItemWidth(ctx: CanvasRenderingContext2D, item: ICommandBarItem, font: Font): number {
        if (item.type === CommandBarItemType.Separator) {
            return this._separatorWidth;
        }

        let width = this._padding * 2;

        // Иконка
        if (item.icon) {
            width += 16 + 4; // размер иконки + отступ
        }

        // Текст
        if (!item.iconOnly && item.title) {
            ctx.font = font.toCss();
            width += ctx.measureText(item.title).width;
        }

        // Стрелка подменю
        if (item.type === CommandBarItemType.Submenu) {
            width += 12;
        }

        return Math.max(width, 24); // минимальная ширина
    }

    /**
     * Вычислить прямоугольники элементов
     */
    private calculateItemRects(ctx: CanvasRenderingContext2D): void {
        if (this._itemRects.size > 0) return;

        const theme = getTheme();
        const font = theme.defaultFont;
        const visibleItems = this.getVisibleItems();

        let x = this.bounds.x + this._padding;
        const y = this.bounds.y + (this.bounds.height - this._rowHeight) / 2;

        for (const item of visibleItems) {
            const width = this.measureItemWidth(ctx, item, font);
            
            this._itemRects.set(item.id, new Rectangle(x, y, width, this._rowHeight));
            
            x += width + (item.type === CommandBarItemType.Separator ? 0 : this._spacing);
        }
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        // Для точного расчёта нужен ctx, возвращаем приблизительный
        const visibleItems = this.getVisibleItems();
        let width = this._padding * 2;

        for (const item of visibleItems) {
            if (item.type === CommandBarItemType.Separator) {
                width += this._separatorWidth;
            } else {
                width += (item.iconOnly ? 24 : 80) + this._spacing;
            }
        }

        return new Dimension(width, this._rowHeight + 6);
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка панели команд
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const { x, y, width, height } = this.bounds;
        const theme = getTheme();

        ctx.save();

        // Фон панели (прозрачный или слегка серый)
        // В 1С панель команд обычно без видимого фона

        // Вычислить позиции элементов
        this.calculateItemRects(ctx);

        // Отрисовать элементы
        const visibleItems = this.getVisibleItems();
        
        for (const item of visibleItems) {
            const rect = this._itemRects.get(item.id);
            if (!rect) continue;

            if (item.type === CommandBarItemType.Separator) {
                this.paintSeparator(ctx, rect);
            } else {
                this.paintButton(ctx, rect, item);
            }
        }

        ctx.restore();
    }

    /**
     * Отрисовка разделителя
     */
    private paintSeparator(ctx: CanvasRenderingContext2D, rect: Rectangle): void {
        const centerX = rect.x + rect.width / 2;
        const topY = rect.y + 4;
        const bottomY = rect.y + rect.height - 4;

        ctx.strokeStyle = Button83Styles.separatorColor.toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + 0.5, topY);
        ctx.lineTo(centerX + 0.5, bottomY);
        ctx.stroke();
    }

    /**
     * Отрисовка кнопки
     */
    private paintButton(ctx: CanvasRenderingContext2D, rect: Rectangle, item: ICommandBarItem): void {
        const theme = getTheme();
        const { x, y, width, height } = rect;

        const isHovered = this._hoveredItemId === item.id;
        const isPressed = this._pressedItemId === item.id;
        const isDisabled = item.disabled === true;
        const isDefault = item.isDefault === true;

        // Фон кнопки
        let bgColor: Color | null = null;
        let borderColor: Color | null = null;
        let textColor: Color;

        if (isDisabled) {
            textColor = theme.disabledForeground;
        } else if (isDefault) {
            // Жёлтая кнопка по умолчанию
            if (isPressed) {
                bgColor = new Color(200, 175, 0);
            } else if (isHovered) {
                bgColor = new Color(255, 235, 50);
            } else {
                bgColor = Button83Styles.defaultButtonBackground;
            }
            borderColor = new Color(170, 150, 40);
            textColor = new Color(0, 0, 0);
        } else {
            // Обычная кнопка
            if (isPressed) {
                bgColor = theme.buttonBackgroundPressed;
            } else if (isHovered) {
                bgColor = theme.buttonBackgroundHover;
            }
            textColor = theme.buttonForeground;
        }

        // Рисуем фон
        if (bgColor) {
            ctx.fillStyle = bgColor.toCss();
            ctx.fillRect(x, y, width, height);
        }

        // Рисуем рамку (только для default или при hover)
        if (borderColor || (isHovered && !isDisabled)) {
            ctx.strokeStyle = (borderColor || theme.buttonBorder).toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
        }

        // Иконка
        let contentX = x + this._padding;
        
        if (item.icon) {
            // TODO: отрисовка реальной иконки
            // Пока рисуем заглушку
            const iconSize = 16;
            const iconY = y + (height - iconSize) / 2;
            
            ctx.fillStyle = isDisabled ? theme.disabledForeground.toCss() : theme.foreground.toCss();
            ctx.fillRect(contentX, iconY, iconSize, iconSize);
            
            contentX += iconSize + 4;
        }

        // Текст
        if (!item.iconOnly && item.title) {
            const font = theme.defaultFont;
            ctx.font = font.toCss();
            ctx.fillStyle = textColor.toCss();
            
            const textY = y + (height + font.size) / 2 - 2;
            ctx.fillText(item.title, contentX, textY);
            
            contentX += ctx.measureText(item.title).width + 4;
        }

        // Стрелка подменю
        if (item.type === CommandBarItemType.Submenu) {
            const arrowX = x + width - 10;
            const arrowY = y + height / 2;
            
            ctx.fillStyle = textColor.toCss();
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY - 3);
            ctx.lineTo(arrowX + 4, arrowY);
            ctx.lineTo(arrowX, arrowY + 3);
            ctx.closePath();
            ctx.fill();
        }

        // Overlay для disabled
        if (isDisabled) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Button83Styles.disabledOverlayAlpha})`;
            ctx.fillRect(x, y, width, height);
        }
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ МЫШИ
    // ========================================================================

    /**
     * Найти элемент по координатам
     */
    private findItemAt(x: number, y: number): ICommandBarItem | null {
        for (const item of this.getVisibleItems()) {
            const rect = this._itemRects.get(item.id);
            if (rect && rect.contains(x, y)) {
                return item;
            }
        }
        return null;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        const item = this.findItemAt(x, y);
        const newHoveredId = item?.id || null;
        
        if (this._hoveredItemId !== newHoveredId) {
            this._hoveredItemId = newHoveredId;
            this.invalidate();
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredItemId !== null || this._pressedItemId !== null) {
            this._hoveredItemId = null;
            this._pressedItemId = null;
            this.invalidate();
        }
    }

    /**
     * Обработка нажатия мыши
     */
    onMouseDown(x: number, y: number): void {
        const item = this.findItemAt(x, y);
        
        if (item && !item.disabled && item.type !== CommandBarItemType.Separator) {
            this._pressedItemId = item.id;
            this.invalidate();
        }
    }

    /**
     * Обработка отпускания мыши
     */
    onMouseUp(x: number, y: number): void {
        const item = this.findItemAt(x, y);
        
        if (this._pressedItemId !== null) {
            // Клик произошёл
            if (item && item.id === this._pressedItemId && !item.disabled) {
                if (item.onClick) {
                    item.onClick();
                }
            }
            
            this._pressedItemId = null;
            this.invalidate();
        }
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        // Основная логика в onMouseUp
    }
}
