/**
 * ImageComboControl - комбо-бокс с иконками
 * Порт com._1c.g5.lwt.controls.LightImageCombo
 */

import { LightControl } from '../core/LightControl';
import { Point } from '../geometry/Point';
import { Rectangle } from '../geometry/Rectangle';
import { Color, ITheme, getTheme } from '../theme';

/**
 * Элемент комбо-бокса с изображением
 */
export interface IImageComboItem<T = unknown> {
    /** Значение */
    value: T;
    /** Отображаемый текст */
    text: string;
    /** URL иконки */
    icon?: string;
    /** Загруженное изображение (внутреннее использование) */
    _iconImage?: HTMLImageElement;
    /** Иконка загружена */
    _iconLoaded?: boolean;
    /** Отключён */
    disabled?: boolean;
    /** Tooltip */
    tooltip?: string;
    /** Дополнительный текст (справа) */
    description?: string;
}

/**
 * Слушатель выбора
 */
export type ImageComboSelectionListener<T = unknown> = (combo: ImageComboControl<T>, item: IImageComboItem<T> | null, index: number) => void;

/**
 * Комбо-бокс с иконками
 */
export class ImageComboControl<T = unknown> extends LightControl {
    // Элементы
    private _items: IImageComboItem<T>[] = [];
    private _selectedIndex: number = -1;
    
    // Размеры иконок
    private _iconSize: number = 16;
    private _iconMargin: number = 4;
    
    // Текст
    private _grayed: boolean = false;
    private _placeholder: string = '';
    
    // Dropdown
    private _dropdownOpen: boolean = false;
    private _dropdownHoveredIndex: number = -1;
    private _dropdownScrollTop: number = 0;
    private _dropdownMaxVisibleItems: number = 7;
    private _dropdownItemHeight: number = 24;
    
    // Внешний вид
    private _showBorder: boolean = true;
    private _borderRadius: number = 2;
    private _padding: number = 4;
    private _buttonWidth: number = 20;
    
    // Состояние
    // Примечание: _enabled наследуется от LightControl
    private _editable: boolean = true;
    private _focused: boolean = false;
    private _hovered: boolean = false;
    private _buttonHovered: boolean = false;
    private _buttonPressed: boolean = false;
    
    // Цвета
    private _borderColor: Color | null = null;
    private _backgroundColor: Color | null = null;
    private _selectedColor: Color | null = null;
    
    // Scrollbar в dropdown
    private _scrollbarWidth: number = 10;
    private _scrollbarDragging: boolean = false;
    private _scrollbarDragStartY: number = 0;
    private _scrollbarDragStartScrollTop: number = 0;
    
    // События
    private _selectionListeners: ImageComboSelectionListener<T>[] = [];
    
    constructor() {
        super();
    }
    
    // Геттеры и сеттеры
    
    get items(): IImageComboItem<T>[] {
        return this._items;
    }
    
    set items(val: IImageComboItem<T>[]) {
        this._items = val;
        this._selectedIndex = -1;
        this._dropdownScrollTop = 0;
        
        // Загружаем иконки
        for (const item of val) {
            if (item.icon && !item._iconImage) {
                this.loadItemIcon(item);
            }
        }
    }
    
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    
    set selectedIndex(val: number) {
        if (val >= -1 && val < this._items.length) {
            const oldIndex = this._selectedIndex;
            this._selectedIndex = val;
            
            if (oldIndex !== val) {
                this.fireSelectionChanged();
            }
        }
    }
    
    get selectedItem(): IImageComboItem<T> | null {
        return this._selectedIndex >= 0 ? this._items[this._selectedIndex] : null;
    }
    
    get selectedValue(): T | null {
        return this.selectedItem?.value ?? null;
    }
    
    get text(): string {
        return this.selectedItem?.text ?? '';
    }
    
    get iconSize(): number {
        return this._iconSize;
    }
    
    set iconSize(val: number) {
        this._iconSize = val;
    }
    
    get grayed(): boolean {
        return this._grayed;
    }
    
    set grayed(val: boolean) {
        this._grayed = val;
    }
    
    get placeholder(): string {
        return this._placeholder;
    }
    
    set placeholder(val: string) {
        this._placeholder = val;
    }
    
    get editable(): boolean {
        return this._editable;
    }
    
    set editable(val: boolean) {
        this._editable = val;
    }
    
    get isOpen(): boolean {
        return this._dropdownOpen;
    }
    
    // Публичные методы
    
