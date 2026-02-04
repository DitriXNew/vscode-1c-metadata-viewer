/**
 * Контрол Table - таблица данных
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.TableControl
 * и com._1c.g5.v8.dt.form.internal.presentation.layout.view.Grid83UI
 */
import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Insets } from '../geometry/Insets';
import { Dimension } from '../geometry';
import { getTheme, ITheme, Color, Font } from '../theme';
import { Table83Styles, TableSizes } from '../theme/ControlStyles';

// ============================================================================
// КОЛОНКА ТАБЛИЦЫ
// ============================================================================

/**
 * Тип данных колонки
 */
export enum ColumnType {
    String = 'string',
    Number = 'number',
    Date = 'date',
    Boolean = 'boolean',
    Picture = 'picture'
}

/**
 * Выравнивание в колонке
 */
export enum ColumnAlignment {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

/**
 * Определение колонки таблицы
 */
export interface ITableColumn {
    /** Идентификатор колонки */
    id: string;
    /** Заголовок колонки */
    title: string;
    /** Ширина в пикселях (0 = auto) */
    width: number;
    /** Минимальная ширина */
    minWidth: number;
    /** Тип данных */
    type: ColumnType;
    /** Выравнивание */
    alignment: ColumnAlignment;
    /** Видимость */
    visible: boolean;
    /** Редактируемость */
    editable: boolean;
    /** Можно ли изменять размер */
    resizable: boolean;
    /** Можно ли сортировать */
    sortable: boolean;
    /** Текущее направление сортировки (null - нет сортировки) */
    sortDirection: 'asc' | 'desc' | null;
}

/**
 * Создать колонку с дефолтными значениями
 */
export function createColumn(id: string, title: string, options?: Partial<ITableColumn>): ITableColumn {
    return {
        id,
        title,
        width: 100,
        minWidth: 40,
        type: ColumnType.String,
        alignment: ColumnAlignment.Left,
        visible: true,
        editable: false,
        resizable: true,
        sortable: false,
        sortDirection: null,
        ...options
    };
}

// ============================================================================
// СТРОКА ТАБЛИЦЫ
// ============================================================================

/**
 * Данные строки таблицы
 */
export interface ITableRow {
    /** Уникальный идентификатор строки */
    id: string | number;
    /** Данные ячеек (ключ = id колонки) */
    data: Record<string, unknown>;
    /** Уровень иерархии (0 = корень) */
    level?: number;
    /** Развёрнута ли (для иерархии) */
    expanded?: boolean;
    /** Есть ли дочерние элементы */
    hasChildren?: boolean;
    /** Выделена ли строка */
    selected?: boolean;
}

// ============================================================================
// КОНТРОЛ ТАБЛИЦЫ
// ============================================================================

/**
 * Контрол таблицы
 */
export class TableControl extends LightComposite {
    // Данные
    private _columns: ITableColumn[] = [];
    private _rows: ITableRow[] = [];
    
    // Состояние выделения
    private _selectedRowIds: Set<string | number> = new Set();
    private _currentRowId: string | number | null = null;
    private _currentColumnId: string | null = null;
    
    // Скроллинг
    private _scrollTop: number = 0;
    private _scrollLeft: number = 0;
    
    // Настройки отображения
    private _showHeader: boolean = true;
    private _showGridLines: boolean = true;
    private _showRowNumbers: boolean = false;
    private _alternateRowColors: boolean = true;
    private _rowHeight: number = 26;  // tableRowHeight из HippoTheme
    private _headerHeight: number = 27; // tableHeaderUpperRowHeight
    private _hierarchical: boolean = false;
    private _multiSelect: boolean = true;
    
    // Hover состояние
    private _hoveredRowId: string | number | null = null;
    private _hoveredColumnId: string | null = null;
    
    // Ресайз колонок
    private _resizingColumnId: string | null = null;
    private _resizeStartX: number = 0;
    private _resizeStartWidth: number = 0;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Колонки таблицы */
    get columns(): ITableColumn[] {
        return this._columns;
    }

    set columns(value: ITableColumn[]) {
        this._columns = value;
        this.invalidate();
    }

    /** Строки таблицы */
    get rows(): ITableRow[] {
        return this._rows;
    }

