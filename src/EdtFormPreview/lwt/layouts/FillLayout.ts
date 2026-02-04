/**
 * Fill Layout - заполняет всё пространство равномерно
 */
import { Point } from '../geometry';
import { ILightComposite, ILightLayout, ILightControl } from '../core';

/**
 * Layout заполняющий всё пространство контейнера
 * Все дети получают одинаковый размер
 */
export class FillLayout implements ILightLayout {
    /**
     * Тип раскладки (HORIZONTAL = 256, VERTICAL = 512)
     */
    type: number = 256;

    /**
     * Отступ от краёв
     */
    marginWidth: number = 0;
    marginHeight: number = 0;

    /**
     * Расстояние между элементами
     */
    spacing: number = 0;

    constructor(type: number = 256) {
        this.type = type;
    }

    /**
     * Вычисляет размер контейнера
     */
    computeSize(composite: ILightComposite, wHint: number, hHint: number, _flushCache: boolean): Point {
        const children = this.getVisibleChildren(composite);
        const count = children.length;

        if (count === 0) {
            if (wHint !== -1 && hHint !== -1) {
                return new Point(wHint, hHint);
            }
            return new Point(
                this.marginWidth * 2,
                this.marginHeight * 2
            );
        }

        // Находим максимальный предпочтительный размер детей
        let maxWidth = 0;
        let maxHeight = 0;

        for (const child of children) {
            const size = child.computePreferredSize(-1, -1);
            maxWidth = Math.max(maxWidth, size.x);
            maxHeight = Math.max(maxHeight, size.y);
        }

        if (this.type === 256) { // HORIZONTAL
            const width = count * maxWidth + (count - 1) * this.spacing + this.marginWidth * 2;
            const height = maxHeight + this.marginHeight * 2;
            return new Point(
                wHint !== -1 ? wHint : width,
                hHint !== -1 ? hHint : height
            );
        } else { // VERTICAL
            const width = maxWidth + this.marginWidth * 2;
            const height = count * maxHeight + (count - 1) * this.spacing + this.marginHeight * 2;
            return new Point(
                wHint !== -1 ? wHint : width,
                hHint !== -1 ? hHint : height
            );
        }
    }

    /**
     * Размещает дочерние элементы
     */
    layout(composite: ILightComposite, _flushCache: boolean): void {
        const bounds = composite.getBounds();
        const children = this.getVisibleChildren(composite);
        const count = children.length;

        if (count === 0) {
            return;
        }

        const clientWidth = bounds.width - this.marginWidth * 2;
        const clientHeight = bounds.height - this.marginHeight * 2;

        if (this.type === 256) { // HORIZONTAL
            const totalSpacing = (count - 1) * this.spacing;
            const childWidth = Math.floor((clientWidth - totalSpacing) / count);
            let x = this.marginWidth;
            const y = this.marginHeight;

            for (let i = 0; i < count; i++) {
                const child = children[i];
                // Последний ребёнок получает оставшееся пространство
                const w = i === count - 1 
                    ? bounds.width - this.marginWidth - x 
                    : childWidth;
                
                child.setBounds(x, y, w, clientHeight);
                x += childWidth + this.spacing;
            }
        } else { // VERTICAL
            const totalSpacing = (count - 1) * this.spacing;
            const childHeight = Math.floor((clientHeight - totalSpacing) / count);
            const x = this.marginWidth;
            let y = this.marginHeight;

            for (let i = 0; i < count; i++) {
                const child = children[i];
                // Последний ребёнок получает оставшееся пространство
                const h = i === count - 1 
                    ? bounds.height - this.marginHeight - y 
                    : childHeight;
                
                child.setBounds(x, y, clientWidth, h);
                y += childHeight + this.spacing;
            }
        }

        // Рекурсивно layout для дочерних композитов
        for (const child of children) {
            if ('layout' in child && typeof (child as ILightComposite).layout === 'function') {
                (child as ILightComposite).layout();
            }
        }
    }

    /**
     * Получает видимые дочерние элементы
     */
    private getVisibleChildren(composite: ILightComposite): ILightControl[] {
        const result: ILightControl[] = [];
        
        for (const child of composite.getChildren()) {
            if (child.isVisible()) {
                result.push(child);
            }
        }
        
        return result;
    }
}
