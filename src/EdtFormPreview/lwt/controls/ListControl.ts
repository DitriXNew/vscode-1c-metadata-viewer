/**
 * ListControl - простой список элементов
 * Порт com._1c.g5.lwt.controls.LightList
 */

import { LightControl } from '../core/LightControl';
import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { Color, ITheme, getTheme } from '../theme';

/**
 * Режим выделения
 */
export enum ListSelectionMode {
    /** Одиночный выбор */
    Single = 'single',
    /** Множественный выбор */
    Multi = 'multi',
    /** Без выбора */
    None = 'none'
}

/**
 * Элемент списка
 */
export interface IListItem<T = unknown> {
    /** Значение */
    value: T;
    /** Отображаемый текст */
    text: string;
    /** Иконка (опционально) */
    icon?: string;
    /** Отключён */
    disabled?: boolean;
    /** Подсветка цветом */
    backgroundColor?: Color;
    /** Цвет текста */
    foregroundColor?: Color;
}

/**
 * Слушатель изменения выделения
 */
export type ListSelectionChangedListener<T = unknown> = (list: ListControl<T>, selectedItems: IListItem<T>[]) => void;

/**
 * Слушатель двойного клика
 */
export type ListItemDoubleClickListener<T = unknown> = (list: ListControl<T>, item: IListItem<T>) => void;

/**
 * Контрол списка
 */
export class ListControl<T = unknown> extends LightControl {
    // Элементы
    private _items: IListItem<T>[] = [];
    
    // Выделение
    private _selectionMode: ListSelectionMode = ListSelectionMode.Single;
    private _selection: Set<number> = new Set();
    private _focusedIndex: number = -1;
    private _hoveredIndex: number = -1;
    private _shiftAnchorIndex: number = -1;
    
    // Прокрутка
    private _scrollTop: number = 0;
    private _itemHeight: number = 22;
    
    // Внешний вид
    private _showBorder: boolean = true;
    private _borderRadius: number = 0;
    private _padding: number = 4;
    private _iconSize: number = 16;
    private _showIcons: boolean = true;
    
    // Скроллбар
    private _scrollbarWidth: number = 12;
    private _scrollbarHovered: boolean = false;
    private _scrollbarDragging: boolean = false;
    private _scrollbarDragStartY: number = 0;
    private _scrollbarDragStartScrollTop: number = 0;
    
    // Быстрый поиск
    private _fastSearchString: string = '';
    private _fastSearchTimer: number | null = null;
    private _fastSearchDelay: number = 1000;
    
    // Состояние
    private _focused: boolean = false;
    private _hovered: boolean = false;
    
    // События
    private _selectionChangedListeners: ListSelectionChangedListener<T>[] = [];
    private _doubleClickListeners: ListItemDoubleClickListener<T>[] = [];
    
    constructor() {
        super();
    }
    
    // Геттеры и сеттеры
    
    get items(): IListItem<T>[] {
        return this._items;
    }
    
    set items(val: IListItem<T>[]) {
        this._items = val;
        this._selection.clear();
        this._focusedIndex = -1;
        this._scrollTop = 0;
    }
    
    get selectionMode(): ListSelectionMode {
        return this._selectionMode;
    }
    
    set selectionMode(val: ListSelectionMode) {
        this._selectionMode = val;
        if (val === ListSelectionMode.Single && this._selection.size > 1) {
            // Оставляем только первый выбранный
            const first = Array.from(this._selection)[0];
            this._selection.clear();
            if (first !== undefined) {
                this._selection.add(first);
            }
        } else if (val === ListSelectionMode.None) {
            this._selection.clear();
        }
    }
    
    get selectedIndices(): number[] {
        return Array.from(this._selection);
    }
    
    get selectedItems(): IListItem<T>[] {
        return Array.from(this._selection).map(i => this._items[i]).filter(Boolean);
    }
    
    get itemHeight(): number {
        return this._itemHeight;
    }
    