    set rows(value: ITableRow[]) {
        this._rows = value;
        this.invalidate();
    }

    /** Показывать заголовок */
    get showHeader(): boolean {
        return this._showHeader;
    }

    set showHeader(value: boolean) {
        this._showHeader = value;
        this.invalidate();
    }

    /** Показывать линии сетки */
    get showGridLines(): boolean {
        return this._showGridLines;
    }

    set showGridLines(value: boolean) {
        this._showGridLines = value;
        this.invalidate();
    }

    /** Показывать номера строк */
    get showRowNumbers(): boolean {
        return this._showRowNumbers;
    }

    set showRowNumbers(value: boolean) {
        this._showRowNumbers = value;
        this.invalidate();
    }

    /** Чередовать цвета строк */
    get alternateRowColors(): boolean {
        return this._alternateRowColors;
    }

    set alternateRowColors(value: boolean) {
        this._alternateRowColors = value;
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

    /** Высота заголовка */
    get headerHeight(): number {
        return this._headerHeight;
    }

    set headerHeight(value: number) {
        this._headerHeight = value;
        this.invalidate();
    }

    /** Иерархическая таблица */
    get hierarchical(): boolean {
        return this._hierarchical;
    }

    set hierarchical(value: boolean) {
        this._hierarchical = value;
        this.invalidate();
    }

    /** Мультивыбор */
    get multiSelect(): boolean {
        return this._multiSelect;
    }

    set multiSelect(value: boolean) {
        this._multiSelect = value;
    }

    /** Текущая строка */
    get currentRowId(): string | number | null {
        return this._currentRowId;
    }

    set currentRowId(value: string | number | null) {
        this._currentRowId = value;
        this.invalidate();
    }

    /** Текущая колонка */
    get currentColumnId(): string | null {
        return this._currentColumnId;
    }

    set currentColumnId(value: string | null) {
        this._currentColumnId = value;
        this.invalidate();
    }

    /** Выбранные строки */
    get selectedRowIds(): (string | number)[] {
        return Array.from(this._selectedRowIds);
    }

    /** Позиция скролла по вертикали */
    get scrollTop(): number {
        return this._scrollTop;
    }

    set scrollTop(value: number) {
        this._scrollTop = Math.max(0, value);
        this.invalidate();
    }

    /** Позиция скролла по горизонтали */
    get scrollLeft(): number {
        return this._scrollLeft;
    }

    set scrollLeft(value: number) {
        this._scrollLeft = Math.max(0, value);
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ РАБОТЫ С ДАННЫМИ
    // ========================================================================

    /**
     * Добавить колонку
     */
    addColumn(column: ITableColumn): void {
        this._columns.push(column);
        this.invalidate();
    }

    /**
     * Удалить колонку
     */
    removeColumn(columnId: string): void {
        const index = this._columns.findIndex(c => c.id === columnId);
        if (index !== -1) {
            this._columns.splice(index, 1);
            this.invalidate();
        }
    }

    /**
     * Добавить строку
     */
    addRow(row: ITableRow): void {
        this._rows.push(row);
        this.invalidate();
    }

    /**
     * Удалить строку
     */
    removeRow(rowId: string | number): void {
        const index = this._rows.findIndex(r => r.id === rowId);
        if (index !== -1) {
            this._rows.splice(index, 1);
            this._selectedRowIds.delete(rowId);
            if (this._currentRowId === rowId) {
                this._currentRowId = null;
            }
            this.invalidate();
        }
    }

    /**
     * Очистить все строки
     */
    clearRows(): void {
        this._rows = [];
        this._selectedRowIds.clear();
        this._currentRowId = null;
        this._scrollTop = 0;
        this.invalidate();
    }

    /**
     * Выделить строку
     */
    selectRow(rowId: string | number, addToSelection: boolean = false): void {
        if (!this._multiSelect || !addToSelection) {
            this._selectedRowIds.clear();
        }
        this._selectedRowIds.add(rowId);
        this._currentRowId = rowId;
        this.invalidate();
    }

    /**
     * Снять выделение со строки
     */
    deselectRow(rowId: string | number): void {
        this._selectedRowIds.delete(rowId);
        if (this._currentRowId === rowId) {
            this._currentRowId = null;
        }
        this.invalidate();
    }

    /**
     * Выделить все строки
     */
    selectAll(): void {
        if (this._multiSelect) {
            this._rows.forEach(row => this._selectedRowIds.add(row.id));
            this.invalidate();
        }
    }

    /**
     * Снять все выделения
     */
    clearSelection(): void {
        this._selectedRowIds.clear();
        this._currentRowId = null;
        this.invalidate();
    }

    /**
     * Проверить выделена ли строка
     */
    isRowSelected(rowId: string | number): boolean {
        return this._selectedRowIds.has(rowId);
    }

    /**
     * Развернуть/свернуть узел иерархии
     */
    toggleExpand(rowId: string | number): void {
        const row = this._rows.find(r => r.id === rowId);
        if (row && row.hasChildren) {
            row.expanded = !row.expanded;
            this.invalidate();
        }
    }

    // ========================================================================
    // ВЫЧИСЛЕНИЕ РАЗМЕРОВ
    // ========================================================================

    /**
     * Получить видимые колонки
     */
    private getVisibleColumns(): ITableColumn[] {
        return this._columns.filter(c => c.visible);
    }

    /**
     * Получить общую ширину всех колонок
     */
    private getTotalColumnsWidth(): number {
        return this.getVisibleColumns().reduce((sum, col) => sum + col.width, 0);
    }

    /**
     * Получить общую высоту данных
     */
    private getTotalDataHeight(): number {
        return this.getVisibleRows().length * this._rowHeight;
    }

    /**
     * Получить видимые строки (с учётом иерархии)
     */
    private getVisibleRows(): ITableRow[] {
        if (!this._hierarchical) {
            return this._rows;
        }

        const result: ITableRow[] = [];
        const expandedIds = new Set(
            this._rows.filter(r => r.expanded).map(r => r.id)
        );

        // Простая логика: показываем все строки уровня 0 и дочерние развёрнутых
        // В реальности нужна более сложная логика с parentId
        for (const row of this._rows) {
            const level = row.level || 0;
            if (level === 0) {
                result.push(row);
            } else {
                // Для простоты показываем все вложенные
                // TODO: реализовать полную иерархию с parentId
                result.push(row);
            }
        }

        return result;
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        const theme = getTheme();
        const visibleColumns = this.getVisibleColumns();
        
        let width = TableSizes.minTableWidth;
        let height = 100;

        if (visibleColumns.length > 0) {
            width = this.getTotalColumnsWidth();
        }

        if (this._showHeader) {
            height = this._headerHeight;
        }

        height += Math.min(10, this._rows.length) * this._rowHeight;

        return new Dimension(width, height);
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка таблицы
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const { x, y, width, height } = this.bounds;
        const theme = getTheme();

        ctx.save();

        // Клиппинг
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();

        // Фон таблицы
        ctx.fillStyle = Table83Styles.cellBackground.toCss();
        ctx.fillRect(x, y, width, height);

        // Рамка таблицы
        ctx.strokeStyle = theme.border.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        let currentY = y;

        // Заголовок
        if (this._showHeader) {
            this.paintHeader(ctx, x, currentY, width);
            currentY += this._headerHeight;
        }

        // Данные
        const dataHeight = height - (this._showHeader ? this._headerHeight : 0);
        this.paintData(ctx, x, currentY, width, dataHeight);

        ctx.restore();
    }

    /**
     * Отрисовка заголовка
     */
    private paintHeader(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        const theme = getTheme();
        const visibleColumns = this.getVisibleColumns();

        // Фон заголовка
        ctx.fillStyle = theme.tableHeaderBackground.toCss();
        ctx.fillRect(x, y, width, this._headerHeight);

        // Линия под заголовком
        ctx.strokeStyle = Table83Styles.headerDelimiter.toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + this._headerHeight - 0.5);
        ctx.lineTo(x + width, y + this._headerHeight - 0.5);
        ctx.stroke();

        // Колонки
        let colX = x - this._scrollLeft;
        const font = theme.defaultFont;
        ctx.font = font.toCss();

        for (const column of visibleColumns) {
            if (colX + column.width > x && colX < x + width) {
                // Текст заголовка
                ctx.fillStyle = Table83Styles.headerText.toCss();
                const textX = colX + TableSizes.columnTextHSpace;
                const textY = y + (this._headerHeight + font.size) / 2 - 2;
                
                ctx.save();
                ctx.beginPath();
                ctx.rect(colX, y, column.width, this._headerHeight);
                ctx.clip();
                ctx.fillText(column.title, textX, textY);
                ctx.restore();

                // Разделитель колонки
                if (this._showGridLines) {
                    ctx.strokeStyle = Table83Styles.headerDelimiter.toCss();
                    ctx.beginPath();
                    ctx.moveTo(colX + column.width - 0.5, y);
                    ctx.lineTo(colX + column.width - 0.5, y + this._headerHeight);
                    ctx.stroke();
                }

                // Индикатор сортировки
                if (column.sortDirection) {
                    this.paintSortIndicator(ctx, colX + column.width - 16, y + 4, column.sortDirection);
                }
            }

            colX += column.width;
        }
    }

    /**
     * Отрисовка индикатора сортировки
     */
    private paintSortIndicator(ctx: CanvasRenderingContext2D, x: number, y: number, direction: 'asc' | 'desc'): void {
        ctx.fillStyle = Table83Styles.headerText.toCss();
        ctx.beginPath();
        
        if (direction === 'asc') {
            ctx.moveTo(x + 4, y + 8);
            ctx.lineTo(x + 8, y + 2);
            ctx.lineTo(x + 12, y + 8);
        } else {
            ctx.moveTo(x + 4, y + 2);
            ctx.lineTo(x + 8, y + 8);
            ctx.lineTo(x + 12, y + 2);
        }
        
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Отрисовка данных
     */
    private paintData(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        const theme = getTheme();
        const visibleColumns = this.getVisibleColumns();
        const visibleRows = this.getVisibleRows();
        const font = theme.defaultFont;

        // Определить видимый диапазон строк
        const firstVisibleRow = Math.floor(this._scrollTop / this._rowHeight);
        const lastVisibleRow = Math.min(
            visibleRows.length - 1,
            Math.ceil((this._scrollTop + height) / this._rowHeight)
        );

        ctx.font = font.toCss();

        for (let rowIndex = firstVisibleRow; rowIndex <= lastVisibleRow; rowIndex++) {
            const row = visibleRows[rowIndex];
            if (!row) continue;

            const rowY = y + rowIndex * this._rowHeight - this._scrollTop;
            
            // Пропустить если строка не видна
            if (rowY + this._rowHeight < y || rowY > y + height) continue;

            const isSelected = this._selectedRowIds.has(row.id);
            const isCurrent = this._currentRowId === row.id;
            const isHovered = this._hoveredRowId === row.id;
            const isAlternate = this._alternateRowColors && rowIndex % 2 === 1;

            // Фон строки
            this.paintRowBackground(ctx, x, rowY, width, row, isSelected, isCurrent, isHovered, isAlternate);

            // Ячейки
            let colX = x - this._scrollLeft;
            
            for (const column of visibleColumns) {
                if (colX + column.width > x && colX < x + width) {
                    const isCurrentCell = isCurrent && this._currentColumnId === column.id;
                    
                    this.paintCell(ctx, colX, rowY, column, row, isSelected, isCurrentCell);
                }
                
                colX += column.width;
            }

            // Горизонтальная линия сетки
            if (this._showGridLines) {
                ctx.strokeStyle = Table83Styles.horizontalDataDelimiter.toCss();
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, rowY + this._rowHeight - 0.5);
                ctx.lineTo(x + width, rowY + this._rowHeight - 0.5);
                ctx.stroke();
            }
        }
    }

    /**
     * Отрисовка фона строки
     */
    private paintRowBackground(
        ctx: CanvasRenderingContext2D,
        x: number, y: number, width: number,
        row: ITableRow,
        isSelected: boolean,
        isCurrent: boolean,
        isHovered: boolean,
        isAlternate: boolean
    ): void {
        let bgColor: Color;

        if (isSelected) {
            bgColor = Table83Styles.selectedBackground;
        } else if (isCurrent) {
            bgColor = Table83Styles.inactiveCurrentCell;
        } else if (isHovered) {
            bgColor = Table83Styles.editingAreaActive;
        } else if (isAlternate) {
            bgColor = Table83Styles.alternativeRowColor;
        } else {
            bgColor = Table83Styles.activeCellBackground;
        }

        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, width, this._rowHeight);

        // Рамка текущей строки
        if (isCurrent) {
            ctx.strokeStyle = Table83Styles.activeCellBorder.toCss();
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, width - 2, this._rowHeight - 2);
        }
    }