    addItem(item: IImageComboItem<T>): void {
        this._items.push(item);
        if (item.icon) {
            this.loadItemIcon(item);
        }
    }
    
    removeItem(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            if (this._selectedIndex === index) {
                this._selectedIndex = -1;
            } else if (this._selectedIndex > index) {
                this._selectedIndex--;
            }
        }
    }
    
    clearItems(): void {
        this._items = [];
        this._selectedIndex = -1;
    }
    
    selectByValue(value: T): boolean {
        const index = this._items.findIndex(item => item.value === value);
        if (index >= 0) {
            this.selectedIndex = index;
            return true;
        }
        return false;
    }
    
    openDropdown(): void {
        if (!this._editable || !this._enabled) return;
        this._dropdownOpen = true;
        this._dropdownHoveredIndex = this._selectedIndex;
        this.ensureSelectedVisible();
    }
    
    closeDropdown(): void {
        this._dropdownOpen = false;
        this._dropdownHoveredIndex = -1;
    }
    
    toggleDropdown(): void {
        if (this._dropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }
    
    // Слушатели
    
    addSelectionListener(listener: ImageComboSelectionListener<T>): void {
        this._selectionListeners.push(listener);
    }
    
    removeSelectionListener(listener: ImageComboSelectionListener<T>): void {
        const index = this._selectionListeners.indexOf(listener);
        if (index >= 0) {
            this._selectionListeners.splice(index, 1);
        }
    }
    
    // Вычисление размера
    
    computeSize(ctx: CanvasRenderingContext2D, widthHint: number, heightHint: number): Point {
        const theme = getTheme();
        ctx.font = theme.defaultFont.toCss();
        
        let maxWidth = 100;
        for (const item of this._items) {
            const textWidth = ctx.measureText(item.text).width;
            const itemWidth = this._iconSize + this._iconMargin + textWidth + this._padding * 2 + this._buttonWidth;
            maxWidth = Math.max(maxWidth, itemWidth);
        }
        
        const width = widthHint !== -1 ? widthHint : maxWidth;
        const height = heightHint !== -1 ? heightHint : Math.max(24, this._iconSize + this._padding * 2);
        
        return new Point(width, height);
    }
    
    // Отрисовка
    
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this._visible || !this._bounds.intersects(clip)) return;
        
        const theme = getTheme();
        const bounds = this._bounds;
        
        // Фон
        const bgColor = this._backgroundColor ?? 
            (this._enabled && this._editable ? theme.inputBackground : theme.controlBackground);
        ctx.fillStyle = bgColor.toCss();
        
        if (this._borderRadius > 0) {
            this.drawRoundedRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, this._borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        
        // Рамка
        if (this._showBorder) {
            let borderColor = this._borderColor ?? theme.inputBorder;
            if (!this._enabled) {
                borderColor = borderColor.withAlpha(0.5);
            } else if (this._focused || this._dropdownOpen) {
                borderColor = theme.inputBorderActive;
            } else if (this._hovered) {
                borderColor = borderColor.darker(0.1);
            }
            
            ctx.strokeStyle = borderColor.toCss();
            ctx.lineWidth = 1;
            
            if (this._borderRadius > 0) {
                this.drawRoundedRect(ctx, bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1, this._borderRadius);
                ctx.stroke();
            } else {
                ctx.strokeRect(bounds.x + 0.5, bounds.y + 0.5, bounds.width - 1, bounds.height - 1);
            }
        }
        
        // Контент (иконка + текст)
        this.paintContent(ctx, theme);
        
        // Кнопка раскрытия
        this.paintButton(ctx, theme);
        
        // Dropdown
        if (this._dropdownOpen) {
            this.paintDropdown(ctx, theme);
        }
    }
    
    private paintContent(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const bounds = this._bounds;
        const item = this.selectedItem;
        
        let x = bounds.x + this._padding;
        const contentWidth = bounds.width - this._padding * 2 - this._buttonWidth;
        
        // Clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(bounds.x + 1, bounds.y + 1, contentWidth, bounds.height - 2);
        ctx.clip();
        
        // Иконка
        if (item?._iconImage && item._iconLoaded) {
            const iconY = bounds.y + (bounds.height - this._iconSize) / 2;
            
            if (!this._enabled) {
                ctx.globalAlpha = 0.5;
            }
            
            ctx.drawImage(item._iconImage, x, iconY, this._iconSize, this._iconSize);
            ctx.globalAlpha = 1.0;
            x += this._iconSize + this._iconMargin;
        } else if (item?.icon) {
            // Placeholder для иконки
            const iconY = bounds.y + (bounds.height - this._iconSize) / 2;
            ctx.fillStyle = theme.disabledForeground.toCss();
            ctx.fillRect(x, iconY, this._iconSize, this._iconSize);
            x += this._iconSize + this._iconMargin;
        }
        
        // Текст
        ctx.font = theme.defaultFont.toCss();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        
        const textY = bounds.y + bounds.height / 2;
        
        if (item) {
            if (this._grayed || !this._enabled) {
                ctx.fillStyle = theme.disabledForeground.toCss();
            } else {
                ctx.fillStyle = theme.inputForeground.toCss();
            }
            ctx.fillText(item.text, x, textY);
        } else if (this._placeholder) {
            ctx.fillStyle = theme.placeholderForeground.toCss();
            ctx.fillText(this._placeholder, x, textY);
        }
        
        ctx.restore();
    }
    
    private paintButton(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const bounds = this._bounds;
        const buttonX = bounds.x + bounds.width - this._buttonWidth;
        
        // Фон кнопки при наведении
        if (this._buttonHovered && this._enabled && this._editable) {
            ctx.fillStyle = theme.controlHoverBackground?.toCss() ?? 'rgba(0,0,0,0.05)';
            ctx.fillRect(buttonX, bounds.y + 1, this._buttonWidth - 1, bounds.height - 2);
        }
        
        // Разделитель
        ctx.strokeStyle = theme.border.withAlpha(0.5).toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(buttonX, bounds.y + 4);
        ctx.lineTo(buttonX, bounds.y + bounds.height - 4);
        ctx.stroke();
        
        // Стрелка
        const arrowSize = 4;
        const arrowX = buttonX + this._buttonWidth / 2;
        const arrowY = bounds.y + bounds.height / 2;
        
        ctx.fillStyle = this._enabled ? 
            theme.foreground.toCss() : 
            theme.disabledForeground.toCss();
        
        ctx.beginPath();
        if (this._dropdownOpen) {
            // Стрелка вверх
            ctx.moveTo(arrowX, arrowY - arrowSize / 2);
            ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize / 2);
            ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize / 2);
        } else {
            // Стрелка вниз
            ctx.moveTo(arrowX, arrowY + arrowSize / 2);
            ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize / 2);
            ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize / 2);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    private paintDropdown(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const dropdownBounds = this.getDropdownBounds();
        
        // Тень
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        
        // Фон
        ctx.fillStyle = theme.inputBackground.toCss();
        ctx.fillRect(dropdownBounds.x, dropdownBounds.y, dropdownBounds.width, dropdownBounds.height);
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Рамка
        ctx.strokeStyle = theme.border.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(dropdownBounds.x + 0.5, dropdownBounds.y + 0.5, dropdownBounds.width - 1, dropdownBounds.height - 1);
        
        // Clipping для элементов
        ctx.save();
        const contentWidth = this.needsDropdownScrollbar() ? 
            dropdownBounds.width - this._scrollbarWidth : dropdownBounds.width;
        ctx.beginPath();
        ctx.rect(dropdownBounds.x + 1, dropdownBounds.y + 1, contentWidth - 2, dropdownBounds.height - 2);
        ctx.clip();
        
        // Элементы
        const firstVisible = Math.floor(this._dropdownScrollTop / this._dropdownItemHeight);
        const lastVisible = Math.min(
            this._items.length - 1,
            Math.ceil((this._dropdownScrollTop + dropdownBounds.height) / this._dropdownItemHeight)
        );
        
        for (let i = firstVisible; i <= lastVisible; i++) {
            this.paintDropdownItem(ctx, theme, dropdownBounds, i);
        }
        
        ctx.restore();
        
        // Скроллбар
        if (this.needsDropdownScrollbar()) {
            this.paintDropdownScrollbar(ctx, theme, dropdownBounds);
        }
    }
    
    private paintDropdownItem(ctx: CanvasRenderingContext2D, theme: ITheme, dropdownBounds: Rectangle, index: number): void {
        const item = this._items[index];
        const y = dropdownBounds.y + index * this._dropdownItemHeight - this._dropdownScrollTop;
        const itemBounds = new Rectangle(
            dropdownBounds.x + 1,
            y,
            dropdownBounds.width - 2 - (this.needsDropdownScrollbar() ? this._scrollbarWidth : 0),
            this._dropdownItemHeight
        );
        
        // Фон
        if (index === this._selectedIndex) {
            ctx.fillStyle = (this._selectedColor ?? theme.selectionBackground).toCss();
            ctx.fillRect(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
        } else if (index === this._dropdownHoveredIndex) {
            ctx.fillStyle = theme.selectionBackground.withAlpha(0.3).toCss();
            ctx.fillRect(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
        }
        
        let x = itemBounds.x + this._padding;
        
        // Иконка
        if (item._iconImage && item._iconLoaded) {
            const iconY = itemBounds.y + (this._dropdownItemHeight - this._iconSize) / 2;
            
            if (item.disabled) {
                ctx.globalAlpha = 0.5;
            }
            
            ctx.drawImage(item._iconImage, x, iconY, this._iconSize, this._iconSize);
            ctx.globalAlpha = 1.0;
            x += this._iconSize + this._iconMargin;
        } else if (item.icon) {
            x += this._iconSize + this._iconMargin;
        }
        
        // Текст
        ctx.font = theme.defaultFont.toCss();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        
        if (item.disabled) {
            ctx.fillStyle = theme.disabledForeground.toCss();
        } else if (index === this._selectedIndex) {
            ctx.fillStyle = theme.tableSelectionForeground?.toCss() ?? theme.foreground.toCss();
        } else {
            ctx.fillStyle = theme.foreground.toCss();
        }
        
        ctx.fillText(item.text, x, itemBounds.y + this._dropdownItemHeight / 2);
        
        // Описание справа
        if (item.description) {
            ctx.fillStyle = theme.disabledForeground.toCss();
            ctx.textAlign = 'right';
            ctx.fillText(item.description, itemBounds.x + itemBounds.width - this._padding, itemBounds.y + this._dropdownItemHeight / 2);
        }
    }
    
    private paintDropdownScrollbar(ctx: CanvasRenderingContext2D, theme: ITheme, dropdownBounds: Rectangle): void {
        const scrollbarBounds = this.getDropdownScrollbarBounds(dropdownBounds);
        const thumbBounds = this.getDropdownScrollbarThumbBounds(dropdownBounds);
        
        // Трек
        ctx.fillStyle = theme.scrollbarTrack.toCss();
        ctx.fillRect(scrollbarBounds.x, scrollbarBounds.y, scrollbarBounds.width, scrollbarBounds.height);
        
        // Thumb
        ctx.fillStyle = this._scrollbarDragging ? 
            theme.scrollbarThumbActive.toCss() : 
            theme.scrollbarThumb.toCss();
        ctx.fillRect(thumbBounds.x + 2, thumbBounds.y, thumbBounds.width - 4, thumbBounds.height);
    }
    
    // Обработка событий
    
    onMouseDown(x: number, y: number, button: number): boolean {
        if (!this._enabled || !this._editable) return false;
        
        // Проверяем клик в dropdown
        if (this._dropdownOpen) {
            const dropdownBounds = this.getDropdownBounds();
            
            // Скроллбар
            if (this.needsDropdownScrollbar()) {
                const thumbBounds = this.getDropdownScrollbarThumbBounds(dropdownBounds);
                if (thumbBounds.contains(x, y)) {
                    this._scrollbarDragging = true;
                    this._scrollbarDragStartY = y;
                    this._scrollbarDragStartScrollTop = this._dropdownScrollTop;
                    return true;
                }
            }
            
            // Элемент
            if (dropdownBounds.contains(x, y)) {
                const index = this.getDropdownItemAtPoint(x, y);
                if (index >= 0 && !this._items[index].disabled) {
                    this._selectedIndex = index;
                    this.closeDropdown();
                    this.fireSelectionChanged();
                }
                return true;
            }
            
            // Клик вне dropdown - закрываем
            this.closeDropdown();
        }
        
        // Клик по контролу - открываем/закрываем
        if (this._bounds.contains(x, y)) {
            this.toggleDropdown();
            return true;
        }
        
        return false;
    }
    
    onMouseUp(x: number, y: number, button: number): boolean {
        this._scrollbarDragging = false;
        this._buttonPressed = false;
        return true;
    }
    
    onMouseMove(x: number, y: number): boolean {
        let needsRepaint = false;
        
        // Drag скроллбара
        if (this._scrollbarDragging) {
            const dropdownBounds = this.getDropdownBounds();
            const scrollbarBounds = this.getDropdownScrollbarBounds(dropdownBounds);
            const thumbHeight = this.getDropdownScrollbarThumbHeight(dropdownBounds);
            const maxThumbY = scrollbarBounds.height - thumbHeight;
            const maxScrollTop = this.getMaxDropdownScrollTop();
            
            if (maxThumbY > 0) {
                const deltaY = y - this._scrollbarDragStartY;
                const scrollDelta = (deltaY / maxThumbY) * maxScrollTop;
                this._dropdownScrollTop = Math.max(0, Math.min(maxScrollTop, this._scrollbarDragStartScrollTop + scrollDelta));
                needsRepaint = true;
            }
            return needsRepaint;
        }
        
        // Hover в dropdown
        if (this._dropdownOpen) {
            const dropdownBounds = this.getDropdownBounds();
            if (dropdownBounds.contains(x, y)) {
                const newHovered = this.getDropdownItemAtPoint(x, y);
                if (newHovered !== this._dropdownHoveredIndex) {
                    this._dropdownHoveredIndex = newHovered;
                    needsRepaint = true;
                }
            }
        }
        
        // Hover на контроле
        const wasHovered = this._hovered;
        const wasButtonHovered = this._buttonHovered;
        
        this._hovered = this._bounds.contains(x, y);
        
        if (this._hovered) {
            const buttonX = this._bounds.x + this._bounds.width - this._buttonWidth;
            this._buttonHovered = x >= buttonX;
        } else {
            this._buttonHovered = false;
        }
        
        if (wasHovered !== this._hovered || wasButtonHovered !== this._buttonHovered) {
            needsRepaint = true;
        }
        
        return needsRepaint;
    }
    
    onMouseLeave(): void {
        this._hovered = false;
        this._buttonHovered = false;
    }
    
    onMouseWheel(x: number, y: number, deltaY: number): boolean {
        if (this._dropdownOpen) {
            const dropdownBounds = this.getDropdownBounds();
            if (dropdownBounds.contains(x, y)) {
                this._dropdownScrollTop += deltaY > 0 ? this._dropdownItemHeight * 2 : -this._dropdownItemHeight * 2;
                this._dropdownScrollTop = Math.max(0, Math.min(this.getMaxDropdownScrollTop(), this._dropdownScrollTop));
                return true;
            }
        }
        return false;
    }
    
    onKeyDown(key: string, ctrlKey: boolean, shiftKey: boolean): boolean {
        if (!this._enabled || !this._editable || !this._focused) return false;
        
        switch (key) {
            case ' ':
            case 'Enter':
                if (this._dropdownOpen) {
                    if (this._dropdownHoveredIndex >= 0) {
                        this._selectedIndex = this._dropdownHoveredIndex;
                        this.fireSelectionChanged();
                    }
                    this.closeDropdown();
                } else {
                    this.openDropdown();
                }
                return true;
                
            case 'Escape':
                if (this._dropdownOpen) {
                    this.closeDropdown();
                    return true;
                }
                break;
                
            case 'ArrowUp':
                if (this._dropdownOpen) {
                    this._dropdownHoveredIndex = Math.max(0, this._dropdownHoveredIndex - 1);
                    this.ensureDropdownItemVisible(this._dropdownHoveredIndex);
                } else {
                    this.selectPrevious();
                }
                return true;
                
            case 'ArrowDown':
                if (this._dropdownOpen) {
                    this._dropdownHoveredIndex = Math.min(this._items.length - 1, this._dropdownHoveredIndex + 1);
                    this.ensureDropdownItemVisible(this._dropdownHoveredIndex);
                } else {
                    this.selectNext();
                }
                return true;
                
            case 'Home':
                if (this._dropdownOpen) {
                    this._dropdownHoveredIndex = 0;
                    this._dropdownScrollTop = 0;
                } else {
                    this.selectedIndex = 0;
                }
                return true;
                
            case 'End':
                if (this._dropdownOpen) {
                    this._dropdownHoveredIndex = this._items.length - 1;
                    this._dropdownScrollTop = this.getMaxDropdownScrollTop();
                } else {
                    this.selectedIndex = this._items.length - 1;
                }
                return true;
        }
        
        return false;
    }
    
    onFocus(): void {
        this._focused = true;
    }
    
    onBlur(): void {
        this._focused = false;
        this.closeDropdown();
    }
    
    // Приватные методы
    
    private loadItemIcon(item: IImageComboItem<T>): void {
        if (!item.icon) return;
        
        const img = new Image();
        img.onload = () => {
            item._iconImage = img;
            item._iconLoaded = true;
            this.invalidate();
        };
        img.onerror = () => {
            item._iconLoaded = false;
        };
        img.src = item.icon;
    }
    
    private selectPrevious(): void {
        if (this._items.length === 0) return;
        
        let newIndex = this._selectedIndex - 1;
        while (newIndex >= 0 && this._items[newIndex].disabled) {
            newIndex--;
        }
        
        if (newIndex >= 0) {
            this.selectedIndex = newIndex;
        }
    }
    
    private selectNext(): void {
        if (this._items.length === 0) return;
        
        let newIndex = this._selectedIndex + 1;
        while (newIndex < this._items.length && this._items[newIndex].disabled) {
            newIndex++;
        }
        
        if (newIndex < this._items.length) {
            this.selectedIndex = newIndex;
        }
    }
    
    private ensureSelectedVisible(): void {
        if (this._selectedIndex >= 0) {
            this.ensureDropdownItemVisible(this._selectedIndex);
        }
    }
    
    private ensureDropdownItemVisible(index: number): void {
        if (index < 0) return;
        
        const dropdownBounds = this.getDropdownBounds();
        const itemTop = index * this._dropdownItemHeight;
        const itemBottom = itemTop + this._dropdownItemHeight;
        
        if (itemTop < this._dropdownScrollTop) {
            this._dropdownScrollTop = itemTop;
        } else if (itemBottom > this._dropdownScrollTop + dropdownBounds.height) {
            this._dropdownScrollTop = itemBottom - dropdownBounds.height;
        }
    }
    
    private fireSelectionChanged(): void {
        const item = this.selectedItem;
        for (const listener of this._selectionListeners) {
            listener(this, item, this._selectedIndex);
        }
    }
    
    private getDropdownBounds(): Rectangle {
        const visibleItems = Math.min(this._items.length, this._dropdownMaxVisibleItems);
        const height = visibleItems * this._dropdownItemHeight + 2;
        
        return new Rectangle(
            this._bounds.x,
            this._bounds.y + this._bounds.height,
            this._bounds.width,
            height
        );
    }
    
    private getDropdownItemAtPoint(x: number, y: number): number {
        const dropdownBounds = this.getDropdownBounds();
        const localY = y - dropdownBounds.y + this._dropdownScrollTop;
        const index = Math.floor(localY / this._dropdownItemHeight);
        
        return index >= 0 && index < this._items.length ? index : -1;
    }
    
    private needsDropdownScrollbar(): boolean {
        return this._items.length > this._dropdownMaxVisibleItems;
    }
    
    private getMaxDropdownScrollTop(): number {
        const dropdownBounds = this.getDropdownBounds();
        return Math.max(0, this._items.length * this._dropdownItemHeight - dropdownBounds.height + 2);
    }
    
    private getDropdownScrollbarBounds(dropdownBounds: Rectangle): Rectangle {
        return new Rectangle(
            dropdownBounds.x + dropdownBounds.width - this._scrollbarWidth - 1,
            dropdownBounds.y + 1,
            this._scrollbarWidth,
            dropdownBounds.height - 2
        );
    }
    
    private getDropdownScrollbarThumbHeight(dropdownBounds: Rectangle): number {
        const totalHeight = this._items.length * this._dropdownItemHeight;
        const visibleRatio = dropdownBounds.height / totalHeight;
        return Math.max(20, visibleRatio * (dropdownBounds.height - 2));
    }
    
    private getDropdownScrollbarThumbBounds(dropdownBounds: Rectangle): Rectangle {
        const scrollbarBounds = this.getDropdownScrollbarBounds(dropdownBounds);
        const thumbHeight = this.getDropdownScrollbarThumbHeight(dropdownBounds);
        const maxScrollTop = this.getMaxDropdownScrollTop();
        const thumbY = maxScrollTop > 0 ? 
            (this._dropdownScrollTop / maxScrollTop) * (scrollbarBounds.height - thumbHeight) : 0;
        
        return new Rectangle(
            scrollbarBounds.x,
            scrollbarBounds.y + thumbY,
            scrollbarBounds.width,
            thumbHeight
        );
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
 * Хелпер для создания элемента ImageCombo
 */
export function createImageComboItem<T>(value: T, text: string, icon?: string, options?: Partial<IImageComboItem<T>>): IImageComboItem<T> {
    return {
        value,
        text,
        icon,
        ...options
    };
}