    set itemHeight(val: number) {
        this._itemHeight = val;
    }
    
    get showBorder(): boolean {
        return this._showBorder;
    }
    
    set showBorder(val: boolean) {
        this._showBorder = val;
    }
    
    get showIcons(): boolean {
        return this._showIcons;
    }
    
    set showIcons(val: boolean) {
        this._showIcons = val;
    }
    
    get focusedIndex(): number {
        return this._focusedIndex;
    }
    
    // Публичные методы
    
    addItem(item: IListItem<T>, position?: number): void {
        if (position === undefined || position >= this._items.length) {
            this._items.push(item);
        } else {
            this._items.splice(position, 0, item);
            // Обновляем индексы выделения
            const newSelection = new Set<number>();
            for (const idx of this._selection) {
                newSelection.add(idx >= position ? idx + 1 : idx);
            }
            this._selection = newSelection;
        }
    }
    
    addItems(items: IListItem<T>[], position?: number): void {
        if (position === undefined || position >= this._items.length) {
            this._items.push(...items);
        } else {
            this._items.splice(position, 0, ...items);
            // Обновляем индексы
            const shift = items.length;
            const newSelection = new Set<number>();
            for (const idx of this._selection) {
                newSelection.add(idx >= position ? idx + shift : idx);
            }
            this._selection = newSelection;
        }
    }
    
    removeItem(index: number): IListItem<T> | undefined {
        if (index < 0 || index >= this._items.length) return undefined;
        
        const removed = this._items.splice(index, 1)[0];
        
        // Обновляем выделение
        const newSelection = new Set<number>();
        for (const idx of this._selection) {
            if (idx < index) {
                newSelection.add(idx);
            } else if (idx > index) {
                newSelection.add(idx - 1);
            }
            // idx === index - удаляем из выделения
        }
        this._selection = newSelection;
        
        // Обновляем фокус
        if (this._focusedIndex === index) {
            this._focusedIndex = Math.min(index, this._items.length - 1);
        } else if (this._focusedIndex > index) {
            this._focusedIndex--;
        }
        
        return removed;
    }
    
    removeItems(indices: number[]): void {
        // Сортируем по убыванию, чтобы не сбивались индексы
        const sorted = [...indices].sort((a, b) => b - a);
        for (const index of sorted) {
            this.removeItem(index);
        }
    }
    
    clearItems(): void {
        this._items = [];
        this._selection.clear();
        this._focusedIndex = -1;
        this._scrollTop = 0;
    }
    
    selectItem(index: number): void {
        if (this._selectionMode === ListSelectionMode.None) return;
        if (index < 0 || index >= this._items.length) return;
        if (this._items[index].disabled) return;
        
        if (this._selectionMode === ListSelectionMode.Single) {
            this._selection.clear();
        }
        
        this._selection.add(index);
        this._focusedIndex = index;
        this.ensureVisible(index);
        this.fireSelectionChanged();
    }
    
    selectItems(indices: number[]): void {
        if (this._selectionMode !== ListSelectionMode.Multi) return;
        
        for (const index of indices) {
            if (index >= 0 && index < this._items.length && !this._items[index].disabled) {
                this._selection.add(index);
            }
        }
        
        if (indices.length > 0) {
            this._focusedIndex = indices[indices.length - 1];
            this.ensureVisible(this._focusedIndex);
        }
        
        this.fireSelectionChanged();
    }
    
    deselectItem(index: number): void {
        this._selection.delete(index);
        this.fireSelectionChanged();
    }
    
    deselectAll(): void {
        this._selection.clear();
        this.fireSelectionChanged();
    }
    
    selectAll(): void {
        if (this._selectionMode !== ListSelectionMode.Multi) return;
        
        for (let i = 0; i < this._items.length; i++) {
            if (!this._items[i].disabled) {
                this._selection.add(i);
            }
        }
        this.fireSelectionChanged();
    }
    
