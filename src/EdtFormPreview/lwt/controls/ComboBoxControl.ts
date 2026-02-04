/**
 * Контрол ComboBox - выпадающий список
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.ComboboxControl
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Элемент списка
 */
export interface IComboItem {
    /** Значение (ключ) */
    value: string | number;
    /** Отображаемый текст */
    text: string;
    /** Иконка (опционально) */
    icon?: string;
    /** Отключен */
    disabled?: boolean;
}

/**
 * Создать элемент списка
 */
export function createComboItem(value: string | number, text: string, options?: Partial<IComboItem>): IComboItem {
    return {
        value,
        text,
        disabled: false,
        ...options
    };
}

/**
 * Режим отображения
 */
export enum ComboBoxMode {
    /** Только выбор из списка */
    DropDownList = 'dropdown-list',
    /** Редактируемый с выпадающим списком */
    DropDown = 'dropdown'
}

// ============================================================================
// КОНТРОЛ COMBOBOX
// ============================================================================

/**
 * ComboBox контрол
 */
export class ComboBoxControl extends LightControl {
    // Данные
    private _items: IComboItem[] = [];
    private _selectedIndex: number = -1;
    private _text: string = '';
    
    // Настройки
    private _mode: ComboBoxMode = ComboBoxMode.DropDownList;
    private _placeholder: string = '';
    private _buttonWidth: number = 20;
    private _maxDropDownHeight: number = 200;
    private _itemHeight: number = 24;
    
    // Состояние
    private _isOpen: boolean = false;
    private _isHovered: boolean = false;
    private _isButtonHovered: boolean = false;
    private _isButtonPressed: boolean = false;
    private _hoveredIndex: number = -1;
    private _scrollTop: number = 0;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Элементы списка */
    get items(): IComboItem[] {
        return this._items;
    }

    set items(value: IComboItem[]) {
        this._items = value;
        if (this._selectedIndex >= value.length) {
            this._selectedIndex = -1;
        }
        this.invalidate();
    }