    /**
     * Отрисовка ячейки
     */
    private paintCell(
        ctx: CanvasRenderingContext2D,
        x: number, y: number,
        column: ITableColumn,
        row: ITableRow,
        isSelected: boolean,
        isCurrentCell: boolean
    ): void {
        const theme = getTheme();
        const font = theme.defaultFont;
        const value = row.data[column.id];
        
        // Текст ячейки
        let textColor: Color;
        if (isSelected) {
            textColor = Table83Styles.selectedText;
        } else {
            textColor = theme.foreground;
        }

        ctx.save();
        
        // Клиппинг ячейки
        ctx.beginPath();
        ctx.rect(x, y, column.width, this._rowHeight);
        ctx.clip();

        // Отступ для иерархии
        let textX = x + TableSizes.columnTextHSpace;
        
        if (this._hierarchical && column === this.getVisibleColumns()[0]) {
            const level = row.level || 0;
            const indent = level * TableSizes.layerLineWidth;
            textX += indent;

            // Иконка раскрытия/свёртывания
            if (row.hasChildren) {
                this.paintExpandIcon(ctx, textX - 12, y + (this._rowHeight - 9) / 2, row.expanded || false);
            }
        }

        // Форматирование значения
        const displayValue = this.formatCellValue(value, column.type);
        
        // Выравнивание
        let finalTextX = textX;
        if (column.alignment === ColumnAlignment.Right) {
            const textWidth = ctx.measureText(displayValue).width;
            finalTextX = x + column.width - textWidth - TableSizes.columnTextHSpace;
        } else if (column.alignment === ColumnAlignment.Center) {
            const textWidth = ctx.measureText(displayValue).width;
            finalTextX = x + (column.width - textWidth) / 2;
        }

        const textY = y + (this._rowHeight + font.size) / 2 - 2;
        
        ctx.fillStyle = textColor.toCss();
        ctx.fillText(displayValue, finalTextX, textY);

        // Вертикальный разделитель
        if (this._showGridLines) {
            ctx.strokeStyle = Table83Styles.verticalDataDelimiter.toCss();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + column.width - 0.5, y);
            ctx.lineTo(x + column.width - 0.5, y + this._rowHeight);
            ctx.stroke();
        }