    toggleSelection(index: number): void {
        if (this._selection.has(index)) {
            this.deselectItem(index);
        } else {
            this.selectItem(index);
        }
    }
    
    ensureVisible(index: number): void {
        if (index < 0 || index >= this._items.length) return;
        
        const contentArea = this.getContentArea();
        const itemTop = index * this._itemHeight;
        const itemBottom = itemTop + this._itemHeight;
        
        if (itemTop < this._scrollTop) {
            this._scrollTop = itemTop;
        } else if (itemBottom > this._scrollTop + contentArea.height) {
            this._scrollTop = itemBottom - contentArea.height;
        }
        
        this.clampScrollTop();
    }
    
    scrollToTop(): void {
        this._scrollTop = 0;
    }
    
    scrollToBottom(): void {
        this._scrollTop = this.getMaxScrollTop();
    }
    
    findItemByValue(value: T): number {
        return this._items.findIndex(item => item.value === value);
    }
    
    findItemByText(text: string, ignoreCase: boolean = true): number {
        const search = ignoreCase ? text.toLowerCase() : text;
        return this._items.findIndex(item => 
            (ignoreCase ? item.text.toLowerCase() : item.text) === search
        );
    }
    
    // Слушатели
    
    addSelectionChangedListener(listener: ListSelectionChangedListener<T>): void {
        this._selectionChangedListeners.push(listener);
    }
    
    removeSelectionChangedListener(listener: ListSelectionChangedListener<T>): void {
        const index = this._selectionChangedListeners.indexOf(listener);
        if (index >= 0) {
            this._selectionChangedListeners.splice(index, 1);
        }
    }
    
    addDoubleClickListener(listener: ListItemDoubleClickListener<T>): void {
        this._doubleClickListeners.push(listener);
    }
    
    removeDoubleClickListener(listener: ListItemDoubleClickListener<T>): void {
        const index = this._doubleClickListeners.indexOf(listener);
        if (index >= 0) {
            this._doubleClickListeners.splice(index, 1);
        }
    }
    
    // Вычисление размера
    
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const theme = getTheme();
        ctx.font = theme.defaultFont.toCss();
        
        let maxWidth = 100;
        for (const item of this._items) {
            const textWidth = ctx.measureText(item.text).width;
            const itemWidth = textWidth + this._padding * 2 + (this._showIcons ? this._iconSize + this._padding : 0);
            maxWidth = Math.max(maxWidth, itemWidth);
        }
        
        const width = widthHint !== -1 ? widthHint : maxWidth + this._scrollbarWidth;
        const visibleItems = Math.min(10, Math.max(3, this._items.length));
        const height = heightHint !== -1 ? heightHint : visibleItems * this._itemHeight + 2;
        
