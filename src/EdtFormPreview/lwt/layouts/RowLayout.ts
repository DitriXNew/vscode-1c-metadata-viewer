/**
 * Row Layout - горизонтальное или вертикальное расположение элементов
 * Порт из com._1c.g5.lwt.layouts.LightRowLayout
 */
import { Point } from '../geometry';
import { ILightComposite, ILightLayout, ILightControl } from '../core';
import { RowLayoutData } from './RowLayoutData';

/**
 * Тип раскладки
 */
export const LayoutType = {
    HORIZONTAL: 256,
    VERTICAL: 512
} as const;

/**
 * Layout для горизонтального или вертикального расположения контролов
 */
export class RowLayout implements ILightLayout {
    /**
     * Тип раскладки (HORIZONTAL = 256, VERTICAL = 512)
     */
    type: number = LayoutType.HORIZONTAL;

    /**
     * Отступ от краёв по горизонтали
     */
    marginWidth: number = 3;

    /**
     * Отступ от краёв по вертикали
     */
    marginHeight: number = 3;

    /**
     * Расстояние между элементами
     */
    spacing: number = 3;

    /**
     * Переносить ли элементы на новую строку/столбец
     */
    wrap: boolean = true;

    /**
     * Упаковывать (использовать предпочтительный размер каждого элемента)
     */
    pack: boolean = true;

    /**
     * Заполнять ли элементы по высоте/ширине
     */
    fill: boolean = false;

    /**
     * Центрировать по вторичной оси
     */
    center: boolean = false;

    /**
     * Равномерно распределять пространство
     */
    justify: boolean = false;

    /**
     * Дополнительные отступы
     */
    marginLeft: number = 0;
    marginTop: number = 0;
    marginRight: number = 0;
    marginBottom: number = 0;

    constructor(type: number = LayoutType.HORIZONTAL) {
        this.type = type;
    }

    /**
     * Вычисляет размер контейнера
     */
    computeSize(composite: ILightComposite, wHint: number, hHint: number, flushCache: boolean): Point {
        const isHorizontal = this.type === LayoutType.HORIZONTAL;
        
        const extent = isHorizontal
            ? this.layoutHorizontal(composite, false, wHint !== -1 && this.wrap, wHint, flushCache)
            : this.layoutVertical(composite, false, hHint !== -1 && this.wrap, hHint, flushCache);

        if (wHint !== -1) {
            extent.x = wHint;
        }
        if (hHint !== -1) {
            extent.y = hHint;
        }
        return extent;
    }

    /**
     * Размещает дочерние элементы
     */
    layout(composite: ILightComposite, flushCache: boolean): void {
        const bounds = composite.getBounds();
        const width = bounds.width;
        const height = bounds.height;

        if (this.type === LayoutType.HORIZONTAL) {
            this.layoutHorizontal(composite, true, this.wrap, width, flushCache);
        } else {
            this.layoutVertical(composite, true, this.wrap, height, flushCache);
        }

        // Рекурсивно layout для дочерних композитов
        for (const child of composite.getChildren()) {
            if ('layout' in child && typeof (child as ILightComposite).layout === 'function') {
                (child as ILightComposite).layout();
            }
        }
    }

    /**
     * Вычисляет предпочтительный размер контрола
     */
    private computeChildSize(control: ILightControl, _flushCache: boolean): Point {
        let wHint = -1;
        let hHint = -1;

        const data = control.layoutData as RowLayoutData;
        if (data) {
            wHint = data.width;
            hHint = data.height;
        }

        return control.computePreferredSize(wHint, hHint);
    }

