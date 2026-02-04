/**
 * Grid Layout - сеточное расположение элементов
 * Порт из org.eclipse.swt.layout.GridLayout
 */
import { Point } from '../geometry';
import { ILightComposite, ILightLayout, ILightControl } from '../core';
import { GridLayoutData } from './GridLayoutData';

/**
 * Layout для сеточного расположения контролов
 */
export class GridLayout implements ILightLayout {
    /**
     * Количество колонок
     */
    numColumns: number = 1;

    /**
     * Делать колонки одинаковой ширины
     */
    makeColumnsEqualWidth: boolean = false;

    /**
     * Отступ от краёв
     */
    marginWidth: number = 5;
    marginHeight: number = 5;

    /**
     * Дополнительные отступы
     */
    marginLeft: number = 0;
    marginTop: number = 0;
    marginRight: number = 0;
    marginBottom: number = 0;

    /**
     * Расстояние между элементами
     */
    horizontalSpacing: number = 5;
    verticalSpacing: number = 5;

    constructor(numColumns: number = 1, makeColumnsEqualWidth: boolean = false) {
        this.numColumns = numColumns;
        this.makeColumnsEqualWidth = makeColumnsEqualWidth;
    }

    /**
     * Вычисляет размер контейнера
     */
    computeSize(composite: ILightComposite, wHint: number, hHint: number, flushCache: boolean): Point {
        const size = this.layoutInternal(composite, false, 0, 0, wHint, hHint, flushCache);
        
        if (wHint !== -1) {
            size.x = wHint;
        }
        if (hHint !== -1) {
            size.y = hHint;
        }
        return size;
    }

    /**
     * Размещает дочерние элементы
     */
    layout(composite: ILightComposite, flushCache: boolean): void {
        const bounds = composite.getBounds();
        this.layoutInternal(composite, true, 0, 0, bounds.width, bounds.height, flushCache);

        // Рекурсивно layout для дочерних композитов
        for (const child of composite.getChildren()) {
            if ('layout' in child && typeof (child as ILightComposite).layout === 'function') {
                (child as ILightComposite).layout();
            }
        }
    }

