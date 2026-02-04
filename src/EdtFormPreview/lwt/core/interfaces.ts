/**
 * Интерфейс легковесного контрола
 * Порт из com._1c.g5.lwt.ILightControl
 */
import { Rectangle, Point } from '../geometry';

/**
 * Базовый интерфейс для всех контролов LWT
 */
export interface ILightControl {
    /**
     * Уникальный идентификатор контрола
     */
    readonly id: string;

    /**
     * Родительский контрол
     */
    parent: ILightComposite | null;

    /**
     * Отрисовывает контрол на canvas
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void;

    /**
     * Возвращает границы контрола
     */
    getBounds(): Rectangle;

    /**
     * Устанавливает границы контрола
     */
    setBounds(bounds: Rectangle): void;
    setBounds(x: number, y: number, width: number, height: number): void;

    /**
     * Возвращает позицию контрола
     */
    getLocation(): Point;

    /**
     * Устанавливает позицию контрола
     */
    setLocation(x: number, y: number): void;
    setLocation(point: Point): void;

    /**
     * Возвращает размер контрола
     */
    getSize(): Point;

    /**
     * Устанавливает размер контрола
     */
    setSize(width: number, height: number): void;
    setSize(size: Point): void;

    /**
     * Виден ли контрол
     */
    isVisible(): boolean;

    /**
     * Устанавливает видимость
     */
    setVisible(visible: boolean): void;

    /**
     * Доступен ли контрол
     */
    isEnabled(): boolean;

    /**
     * Устанавливает доступность
     */
    setEnabled(enabled: boolean): void;

    /**
     * Вычисляет предпочтительный размер контрола
     */
    computePreferredSize(wHint: number, hHint: number): Point;

    /**
     * Содержит ли контрол точку
     */
    contains(x: number, y: number): boolean;
    contains(point: Point): boolean;

    /**
     * Преобразует координаты из экранных в локальные
     */
    toControl(x: number, y: number): Point;
    toControl(point: Point): Point;

    /**
     * Преобразует координаты из локальных в экранные
     */
    toDisplay(x: number, y: number): Point;
    toDisplay(point: Point): Point;

    /**
     * Помечает контрол для перерисовки
     */
    redraw(): void;

    /**
     * Помечает область для перерисовки
     */
    redraw(x: number, y: number, width: number, height: number): void;

    /**
     * Уничтожает контрол и освобождает ресурсы
     */
    dispose(): void;

    /**
     * Проверяет, уничтожен ли контрол
     */
    isDisposed(): boolean;

    /**
     * Данные layout для этого контрола
     */
    layoutData: any;

    /**
     * Подсказка (tooltip)
     */
    tooltip: string | null;
}

/**
 * Интерфейс контейнера контролов
 * Порт из com._1c.g5.lwt.ILightComposite
 */
export interface ILightComposite extends ILightControl {
    /**
     * Возвращает дочерние контролы
     */
    getChildren(): readonly ILightControl[];

    /**
     * Добавляет дочерний контрол
     */
    addChild(child: ILightControl, index?: number): void;

    /**
     * Удаляет дочерний контрол
     */
    removeChild(child: ILightControl): void;

    /**
     * Удаляет дочерний контрол по индексу
     */
    removeChild(index: number): void;

    /**
     * Возвращает количество дочерних контролов
     */
    getChildCount(): number;

    /**
     * Возвращает дочерний контрол по индексу
     */
    getChild(index: number): ILightControl | null;

    /**
     * Возвращает layout
     */
    getLayout(): ILightLayout | null;

    /**
     * Устанавливает layout
     */
    setLayout(layout: ILightLayout | null): void;

    /**
     * Выполняет layout
     */
    layout(changed?: boolean): void;

    /**
     * Находит контрол в указанной точке
     */
    findControlAt(x: number, y: number): ILightControl | null;
}

/**
 * Интерфейс layout менеджера
 * Порт из com._1c.g5.lwt.layouts.ILightLayout
 */
export interface ILightLayout {
    /**
     * Вычисляет размер контейнера на основе дочерних элементов
     */
    computeSize(composite: ILightComposite, wHint: number, hHint: number, flushCache: boolean): Point;

    /**
     * Размещает дочерние элементы в контейнере
     */
    layout(composite: ILightComposite, flushCache: boolean): void;
}