        return new Point(width, height);
    }
    
    // Отрисовка
    
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this._visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        // Фон
        ctx.fillStyle = theme.inputBackground.toCss();
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Рамка
        if (this._showBorder) {
            ctx.strokeStyle = this._focused ? 
                theme.inputBorderActive.toCss() : 
                theme.inputBorder.toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1);
        }
        
        // Область контента
        const contentArea = this.getContentArea();
        
        // Clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(contentArea.x, contentArea.y, contentArea.width, contentArea.height);
        ctx.clip();
        
        // Отрисовка элементов
        this.paintItems(ctx, theme, contentArea);
        
        ctx.restore();
        
        // Скроллбар
        if (this.needsScrollbar()) {
            this.paintScrollbar(ctx, theme);
        }
    }
    
    private paintItems(ctx: CanvasRenderingContext2D, theme: ITheme, contentArea: Rectangle): void {
        const firstVisible = Math.floor(this._scrollTop / this._itemHeight);
        const lastVisible = Math.min(
            this._items.length - 1,
            Math.ceil((this._scrollTop + contentArea.height) / this._itemHeight)
        );
        
        ctx.font = theme.defaultFont.toCss();
        ctx.textBaseline = 'middle';
        
        for (let i = firstVisible; i <= lastVisible; i++) {
            const item = this._items[i];
            if (!item) continue;
            
            const y = contentArea.y + i * this._itemHeight - this._scrollTop;
            const itemBounds = new Rectangle(contentArea.x, y, contentArea.width, this._itemHeight);
            
            // Фон элемента
            if (this._selection.has(i)) {
                ctx.fillStyle = theme.selectionBackground.toCss();
                ctx.fillRect(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
            } else if (i === this._hoveredIndex) {
                ctx.fillStyle = theme.controlHoverBackground?.toCss() ?? theme.selectionBackground.withAlpha(0.3).toCss();
                ctx.fillRect(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
            } else if (item.backgroundColor) {
                ctx.fillStyle = item.backgroundColor.toCss();
                ctx.fillRect(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
            }
            
            // Фокус
            if (i === this._focusedIndex && this._focused) {
                ctx.strokeStyle = theme.focusBorder.toCss();
                ctx.lineWidth = 1;
                ctx.setLineDash([1, 1]);
                ctx.strokeRect(itemBounds.x + 0.5, itemBounds.y + 0.5, itemBounds.width - 1, itemBounds.height - 1);
                ctx.setLineDash([]);
            }
            
            // Текст
            let textX = itemBounds.x + this._padding;
            
            // Иконка (если есть)
            if (this._showIcons && item.icon) {
                // Рисуем placeholder для иконки
                ctx.fillStyle = theme.disabledForeground.toCss();
                ctx.fillRect(textX, itemBounds.y + (this._itemHeight - this._iconSize) / 2, this._iconSize, this._iconSize);
                textX += this._iconSize + this._padding;
            } else if (this._showIcons) {
                textX += this._iconSize + this._padding;
            }
            
            // Цвет текста
            if (item.disabled) {
                ctx.fillStyle = theme.disabledForeground.toCss();
            } else if (this._selection.has(i)) {
                ctx.fillStyle = theme.tableSelectionForeground?.toCss() ?? theme.foreground.toCss();
            } else if (item.foregroundColor) {
                ctx.fillStyle = item.foregroundColor.toCss();
            } else {
                ctx.fillStyle = theme.foreground.toCss();
            }
            
            ctx.textAlign = 'left';
            ctx.fillText(item.text, textX, itemBounds.y + this._itemHeight / 2);
        }
    }
    
    private paintScrollbar(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const scrollbarBounds = this.getScrollbarBounds();
        const thumbBounds = this.getScrollbarThumbBounds();
        
        // Трек
        ctx.fillStyle = theme.scrollbarTrack.toCss();
        ctx.fillRect(scrollbarBounds.x, scrollbarBounds.y, scrollbarBounds.width, scrollbarBounds.height);
        
        // Thumb
        if (this._scrollbarDragging) {
            ctx.fillStyle = theme.scrollbarThumbActive.toCss();
        } else if (this._scrollbarHovered) {
            ctx.fillStyle = theme.scrollbarThumbHover.toCss();
        } else {
            ctx.fillStyle = theme.scrollbarThumb.toCss();
        }
        
        const thumbRadius = Math.min(3, thumbBounds.width / 2);
        this.drawRoundedRect(ctx, thumbBounds.x, thumbBounds.y, thumbBounds.width, thumbBounds.height, thumbRadius);
        ctx.fill();
    }
    
    // Обработка событий
    
    onMouseDown(x: number, y: number, button: number): boolean {
        if (!this._enabled) return false;
        
        // Проверяем скроллбар
        if (this.needsScrollbar()) {
            const thumbBounds = this.getScrollbarThumbBounds();
            if (thumbBounds.contains(x, y)) {
                this._scrollbarDragging = true;
                this._scrollbarDragStartY = y;
                this._scrollbarDragStartScrollTop = this._scrollTop;
                return true;
            }
            
            const scrollbarBounds = this.getScrollbarBounds();
            if (scrollbarBounds.contains(x, y)) {
                // Клик в треке - прокрутка на страницу
                const contentArea = this.getContentArea();
                if (y < thumbBounds.y) {
                    this._scrollTop -= contentArea.height;
                } else {
                    this._scrollTop += contentArea.height;
                }
                this.clampScrollTop();
                return true;
            }
        }
        
        // Клик по элементу
        const itemIndex = this.getItemIndexAtPoint(x, y);
        if (itemIndex >= 0 && !this._items[itemIndex].disabled) {
            this.handleItemClick(itemIndex, button === 1, false, false);
        }
        
        return true;
    }
    
    onMouseUp(x: number, y: number, button: number): boolean {
        this._scrollbarDragging = false;
        return true;
    }
    
    onMouseMove(x: number, y: number): boolean {
        if (this._scrollbarDragging) {
            const scrollbarBounds = this.getScrollbarBounds();
            const thumbBounds = this.getScrollbarThumbBounds();
            const maxThumbY = scrollbarBounds.height - thumbBounds.height;
            const maxScrollTop = this.getMaxScrollTop();
            
            if (maxThumbY > 0) {
                const deltaY = y - this._scrollbarDragStartY;
                const scrollDelta = (deltaY / maxThumbY) * maxScrollTop;
                this._scrollTop = this._scrollbarDragStartScrollTop + scrollDelta;
                this.clampScrollTop();
            }
            return true;
        }
        
        // Hover на скроллбаре
        if (this.needsScrollbar()) {
            const thumbBounds = this.getScrollbarThumbBounds();
            const wasHovered = this._scrollbarHovered;
            this._scrollbarHovered = thumbBounds.contains(x, y);
            if (wasHovered !== this._scrollbarHovered) {
                return true;
            }
        }
        
        // Hover на элементе
        const contentArea = this.getContentArea();
        if (contentArea.contains(x, y)) {
            const newHovered = this.getItemIndexAtPoint(x, y);
            if (newHovered !== this._hoveredIndex) {
                this._hoveredIndex = newHovered;
                return true;
            }
        } else if (this._hoveredIndex !== -1) {
            this._hoveredIndex = -1;
            return true;
        }
        
        return false;
    }
    
    onMouseLeave(): void {
        this._hoveredIndex = -1;
        this._scrollbarHovered = false;
        this._scrollbarDragging = false;
    }
    
    onDoubleClick(x: number, y: number): boolean {
        const itemIndex = this.getItemIndexAtPoint(x, y);
        if (itemIndex >= 0 && !this._items[itemIndex].disabled) {
            const item = this._items[itemIndex];
            for (const listener of this._doubleClickListeners) {
                listener(this, item);
            }
            return true;
        }
        return false;
    }
    
    onMouseWheel(x: number, y: number, deltaY: number): boolean {
        if (!this._bounds.contains(x, y)) return false;
        
        this._scrollTop += deltaY > 0 ? this._itemHeight * 3 : -this._itemHeight * 3;
        this.clampScrollTop();
        return true;
    }
    
    onKeyDown(key: string, ctrlKey: boolean, shiftKey: boolean): boolean {
        if (!this._enabled || !this._focused) return false;
        
        switch (key) {
            case 'ArrowUp':
                this.moveFocus(-1, shiftKey);
                return true;
                
            case 'ArrowDown':
                this.moveFocus(1, shiftKey);
                return true;
                
            case 'PageUp':
                this.moveFocus(-Math.floor(this.getContentArea().height / this._itemHeight), shiftKey);
                return true;
                
            case 'PageDown':
                this.moveFocus(Math.floor(this.getContentArea().height / this._itemHeight), shiftKey);
                return true;
                
            case 'Home':
                this.moveFocusTo(0, shiftKey);
                return true;
                
            case 'End':
                this.moveFocusTo(this._items.length - 1, shiftKey);
                return true;
                
            case ' ':
            case 'Enter':
                if (this._focusedIndex >= 0) {
                    this.toggleSelection(this._focusedIndex);
                }
                return true;
                
            case 'a':
            case 'A':
                if (ctrlKey && this._selectionMode === ListSelectionMode.Multi) {
                    this.selectAll();
                    return true;
                }
                break;
                
            default:
                // Быстрый поиск по первым буквам
                if (key.length === 1 && !ctrlKey) {
                    this.handleFastSearch(key);
                    return true;
                }
        }
        
        return false;
    }
    
    onFocus(): void {
        this._focused = true;
        if (this._focusedIndex < 0 && this._items.length > 0) {
            this._focusedIndex = 0;
        }
    }
    
    onBlur(): void {
        this._focused = false;
        this.resetFastSearch();
    }
    
    // Приватные методы
    
    private handleItemClick(index: number, isLeftButton: boolean, ctrlKey: boolean, shiftKey: boolean): void {
        if (this._selectionMode === ListSelectionMode.None) return;
        
        if (this._selectionMode === ListSelectionMode.Multi) {
            if (shiftKey && this._shiftAnchorIndex >= 0) {
                // Выбор диапазона
                this._selection.clear();
                const start = Math.min(this._shiftAnchorIndex, index);
                const end = Math.max(this._shiftAnchorIndex, index);
                for (let i = start; i <= end; i++) {
                    if (!this._items[i].disabled) {
                        this._selection.add(i);
                    }
                }
            } else if (ctrlKey) {
                // Toggle
                if (this._selection.has(index)) {
                    this._selection.delete(index);
                } else {
                    this._selection.add(index);
                }
                this._shiftAnchorIndex = index;
            } else {
                // Обычный клик
                this._selection.clear();
                this._selection.add(index);
                this._shiftAnchorIndex = index;
            }
        } else {
            // Single selection
            this._selection.clear();
            this._selection.add(index);
        }
        
        this._focusedIndex = index;
        this.fireSelectionChanged();
    }
    
    private moveFocus(delta: number, extendSelection: boolean): void {
        if (this._items.length === 0) return;
        
        let newIndex = this._focusedIndex + delta;
        newIndex = Math.max(0, Math.min(this._items.length - 1, newIndex));
        
        // Пропускаем disabled
        while (newIndex >= 0 && newIndex < this._items.length && this._items[newIndex].disabled) {
            newIndex += delta > 0 ? 1 : -1;
        }
        
        if (newIndex < 0 || newIndex >= this._items.length) return;
        
        this.moveFocusTo(newIndex, extendSelection);
    }
    
    private moveFocusTo(index: number, extendSelection: boolean): void {
        if (index < 0 || index >= this._items.length) return;
        if (this._items[index].disabled) return;
        
        if (extendSelection && this._selectionMode === ListSelectionMode.Multi) {
            if (this._shiftAnchorIndex < 0) {
                this._shiftAnchorIndex = this._focusedIndex >= 0 ? this._focusedIndex : index;
            }
            
            this._selection.clear();
            const start = Math.min(this._shiftAnchorIndex, index);
            const end = Math.max(this._shiftAnchorIndex, index);
            for (let i = start; i <= end; i++) {
                if (!this._items[i].disabled) {
                    this._selection.add(i);
                }
            }
        } else {
            this._selection.clear();
            this._selection.add(index);
            this._shiftAnchorIndex = index;
        }
        
        this._focusedIndex = index;
        this.ensureVisible(index);
        this.fireSelectionChanged();
    }
    
    private handleFastSearch(char: string): void {
        // Добавляем символ к строке поиска
        this._fastSearchString += char.toLowerCase();
        
        // Ищем элемент
        const startIndex = this._focusedIndex >= 0 ? this._focusedIndex + 1 : 0;
        let found = -1;
        
        // Сначала ищем после текущего
        for (let i = startIndex; i < this._items.length; i++) {
            if (!this._items[i].disabled && 
                this._items[i].text.toLowerCase().startsWith(this._fastSearchString)) {
                found = i;
                break;
            }
        }
        
        // Если не нашли - ищем сначала
        if (found < 0) {
            for (let i = 0; i < startIndex; i++) {
                if (!this._items[i].disabled && 
                    this._items[i].text.toLowerCase().startsWith(this._fastSearchString)) {
                    found = i;
                    break;
                }
            }
        }
        
        if (found >= 0) {
            this.selectItem(found);
        }
        
        // Сбрасываем таймер
        this.resetFastSearchTimer();
        this._fastSearchTimer = window.setTimeout(() => {
            this.resetFastSearch();
        }, this._fastSearchDelay);
    }
    
    private resetFastSearch(): void {
        this._fastSearchString = '';
        this.resetFastSearchTimer();
    }
    
    private resetFastSearchTimer(): void {
        if (this._fastSearchTimer !== null) {
            window.clearTimeout(this._fastSearchTimer);
            this._fastSearchTimer = null;
        }
    }
    
    private fireSelectionChanged(): void {
        const selectedItems = this.selectedItems;
        for (const listener of this._selectionChangedListeners) {
            listener(this, selectedItems);
        }
    }
    
    private getContentArea(): Rectangle {
        const scrollbarWidth = this.needsScrollbar() ? this._scrollbarWidth : 0;
        return new Rectangle(
            this._bounds.x + 1,
            this._bounds.y + 1,
            this._bounds.width - 2 - scrollbarWidth,
            this._bounds.height - 2
        );
    }
    
    private getScrollbarBounds(): Rectangle {
        return new Rectangle(
            this._bounds.x + this._bounds.width - this._scrollbarWidth - 1,
            this._bounds.y + 1,
            this._scrollbarWidth,
            this._bounds.height - 2
        );
    }
    
    private getScrollbarThumbBounds(): Rectangle {
        const scrollbarBounds = this.getScrollbarBounds();
        const contentArea = this.getContentArea();
        const totalHeight = this._items.length * this._itemHeight;
        
        if (totalHeight <= contentArea.height) {
            return scrollbarBounds;
        }
        
        const thumbHeight = Math.max(20, (contentArea.height / totalHeight) * scrollbarBounds.height);
        const maxScrollTop = this.getMaxScrollTop();
        const thumbY = maxScrollTop > 0 ? 
            (this._scrollTop / maxScrollTop) * (scrollbarBounds.height - thumbHeight) : 0;
        
        return new Rectangle(
            scrollbarBounds.x + 2,
            scrollbarBounds.y + thumbY,
            scrollbarBounds.width - 4,
            thumbHeight
        );
    }
    
    private needsScrollbar(): boolean {
        const contentArea = this.getContentArea();
        return this._items.length * this._itemHeight > contentArea.height;
    }
    
    private getMaxScrollTop(): number {
        const contentArea = this.getContentArea();
        return Math.max(0, this._items.length * this._itemHeight - contentArea.height);
    }
    
    private clampScrollTop(): void {
        this._scrollTop = Math.max(0, Math.min(this.getMaxScrollTop(), this._scrollTop));
    }
    
    private getItemIndexAtPoint(x: number, y: number): number {
        const contentArea = this.getContentArea();
        if (!contentArea.contains(x, y)) return -1;
        
        const localY = y - contentArea.y + this._scrollTop;
        const index = Math.floor(localY / this._itemHeight);
        
        return index >= 0 && index < this._items.length ? index : -1;
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
 * Хелпер для создания элемента списка
 */
export function createListItem<T>(value: T, text: string, options?: Partial<IListItem<T>>): IListItem<T> {
    return {
        value,
        text,
        ...options
    };
}

/**
 * Хелпер для создания списка из массива строк
 */
export function createListFromStrings(strings: string[]): ListControl<string> {
    const list = new ListControl<string>();
    list.items = strings.map(s => createListItem(s, s));
    return list;
}
