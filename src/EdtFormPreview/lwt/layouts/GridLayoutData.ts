/**
 * Данные layout для контрола в GridLayout
 */
export class GridLayoutData {
    /**
     * Количество занимаемых колонок
     */
    horizontalSpan: number = 1;

    /**
     * Количество занимаемых строк
     */
    verticalSpan: number = 1;

    /**
     * Выравнивание по горизонтали (SWT.BEGINNING, SWT.CENTER, SWT.END, SWT.FILL)
     */
    horizontalAlignment: number = GridLayoutData.FILL;

    /**
     * Выравнивание по вертикали
     */
    verticalAlignment: number = GridLayoutData.CENTER;

    /**
     * Захватывать лишнее горизонтальное пространство
     */
    grabExcessHorizontalSpace: boolean = false;

    /**
     * Захватывать лишнее вертикальное пространство
     */
    grabExcessVerticalSpace: boolean = false;

    /**
     * Фиксированная ширина (-1 = авто)
     */
    widthHint: number = -1;

    /**
     * Фиксированная высота (-1 = авто)
     */
    heightHint: number = -1;

    /**
     * Минимальная ширина
     */
    minimumWidth: number = 0;

    /**
     * Минимальная высота
     */
    minimumHeight: number = 0;

    /**
     * Горизонтальный отступ
     */
    horizontalIndent: number = 0;

    /**
     * Вертикальный отступ
     */
    verticalIndent: number = 0;

    /**
     * Исключить из layout
     */
    exclude: boolean = false;

    // Константы выравнивания
    static readonly BEGINNING = 1;
    static readonly CENTER = 2;
    static readonly END = 3;
    static readonly FILL = 4;

    constructor(options?: Partial<GridLayoutData>) {
        if (options) {
            Object.assign(this, options);
        }
    }

    /**
     * Создаёт GridLayoutData заполняющий ячейку
     */
    static fill(): GridLayoutData {
        const data = new GridLayoutData();
        data.horizontalAlignment = GridLayoutData.FILL;
        data.verticalAlignment = GridLayoutData.FILL;
        data.grabExcessHorizontalSpace = true;
        data.grabExcessVerticalSpace = true;
        return data;
    }

    /**
     * Создаёт GridLayoutData заполняющий горизонтально
     */
    static fillHorizontal(): GridLayoutData {
        const data = new GridLayoutData();
        data.horizontalAlignment = GridLayoutData.FILL;
        data.grabExcessHorizontalSpace = true;
        return data;
    }

    /**
     * Создаёт GridLayoutData заполняющий вертикально
     */
    static fillVertical(): GridLayoutData {
        const data = new GridLayoutData();
        data.verticalAlignment = GridLayoutData.FILL;
        data.grabExcessVerticalSpace = true;
        return data;
    }
}