    /** Индекс выбранного элемента */
    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value: number) {
        if (value >= -1 && value < this._items.length) {
            this._selectedIndex = value;
            this._text = value >= 0 ? this._items[value].text : '';
            this.invalidate();
        }
    }

    /** Выбранный элемент */
    get selectedItem(): IComboItem | null {
        return this._selectedIndex >= 0 ? this._items[this._selectedIndex] : null;
    }

    /** Значение выбранного элемента */
    get selectedValue(): string | number | null {
        return this.selectedItem?.value ?? null;
    }

    set selectedValue(value: string | number | null) {
        if (value === null) {
            this._selectedIndex = -1;
            this._text = '';
        } else {
            const index = this._items.findIndex(item => item.value === value);
            if (index >= 0) {
                this._selectedIndex = index;
                this._text = this._items[index].text;
            }
        }
        this.invalidate();
    }

    /** Текст в поле ввода */
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        if (this._mode === ComboBoxMode.DropDownList) {
            // В режиме DropDownList текст должен соответствовать элементу
            const index = this._items.findIndex(item => item.text === value);
            this._selectedIndex = index;
        }
        this.invalidate();
    }

    /** Режим */
    get mode(): ComboBoxMode {
        return this._mode;
    }

    set mode(value: ComboBoxMode) {
        this._mode = value;
        this.invalidate();
    }

    /** Плейсхолдер */
    get placeholder(): string {
        return this._placeholder;
    }

    set placeholder(value: string) {
        this._placeholder = value;
        this.invalidate();
    }

    /** Список открыт */
    get isOpen(): boolean {
        return this._isOpen;
    }

    // ========================================================================
    // МЕТОДЫ
    // ========================================================================

    /**
     * Добавить элемент
     */
    addItem(item: IComboItem): void {
        this._items.push(item);
        this.invalidate();
    }

    /**
     * Удалить элемент по индексу
     */
    removeItemAt(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
            if (this._selectedIndex >= index) {
                this._selectedIndex = Math.max(-1, this._selectedIndex - 1);
            }
            this.invalidate();
        }
    }

    /**
     * Очистить список
     */
    clearItems(): void {
        this._items = [];
        this._selectedIndex = -1;
        this._text = '';
        this.invalidate();
    }

    /**
     * Открыть выпадающий список
     */
    openDropDown(): void {
        if (!this._isOpen && this._items.length > 0 && this.enabled) {
            this._isOpen = true;
            this._hoveredIndex = this._selectedIndex;
            this.invalidate();
        }
    }

    /**
     * Закрыть выпадающий список
     */
    closeDropDown(): void {
        if (this._isOpen) {
            this._isOpen = false;
            this._hoveredIndex = -1;
            this.invalidate();
        }
    }

    /**
     * Переключить состояние списка
     */
    toggleDropDown(): void {
        if (this._isOpen) {
            this.closeDropDown();
        } else {
            this.openDropDown();
        }
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        return new Dimension(150, 24);
    }

    /**
     * Получить область кнопки
     */
    private getButtonRect(): Rectangle {
        return new Rectangle(
            this.bounds.x + this.bounds.width - this._buttonWidth,
            this.bounds.y,
            this._buttonWidth,
            this.bounds.height
        );
    }

    /**
     * Получить область текста
     */
    private getTextRect(): Rectangle {
        return new Rectangle(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width - this._buttonWidth,
            this.bounds.height
        );
    }

    /**
     * Получить область выпадающего списка
     */
    private getDropDownRect(): Rectangle {
        const visibleItems = Math.min(this._items.length, Math.floor(this._maxDropDownHeight / this._itemHeight));
        const height = visibleItems * this._itemHeight;
        
        return new Rectangle(
            this.bounds.x,
            this.bounds.y + this.bounds.height,
            this.bounds.width,
            height + 2 // +2 для рамки
        );
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        // Отрисовка основного поля
        this.paintTextField(ctx);

        // Отрисовка кнопки
        this.paintButton(ctx);

        // Отрисовка выпадающего списка
        if (this._isOpen) {
            this.paintDropDown(ctx);
        }

        ctx.restore();
    }

    /**
     * Отрисовка текстового поля
     */
    private paintTextField(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const textRect = this.getTextRect();
        const { x, y, width, height } = textRect;

        // Фон
        const bgColor = this.enabled ? theme.inputBackground : theme.disabledBackground;
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, height);

        // Рамка
        const borderColor = this._isHovered && this.enabled ? 
            theme.inputBorderActive : theme.inputBorder;
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        // Текст или плейсхолдер
        const font = theme.defaultFont;
        ctx.font = font.toCss();
        
        const text = this._text || this._placeholder;
        const isPlaceholder = !this._text && this._placeholder;
        
        ctx.fillStyle = isPlaceholder ? 
            theme.placeholderForeground.toCss() : 
            (this.enabled ? theme.foreground.toCss() : theme.disabledForeground.toCss());
        
        const textX = x + 5;
        const textY = y + (height + font.size) / 2 - 2;
        
        // Клиппинг текста
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 2, y, width - 4, height);
        ctx.clip();
        ctx.fillText(text, textX, textY);
        ctx.restore();
    }

    /**
     * Отрисовка кнопки
     */
    private paintButton(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const btnRect = this.getButtonRect();
        const { x, y, width, height } = btnRect;

        // Фон кнопки
        let bgColor: Color;
        if (!this.enabled) {
            bgColor = theme.disabledBackground;
        } else if (this._isButtonPressed) {
            bgColor = theme.buttonBackgroundPressed;
        } else if (this._isButtonHovered) {
            bgColor = theme.buttonBackgroundHover;
        } else {
            bgColor = theme.buttonBackground;
        }

        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, height);

        // Рамка
        ctx.strokeStyle = theme.buttonBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        // Стрелка вниз
        const arrowColor = this.enabled ? theme.foreground : theme.disabledForeground;
        ctx.fillStyle = arrowColor.toCss();
        
        const arrowWidth = 8;
        const arrowHeight = 4;
        const arrowX = x + (width - arrowWidth) / 2;
        const arrowY = y + (height - arrowHeight) / 2;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + arrowWidth, arrowY);
        ctx.lineTo(arrowX + arrowWidth / 2, arrowY + arrowHeight);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Отрисовка выпадающего списка
     */
    private paintDropDown(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const dropRect = this.getDropDownRect();
        const { x, y, width, height } = dropRect;

        // Тень
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(x + 2, y + 2, width, height);

        // Фон
        ctx.fillStyle = theme.background.toCss();
        ctx.fillRect(x, y, width, height);

        // Рамка
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        // Элементы
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, width - 2, height - 2);
        ctx.clip();

        const font = theme.defaultFont;
        ctx.font = font.toCss();

        const visibleItems = Math.floor((height - 2) / this._itemHeight);
        const startIndex = Math.floor(this._scrollTop / this._itemHeight);
        const endIndex = Math.min(startIndex + visibleItems + 1, this._items.length);

        for (let i = startIndex; i < endIndex; i++) {
            const item = this._items[i];
            const itemY = y + 1 + (i - startIndex) * this._itemHeight - (this._scrollTop % this._itemHeight);
            
            // Фон элемента
            if (i === this._selectedIndex) {
                // Выбранный элемент - жёлтый фон
                ctx.fillStyle = theme.selectionBackground.toCss();
                ctx.fillRect(x + 1, itemY, width - 2, this._itemHeight);
            } else if (i === this._hoveredIndex) {
                // Наведённый элемент
                ctx.fillStyle = theme.buttonBackgroundHover.toCss();
                ctx.fillRect(x + 1, itemY, width - 2, this._itemHeight);
            }

            // Текст элемента
            const textColor = item.disabled ? theme.disabledForeground : theme.foreground;
            ctx.fillStyle = textColor.toCss();
            
            const textX = x + 6;
            const textY = itemY + (this._itemHeight + font.size) / 2 - 2;
            ctx.fillText(item.text, textX, textY);
        }

        ctx.restore();

        // Полоса прокрутки (если нужна)
        const totalHeight = this._items.length * this._itemHeight;
        if (totalHeight > height - 2) {
            this.paintScrollBar(ctx, dropRect, totalHeight);
        }
    }

    /**
     * Отрисовка полосы прокрутки списка
     */
    private paintScrollBar(ctx: CanvasRenderingContext2D, dropRect: Rectangle, totalHeight: number): void {
        const theme = getTheme();
        const scrollWidth = 12;
        const scrollX = dropRect.x + dropRect.width - scrollWidth - 1;
        const scrollY = dropRect.y + 1;
        const scrollHeight = dropRect.height - 2;

        // Фон полосы
        ctx.fillStyle = new Color(245, 245, 245).toCss();
        ctx.fillRect(scrollX, scrollY, scrollWidth, scrollHeight);

        // Ползунок
        const thumbHeight = Math.max(20, (scrollHeight / totalHeight) * scrollHeight);
        const thumbTop = (this._scrollTop / (totalHeight - (dropRect.height - 2))) * (scrollHeight - thumbHeight);

        ctx.fillStyle = new Color(200, 200, 200).toCss();
        ctx.fillRect(scrollX + 2, scrollY + thumbTop, scrollWidth - 4, thumbHeight);
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ
    // ========================================================================

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        const buttonRect = this.getButtonRect();
        const newButtonHovered = buttonRect.contains(x, y);
        const newHovered = this.bounds.contains(x, y);

        if (this._isButtonHovered !== newButtonHovered || this._isHovered !== newHovered) {
            this._isButtonHovered = newButtonHovered;
            this._isHovered = newHovered;
            this.invalidate();
        }

        // Обработка списка
        if (this._isOpen) {
            const dropRect = this.getDropDownRect();
            if (dropRect.contains(x, y)) {
                const relY = y - dropRect.y - 1 + this._scrollTop;
                const newHoveredIndex = Math.floor(relY / this._itemHeight);
                
                if (newHoveredIndex >= 0 && newHoveredIndex < this._items.length && 
                    this._hoveredIndex !== newHoveredIndex) {
                    this._hoveredIndex = newHoveredIndex;
                    this.invalidate();
                }
            }
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._isHovered || this._isButtonHovered) {
            this._isHovered = false;
            this._isButtonHovered = false;
            this._isButtonPressed = false;
            this.invalidate();
        }
    }

    /**
     * Обработка нажатия мыши
     */
    onMouseDown(x: number, y: number): void {
        if (!this.enabled) return;

        const buttonRect = this.getButtonRect();
        if (buttonRect.contains(x, y)) {
            this._isButtonPressed = true;
            this.invalidate();
        }
    }

    /**
     * Обработка отпускания мыши
     */
    onMouseUp(x: number, y: number): void {
        if (!this.enabled) return;

        const wasPressed = this._isButtonPressed;
        this._isButtonPressed = false;

        // Клик на кнопку или поле
        const buttonRect = this.getButtonRect();
        const textRect = this.getTextRect();
        
        if (buttonRect.contains(x, y) || (textRect.contains(x, y) && this._mode === ComboBoxMode.DropDownList)) {
            if (wasPressed || textRect.contains(x, y)) {
                this.toggleDropDown();
                return;
            }
        }

        // Клик на элемент списка
        if (this._isOpen) {
            const dropRect = this.getDropDownRect();
            if (dropRect.contains(x, y)) {
                const relY = y - dropRect.y - 1 + this._scrollTop;
                const clickedIndex = Math.floor(relY / this._itemHeight);
                
                if (clickedIndex >= 0 && clickedIndex < this._items.length) {
                    const item = this._items[clickedIndex];
                    if (!item.disabled) {
                        this._selectedIndex = clickedIndex;
                        this._text = item.text;
                        this.closeDropDown();
                    }
                }
            } else if (!this.bounds.contains(x, y)) {
                // Клик вне контрола - закрыть список
                this.closeDropDown();
            }
        }

        this.invalidate();
    }

    /**
     * Обработка скролла
     */
    onWheel(deltaY: number): void {
        if (this._isOpen) {
            const dropRect = this.getDropDownRect();
            const totalHeight = this._items.length * this._itemHeight;
            const maxScroll = Math.max(0, totalHeight - (dropRect.height - 2));
            
            this._scrollTop = Math.max(0, Math.min(maxScroll, this._scrollTop + deltaY));
            this.invalidate();
        }
    }

    /**
     * Обработка клавиатуры
     */
    onKeyDown(key: string): void {
        if (!this.enabled) return;

        switch (key) {
            case 'ArrowDown':
                if (this._isOpen) {
                    this._hoveredIndex = Math.min(this._items.length - 1, this._hoveredIndex + 1);
                } else {
                    this._selectedIndex = Math.min(this._items.length - 1, this._selectedIndex + 1);
                    if (this._selectedIndex >= 0) {
                        this._text = this._items[this._selectedIndex].text;
                    }
                }
                this.invalidate();
                break;
                
            case 'ArrowUp':
                if (this._isOpen) {
                    this._hoveredIndex = Math.max(0, this._hoveredIndex - 1);
                } else {
                    this._selectedIndex = Math.max(0, this._selectedIndex - 1);
                    if (this._selectedIndex >= 0) {
                        this._text = this._items[this._selectedIndex].text;
                    }
                }
                this.invalidate();
                break;
                
            case 'Enter':
                if (this._isOpen && this._hoveredIndex >= 0) {
                    const item = this._items[this._hoveredIndex];
                    if (!item.disabled) {
                        this._selectedIndex = this._hoveredIndex;
                        this._text = item.text;
                        this.closeDropDown();
                    }
                } else {
                    this.openDropDown();
                }
                break;
                
            case 'Escape':
                this.closeDropDown();
                break;
                
            case ' ':
                if (this._mode === ComboBoxMode.DropDownList) {
                    this.toggleDropDown();
                }
                break;
        }
    }
}