        // Рамка текущей ячейки
        if (isCurrentCell) {
            ctx.strokeStyle = Table83Styles.focusRectColor.toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1.5, y + 1.5, column.width - 3, this._rowHeight - 3);
        }

        ctx.restore();
    }

    /**
     * Отрисовка иконки раскрытия/свёртывания
     */
    private paintExpandIcon(ctx: CanvasRenderingContext2D, x: number, y: number, expanded: boolean): void {
        const size = TableSizes.treeExpandIconWidth;
        
        ctx.strokeStyle = Table83Styles.hierarchyArrowColor.toCss();
        ctx.lineWidth = 1;
        
        // Квадратик
        ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
        
        // Горизонтальная линия (минус)
        ctx.beginPath();
        ctx.moveTo(x + 2, y + size / 2);
        ctx.lineTo(x + size - 2, y + size / 2);
        ctx.stroke();
        
        // Вертикальная линия (плюс) если свёрнуто
        if (!expanded) {
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y + 2);
            ctx.lineTo(x + size / 2, y + size - 2);
            ctx.stroke();
        }
    }

    /**
     * Форматирование значения ячейки
     */
    private formatCellValue(value: unknown, type: ColumnType): string {
        if (value === null || value === undefined) {
            return '';
        }

        switch (type) {
            case ColumnType.Boolean:
                return value ? '☑' : '☐';
            case ColumnType.Number:
                return typeof value === 'number' ? value.toLocaleString() : String(value);
            case ColumnType.Date:
                if (value instanceof Date) {
                    return value.toLocaleDateString();
                }
                return String(value);
            case ColumnType.Picture:
                return '[img]';
            default:
                return String(value);
        }
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ МЫШИ
    // ========================================================================

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        const localX = x - this.bounds.x;
        const localY = y - this.bounds.y;

        // Определить строку под курсором
        const dataY = this._showHeader ? localY - this._headerHeight : localY;
        
        if (dataY >= 0) {
            const rowIndex = Math.floor((dataY + this._scrollTop) / this._rowHeight);
            const visibleRows = this.getVisibleRows();
            
            if (rowIndex >= 0 && rowIndex < visibleRows.length) {
                const newHoveredId = visibleRows[rowIndex].id;
                if (this._hoveredRowId !== newHoveredId) {
                    this._hoveredRowId = newHoveredId;
                    this.invalidate();
                }
            } else {
                if (this._hoveredRowId !== null) {
                    this._hoveredRowId = null;
                    this.invalidate();
                }
            }
        }

        // Определить колонку под курсором
        const visibleColumns = this.getVisibleColumns();
        let colX = -this._scrollLeft;
        let newHoveredColumnId: string | null = null;
        
        for (const column of visibleColumns) {
            if (localX >= colX && localX < colX + column.width) {
                newHoveredColumnId = column.id;
                break;
            }
            colX += column.width;
        }

        if (this._hoveredColumnId !== newHoveredColumnId) {
            this._hoveredColumnId = newHoveredColumnId;
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredRowId !== null) {
            this._hoveredRowId = null;
            this.invalidate();
        }
        this._hoveredColumnId = null;
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number, ctrlKey: boolean = false, shiftKey: boolean = false): void {
        const localX = x - this.bounds.x;
        const localY = y - this.bounds.y;

        // Клик в области данных
        const dataY = this._showHeader ? localY - this._headerHeight : localY;
        
        if (dataY >= 0) {
            const rowIndex = Math.floor((dataY + this._scrollTop) / this._rowHeight);
            const visibleRows = this.getVisibleRows();
            
            if (rowIndex >= 0 && rowIndex < visibleRows.length) {
                const row = visibleRows[rowIndex];
                
                // Выделение
                if (ctrlKey && this._multiSelect) {
                    if (this._selectedRowIds.has(row.id)) {
                        this.deselectRow(row.id);
                    } else {
                        this.selectRow(row.id, true);
                    }
                } else {
                    this.selectRow(row.id, false);
                }

                // Определить текущую колонку
                const visibleColumns = this.getVisibleColumns();
                let colX = -this._scrollLeft;
                
                for (const column of visibleColumns) {
                    if (localX >= colX && localX < colX + column.width) {
                        this._currentColumnId = column.id;
                        
                        // Клик на иконку раскрытия
                        if (this._hierarchical && column === visibleColumns[0] && row.hasChildren) {
                            const level = row.level || 0;
                            const expandIconX = TableSizes.columnTextHSpace + level * TableSizes.layerLineWidth - 12;
                            
                            if (localX - colX >= expandIconX && localX - colX < expandIconX + 12) {
                                this.toggleExpand(row.id);
                            }
                        }
                        break;
                    }
                    colX += column.width;
                }

                this.invalidate();
            }
        }

        // Клик в заголовке для сортировки
        if (this._showHeader && localY < this._headerHeight) {
            const visibleColumns = this.getVisibleColumns();
            let colX = -this._scrollLeft;
            
            for (const column of visibleColumns) {
                if (localX >= colX && localX < colX + column.width) {
                    if (column.sortable) {
                        // Переключить сортировку
                        if (column.sortDirection === 'asc') {
                            column.sortDirection = 'desc';
                        } else if (column.sortDirection === 'desc') {
                            column.sortDirection = null;
                        } else {
                            // Сбросить сортировку других колонок
                            visibleColumns.forEach(c => c.sortDirection = null);
                            column.sortDirection = 'asc';
                        }
                        this.invalidate();
                    }
                    break;
                }
                colX += column.width;
            }
        }
    }

    /**
     * Обработка двойного клика
     */
    onDoubleClick(x: number, y: number): void {
        // Можно добавить обработку двойного клика для редактирования
    }

    /**
     * Обработка колеса мыши
     */
    onWheel(deltaY: number): void {
        this.scrollTop += deltaY;
    }
}