    /**
     * Горизонтальная раскладка
     */
    private layoutHorizontal(
        composite: ILightComposite,
        move: boolean,
        wrap: boolean,
        width: number,
        flushCache: boolean
    ): Point {
        // Получаем видимые дети
        const children = this.getVisibleChildren(composite);
        const count = children.length;

        if (count === 0) {
            return new Point(
                this.marginLeft + this.marginWidth * 2 + this.marginRight,
                this.marginTop + this.marginHeight * 2 + this.marginBottom
            );
        }

        // Вычисляем размеры детей
        let maxHeight = 0;
        const sizes: Point[] = [];

        for (const child of children) {
            const size = this.computeChildSize(child, flushCache);
            sizes.push(size);
            if (!this.pack) {
                maxHeight = Math.max(maxHeight, size.y);
            }
        }

        // Размещаем детей
        let x = this.marginLeft + this.marginWidth;
        let y = this.marginTop + this.marginHeight;
        let maxX = 0;
        let rowMaxHeight = 0;

        for (let i = 0; i < count; i++) {
            const child = children[i];
            const size = sizes[i];
            const childWidth = size.x;
            const childHeight = size.y;

            // Проверяем перенос
            if (wrap && i !== 0 && x + childWidth > width) {
                x = this.marginLeft + this.marginWidth;
                y += this.spacing + rowMaxHeight;
                rowMaxHeight = 0;
            }

            if (this.pack || this.fill || this.center) {
                rowMaxHeight = Math.max(rowMaxHeight, childHeight);
            }

            if (move) {
                const finalHeight = this.fill ? rowMaxHeight : childHeight;
                const finalY = this.center ? y + (rowMaxHeight - childHeight) / 2 : y;
                
                child.setBounds(x, finalY, childWidth, finalHeight);
            }

            x += childWidth + this.spacing;
            maxX = Math.max(maxX, x);
        }

        maxX = Math.max(this.marginLeft + this.marginWidth, maxX - this.spacing);
        maxX += this.marginRight + this.marginWidth;

        const totalHeight = y + rowMaxHeight + this.marginBottom + this.marginHeight;

        return new Point(maxX, totalHeight);
    }

    /**
     * Вертикальная раскладка
     */
    private layoutVertical(
        composite: ILightComposite,
        move: boolean,
        wrap: boolean,
        height: number,
        flushCache: boolean
    ): Point {
        // Получаем видимые дети
        const children = this.getVisibleChildren(composite);
        const count = children.length;

        if (count === 0) {
            return new Point(
                this.marginLeft + this.marginWidth * 2 + this.marginRight,
                this.marginTop + this.marginHeight * 2 + this.marginBottom
            );
        }

        // Вычисляем размеры детей
        let maxWidth = 0;
        const sizes: Point[] = [];

        for (const child of children) {
            const size = this.computeChildSize(child, flushCache);
            sizes.push(size);
            if (!this.pack) {
                maxWidth = Math.max(maxWidth, size.x);
            }
        }

        // Размещаем детей
        let x = this.marginLeft + this.marginWidth;
        let y = this.marginTop + this.marginHeight;
        let maxY = 0;
        let colMaxWidth = 0;

        for (let i = 0; i < count; i++) {
            const child = children[i];
            const size = sizes[i];
            const childWidth = size.x;
            const childHeight = size.y;

            // Проверяем перенос
            if (wrap && i !== 0 && y + childHeight > height) {
                y = this.marginTop + this.marginHeight;
                x += this.spacing + colMaxWidth;
                colMaxWidth = 0;
            }

            if (this.pack || this.fill || this.center) {
                colMaxWidth = Math.max(colMaxWidth, childWidth);
            }

            if (move) {
                const finalWidth = this.fill ? colMaxWidth : childWidth;
                const finalX = this.center ? x + (colMaxWidth - childWidth) / 2 : x;
                
                child.setBounds(finalX, y, finalWidth, childHeight);
            }

            y += childHeight + this.spacing;
            maxY = Math.max(maxY, y);
        }

        maxY = Math.max(this.marginTop + this.marginHeight, maxY - this.spacing);
        maxY += this.marginBottom + this.marginHeight;

        const totalWidth = x + colMaxWidth + this.marginRight + this.marginWidth;

        return new Point(totalWidth, maxY);
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
            
            const data = child.layoutData as RowLayoutData;
            if (data?.exclude) {
                continue;
            }
            
            result.push(child);
        }
        
        return result;
    }
}