    /**
     * Внутренняя логика layout
     */
    private layoutInternal(
        composite: ILightComposite,
        move: boolean,
        x: number,
        y: number,
        width: number,
        height: number,
        flushCache: boolean
    ): Point {
        const children = this.getVisibleChildren(composite);
        const count = children.length;

        if (count === 0) {
            return new Point(
                this.marginLeft + this.marginWidth * 2 + this.marginRight,
                this.marginTop + this.marginHeight * 2 + this.marginBottom
            );
        }

        // Вычисляем grid
        const grid = this.buildGrid(children);
        const rowCount = grid.length;
        const colCount = this.numColumns;

        // Вычисляем размеры ячеек
        const colWidths = new Array<number>(colCount).fill(0);
        const rowHeights = new Array<number>(rowCount).fill(0);

        // Первый проход - определяем минимальные размеры
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const child = grid[row][col];
                if (!child) continue;

                const data = this.getLayoutData(child);
                if (data.horizontalSpan > 1 || data.verticalSpan > 1) {
                    continue; // Обрабатываем span отдельно
                }

                const size = this.computeChildSize(child, data, flushCache);
                colWidths[col] = Math.max(colWidths[col], size.x);
                rowHeights[row] = Math.max(rowHeights[row], size.y);
            }
        }

        // Выравниваем колонки если нужно
        if (this.makeColumnsEqualWidth) {
            const maxWidth = Math.max(...colWidths);
            for (let i = 0; i < colCount; i++) {
                colWidths[i] = maxWidth;
            }
        }

        // Вычисляем общий размер
        const totalWidth = this.marginLeft + this.marginWidth + 
            colWidths.reduce((a, b) => a + b, 0) + 
            (colCount - 1) * this.horizontalSpacing + 
            this.marginWidth + this.marginRight;

        const totalHeight = this.marginTop + this.marginHeight + 
            rowHeights.reduce((a, b) => a + b, 0) + 
            (rowCount - 1) * this.verticalSpacing + 
            this.marginHeight + this.marginBottom;

        // Размещаем элементы если нужно
        if (move) {
            // Распределяем лишнее пространство
            this.distributeExtraSpace(children, grid, colWidths, rowHeights, width, height);

            // Размещаем детей
            let currentY = this.marginTop + this.marginHeight;
            
            for (let row = 0; row < rowCount; row++) {
                let currentX = this.marginLeft + this.marginWidth;
                
                for (let col = 0; col < colCount; col++) {
                    const child = grid[row][col];
                    if (!child) {
                        currentX += colWidths[col] + this.horizontalSpacing;
                        continue;
                    }

                    // Проверяем что это первая ячейка для элемента со span
                    if (!this.isFirstCell(grid, row, col, child)) {
                        currentX += colWidths[col] + this.horizontalSpacing;
                        continue;
                    }

                    const data = this.getLayoutData(child);
                    
                    // Вычисляем размер ячейки с учётом span
                    let cellWidth = 0;
                    for (let s = 0; s < data.horizontalSpan && col + s < colCount; s++) {
                        cellWidth += colWidths[col + s];
                        if (s > 0) cellWidth += this.horizontalSpacing;
                    }

                    let cellHeight = 0;
                    for (let s = 0; s < data.verticalSpan && row + s < rowCount; s++) {
                        cellHeight += rowHeights[row + s];
                        if (s > 0) cellHeight += this.verticalSpacing;
                    }

                    // Позиционируем элемент в ячейке
                    const prefSize = this.computeChildSize(child, data, false);
                    const { x: childX, width: childWidth } = this.alignHorizontal(
                        currentX + data.horizontalIndent, 
                        cellWidth - data.horizontalIndent, 
                        prefSize.x, 
                        data
                    );
                    const { y: childY, height: childHeight } = this.alignVertical(
                        currentY + data.verticalIndent, 
                        cellHeight - data.verticalIndent, 
                        prefSize.y, 
                        data
                    );

                    child.setBounds(childX, childY, childWidth, childHeight);
                    currentX += colWidths[col] + this.horizontalSpacing;
                }
                
                currentY += rowHeights[row] + this.verticalSpacing;
            }
        }

        return new Point(totalWidth, totalHeight);
    }

    /**
     * Строит сетку из детей
     */
    private buildGrid(children: ILightControl[]): (ILightControl | null)[][] {
        const grid: (ILightControl | null)[][] = [];
        let row = 0;
        let col = 0;

        // Инициализируем первую строку
        grid.push(new Array(this.numColumns).fill(null));

        for (const child of children) {
            const data = this.getLayoutData(child);
            const hSpan = Math.min(data.horizontalSpan, this.numColumns);
            const vSpan = data.verticalSpan;

            // Ищем место для элемента
            while (true) {
                // Переходим на новую строку если нужно
                if (col + hSpan > this.numColumns) {
                    row++;
                    col = 0;
                    if (row >= grid.length) {
                        grid.push(new Array(this.numColumns).fill(null));
                    }
                }

                // Пропускаем занятые ячейки
                if (grid[row][col] !== null) {
                    col++;
                    continue;
                }

                // Проверяем что все нужные ячейки свободны
                let canPlace = true;
                for (let c = col; c < col + hSpan && canPlace; c++) {
                    for (let r = row; r < row + vSpan && canPlace; r++) {
                        if (r >= grid.length) {
                            grid.push(new Array(this.numColumns).fill(null));
                        }
                        if (grid[r][c] !== null) {
                            canPlace = false;
                        }
                    }
                }

                if (canPlace) {
                    // Размещаем элемент
                    for (let c = col; c < col + hSpan; c++) {
                        for (let r = row; r < row + vSpan; r++) {
                            grid[r][c] = child;
                        }
                    }
                    col += hSpan;
                    break;
                } else {
                    col++;
                }
            }
        }

        return grid;
    }

    /**
     * Проверяет что это первая ячейка для элемента
     */
    private isFirstCell(grid: (ILightControl | null)[][], row: number, col: number, child: ILightControl): boolean {
        // Проверяем есть ли этот элемент левее или выше
        if (col > 0 && grid[row][col - 1] === child) return false;
        if (row > 0 && grid[row - 1][col] === child) return false;
        return true;
    }

    /**
     * Получает LayoutData для контрола
     */
    private getLayoutData(control: ILightControl): GridLayoutData {
        const data = control.layoutData;
        if (data instanceof GridLayoutData) {
            return data;
        }
        return new GridLayoutData();
    }

    /**
     * Вычисляет предпочтительный размер контрола
     */
    private computeChildSize(control: ILightControl, data: GridLayoutData, _flushCache: boolean): Point {
        let wHint = data.widthHint;
        let hHint = data.heightHint;
        const size = control.computePreferredSize(wHint, hHint);
        
        if (data.widthHint !== -1) {
            size.x = data.widthHint;
        }
        if (data.heightHint !== -1) {
            size.y = data.heightHint;
        }
        
        size.x = Math.max(size.x, data.minimumWidth);
        size.y = Math.max(size.y, data.minimumHeight);
        
        return size;
    }

    /**
     * Распределяет лишнее пространство
     */
    private distributeExtraSpace(
        children: ILightControl[],
        grid: (ILightControl | null)[][],
        colWidths: number[],
        rowHeights: number[],
        width: number,
        height: number
    ): void {
        // Находим колонки и строки которые хотят расти
        const growCols: number[] = [];
        const growRows: number[] = [];

        for (const child of children) {
            const data = this.getLayoutData(child);
            if (data.grabExcessHorizontalSpace) {
                // Находим колонку для этого элемента
                for (let row = 0; row < grid.length; row++) {
                    for (let col = 0; col < this.numColumns; col++) {
                        if (grid[row][col] === child && !growCols.includes(col)) {
                            growCols.push(col);
                        }
                    }
                }
            }
            if (data.grabExcessVerticalSpace) {
                for (let row = 0; row < grid.length; row++) {
                    for (let col = 0; col < this.numColumns; col++) {
                        if (grid[row][col] === child && !growRows.includes(row)) {
                            growRows.push(row);
                        }
                    }
                }
            }
        }

        // Распределяем лишнее горизонтальное пространство
        if (growCols.length > 0) {
            const currentWidth = this.marginLeft + this.marginWidth + 
                colWidths.reduce((a, b) => a + b, 0) + 
                (this.numColumns - 1) * this.horizontalSpacing + 
                this.marginWidth + this.marginRight;
            
            const extraWidth = width - currentWidth;
            if (extraWidth > 0) {
                const perCol = Math.floor(extraWidth / growCols.length);
                for (const col of growCols) {
                    colWidths[col] += perCol;
                }
            }
        }

        // Распределяем лишнее вертикальное пространство
        if (growRows.length > 0) {
            const currentHeight = this.marginTop + this.marginHeight + 
                rowHeights.reduce((a, b) => a + b, 0) + 
                (grid.length - 1) * this.verticalSpacing + 
                this.marginHeight + this.marginBottom;
            
            const extraHeight = height - currentHeight;
            if (extraHeight > 0) {
                const perRow = Math.floor(extraHeight / growRows.length);
                for (const row of growRows) {
                    rowHeights[row] += perRow;
                }
            }
        }
    }

    /**
     * Выравнивает по горизонтали
     */
    private alignHorizontal(
        cellX: number, 
        cellWidth: number, 
        prefWidth: number, 
        data: GridLayoutData
    ): { x: number; width: number } {
        switch (data.horizontalAlignment) {
            case GridLayoutData.BEGINNING:
                return { x: cellX, width: prefWidth };
            case GridLayoutData.CENTER:
                return { x: cellX + (cellWidth - prefWidth) / 2, width: prefWidth };
            case GridLayoutData.END:
                return { x: cellX + cellWidth - prefWidth, width: prefWidth };
            case GridLayoutData.FILL:
            default:
                return { x: cellX, width: cellWidth };
        }
    }

    /**
     * Выравнивает по вертикали
     */
    private alignVertical(
        cellY: number, 
        cellHeight: number, 
        prefHeight: number, 
        data: GridLayoutData
    ): { y: number; height: number } {
        switch (data.verticalAlignment) {
            case GridLayoutData.BEGINNING:
                return { y: cellY, height: prefHeight };
            case GridLayoutData.CENTER:
                return { y: cellY + (cellHeight - prefHeight) / 2, height: prefHeight };
            case GridLayoutData.END:
                return { y: cellY + cellHeight - prefHeight, height: prefHeight };
            case GridLayoutData.FILL:
            default:
                return { y: cellY, height: cellHeight };
        }
    }

    /**
     * Получает видимые дочерние элементы
     */
    private getVisibleChildren(composite: ILightComposite): ILightControl[] {
        const result: ILightControl[] = [];
        
        for (const child of composite.getChildren()) {
            if (!child.isVisible()) {
                continue;
            }
            
            const data = child.layoutData;
            if (data instanceof GridLayoutData && data.exclude) {
                continue;
            }
            
            result.push(child);
        }
        
        return result;
    }
}
