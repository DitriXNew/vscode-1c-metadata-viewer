/**
 * Контрол RadioButtonGroup - группа радиокнопок
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.RadioButtonGroup
 */
import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Опция радиокнопки
 */
export interface IRadioOption {
    /** Значение (ключ) */
    value: string | number;
    /** Отображаемый текст */
    text: string;
    /** Отключена */
    disabled?: boolean;
    /** Подсказка */
    tooltip?: string;
}

/**
 * Создать опцию
 */
export function createRadioOption(value: string | number, text: string, options?: Partial<IRadioOption>): IRadioOption {
    return {
        value,
        text,
        disabled: false,
        ...options
    };
}

/**
 * Направление расположения
 */
export enum RadioDirection {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

// ============================================================================
// КОНТРОЛ РАДИОКНОПКИ
// ============================================================================

/**
 * Одна радиокнопка (внутренний класс)
 */
class RadioButton extends LightControl {
    private _option: IRadioOption;
    private _isSelected: boolean = false;
    private _isHovered: boolean = false;
    private _radioSize: number = 16;
    private _spacing: number = 6;

    constructor(option: IRadioOption) {
        super();
        this._option = option;
    }

    get option(): IRadioOption {
        return this._option;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    set isSelected(value: boolean) {
        if (this._isSelected !== value) {
            this._isSelected = value;
            this.invalidate();
        }
    }

    get isHovered(): boolean {
        return this._isHovered;
    }

    set isHovered(value: boolean) {
        if (this._isHovered !== value) {
            this._isHovered = value;
            this.invalidate();
        }
    }

    calculatePreferredSize(): Dimension {
        // Примерный размер: радиокнопка + отступ + текст
        const theme = getTheme();
        const textWidth = this._option.text.length * 7; // Приблизительно
        return new Dimension(this._radioSize + this._spacing + textWidth, Math.max(this._radioSize, 20));
    }

    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();
        const { x, y, height } = this.bounds;
        const isDisabled = this._option.disabled || !this.enabled;

        // Центрирование по вертикали
        const radioY = y + (height - this._radioSize) / 2;

        // Внешний круг
        const cx = x + this._radioSize / 2;
        const cy = radioY + this._radioSize / 2;
        const radius = this._radioSize / 2 - 1;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        
        // Фон
        const bgColor = isDisabled ? theme.disabledBackground : theme.inputBackground;
        ctx.fillStyle = bgColor.toCss();
        ctx.fill();

        // Рамка
        let borderColor: Color;
        if (isDisabled) {
            borderColor = theme.disabledForeground;
        } else if (this._isHovered) {
            borderColor = theme.inputBorderActive;
        } else {
            borderColor = theme.inputBorder;
        }
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        ctx.stroke();

        // Внутренний круг (если выбран)
        if (this._isSelected) {
            const innerRadius = radius * 0.5;
            ctx.beginPath();
            ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
            
            const dotColor = isDisabled ? theme.disabledForeground : theme.foreground;
            ctx.fillStyle = dotColor.toCss();
            ctx.fill();
        }

        // Текст
        const font = theme.defaultFont;
        ctx.font = font.toCss();
        
        const textColor = isDisabled ? theme.disabledForeground : theme.foreground;
        ctx.fillStyle = textColor.toCss();
        
        const textX = x + this._radioSize + this._spacing;
        const textY = y + (height + font.size) / 2 - 2;
        ctx.fillText(this._option.text, textX, textY);
    }
}

// ============================================================================
// ГРУППА РАДИОКНОПОК
// ============================================================================

/**
 * Группа радиокнопок
 */
export class RadioButtonGroup extends LightComposite {
    // Опции
    private _options: IRadioOption[] = [];
    private _radioButtons: RadioButton[] = [];
    private _selectedValue: string | number | null = null;
    
    // Настройки
    private _direction: RadioDirection = RadioDirection.Vertical;
    private _spacing: number = 8;
    private _columns: number = 1; // Для вертикального режима с несколькими колонками

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Опции */
    get options(): IRadioOption[] {
        return this._options;
    }

    set options(value: IRadioOption[]) {
        this._options = value;
        this.rebuildButtons();
        this.invalidate();
    }

    /** Выбранное значение */
    get selectedValue(): string | number | null {
        return this._selectedValue;
    }

    set selectedValue(value: string | number | null) {
        if (this._selectedValue !== value) {
            this._selectedValue = value;
            this.updateSelection();
            this.invalidate();
        }
    }

    /** Выбранный индекс */
    get selectedIndex(): number {
        if (this._selectedValue === null) return -1;
        return this._options.findIndex(opt => opt.value === this._selectedValue);
    }

    set selectedIndex(value: number) {
        if (value >= 0 && value < this._options.length) {
            this.selectedValue = this._options[value].value;
        } else {
            this.selectedValue = null;
        }
    }

    /** Направление */
    get direction(): RadioDirection {
        return this._direction;
    }

    set direction(value: RadioDirection) {
        this._direction = value;
        this.invalidate();
    }

    /** Отступ между кнопками */
    get spacing(): number {
        return this._spacing;
    }

    set spacing(value: number) {
        this._spacing = value;
        this.invalidate();
    }

    /** Количество колонок */
    get columns(): number {
        return this._columns;
    }

    set columns(value: number) {
        this._columns = Math.max(1, value);
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ
    // ========================================================================

    /**
     * Добавить опцию
     */
    addOption(option: IRadioOption): void {
        this._options.push(option);
        this.rebuildButtons();
        this.invalidate();
    }

    /**
     * Удалить опцию по значению
     */
    removeOption(value: string | number): void {
        const index = this._options.findIndex(opt => opt.value === value);
        if (index >= 0) {
            this._options.splice(index, 1);
            if (this._selectedValue === value) {
                this._selectedValue = null;
            }
            this.rebuildButtons();
            this.invalidate();
        }
    }

    /**
     * Очистить опции
     */
    clearOptions(): void {
        this._options = [];
        this._selectedValue = null;
        this.rebuildButtons();
        this.invalidate();
    }

    /**
     * Пересоздать кнопки
     */
    private rebuildButtons(): void {
        this._radioButtons = this._options.map(opt => {
            const btn = new RadioButton(opt);
            btn.isSelected = opt.value === this._selectedValue;
            return btn;
        });
        
        // Очистить детей и добавить заново
        this._children.length = 0;
        for (const btn of this._radioButtons) {
            this.addChild(btn);
        }
    }

    /**
     * Обновить состояние выбора
     */
    private updateSelection(): void {
        for (const btn of this._radioButtons) {
            btn.isSelected = btn.option.value === this._selectedValue;
        }
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        if (this._radioButtons.length === 0) {
            return new Dimension(100, 24);
        }

        let width = 0;
        let height = 0;

        if (this._direction === RadioDirection.Vertical) {
            const rows = Math.ceil(this._radioButtons.length / this._columns);
            
            for (const btn of this._radioButtons) {
                const size = btn.calculatePreferredSize();
                width = Math.max(width, size.width);
            }
            width = width * this._columns + this._spacing * (this._columns - 1);
            
            // Высота одной кнопки
            const btnHeight = this._radioButtons[0].calculatePreferredSize().height;
            height = rows * btnHeight + (rows - 1) * this._spacing;
        } else {
            for (const btn of this._radioButtons) {
                const size = btn.calculatePreferredSize();
                width += size.width;
                height = Math.max(height, size.height);
            }
            width += this._spacing * (this._radioButtons.length - 1);
        }

        return new Dimension(width, height);
    }

    /**
     * Установить границы
     */
    setBounds(bounds: Rectangle): void;
    setBounds(x: number, y: number, width: number, height: number): void;
    setBounds(xOrBounds: Rectangle | number, y?: number, width?: number, height?: number): void {
        if (xOrBounds instanceof Rectangle) {
            super.setBounds(xOrBounds);
        } else {
            super.setBounds(xOrBounds, y!, width!, height!);
        }
        this.layoutButtons();
    }

    /**
     * Расположить кнопки
     */
    private layoutButtons(): void {
        if (this._radioButtons.length === 0) return;

        const { x, y, width, height } = this.bounds;
        
        if (this._direction === RadioDirection.Vertical) {
            const rows = Math.ceil(this._radioButtons.length / this._columns);
            const colWidth = (width - this._spacing * (this._columns - 1)) / this._columns;
            const rowHeight = (height - this._spacing * (rows - 1)) / rows;

            for (let i = 0; i < this._radioButtons.length; i++) {
                const btn = this._radioButtons[i];
                const col = i % this._columns;
                const row = Math.floor(i / this._columns);
                
                const btnX = x + col * (colWidth + this._spacing);
                const btnY = y + row * (rowHeight + this._spacing);
                
                btn.setBounds(new Rectangle(btnX, btnY, colWidth, rowHeight));
            }
        } else {
            // Горизонтальное расположение
            const totalButtons = this._radioButtons.length;
            const availableWidth = width - this._spacing * (totalButtons - 1);
            const btnWidth = availableWidth / totalButtons;
            
            let currentX = x;
            for (const btn of this._radioButtons) {
                btn.setBounds(new Rectangle(currentX, y, btnWidth, height));
                currentX += btnWidth + this._spacing;
            }
        }
    }

    /**
     * Отрисовка
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        // Отрисовка всех кнопок
        for (const btn of this._radioButtons) {
            btn.paint(ctx, clip);
        }
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ
    // ========================================================================

    /**
     * Найти кнопку по координатам
     */
    private findButtonAt(x: number, y: number): RadioButton | null {
        for (const btn of this._radioButtons) {
            if (btn.bounds.contains(x, y)) {
                return btn;
            }
        }
        return null;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        for (const btn of this._radioButtons) {
            btn.isHovered = btn.bounds.contains(x, y);
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        for (const btn of this._radioButtons) {
            btn.isHovered = false;
        }
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        if (!this.enabled) return;

        const btn = this.findButtonAt(x, y);
        if (btn && !btn.option.disabled) {
            this.selectedValue = btn.option.value;
        }
    }

    /**
     * Обработка клавиатуры
     */
    onKeyDown(key: string): void {
        if (!this.enabled) return;

        const currentIndex = this.selectedIndex;
        let newIndex = currentIndex;

        switch (key) {
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                if (newIndex >= this._options.length) {
                    newIndex = 0;
                }
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                if (newIndex < 0) {
                    newIndex = this._options.length - 1;
                }
                break;
                
            case 'Home':
                newIndex = 0;
                break;
                
            case 'End':
                newIndex = this._options.length - 1;
                break;
        }

        // Пропустить отключённые
        while (newIndex !== currentIndex && this._options[newIndex]?.disabled) {
            if (key === 'ArrowDown' || key === 'ArrowRight') {
                newIndex = (newIndex + 1) % this._options.length;
            } else {
                newIndex = (newIndex - 1 + this._options.length) % this._options.length;
            }
        }

        if (newIndex !== currentIndex && !this._options[newIndex]?.disabled) {
            this.selectedIndex = newIndex;
        }
    }
}
