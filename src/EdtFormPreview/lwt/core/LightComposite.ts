/**
 * Контейнер контролов
 * Порт из com._1c.g5.lwt.LightComposite
 */
import { Rectangle, Point } from '../geometry';
import { ILightControl, ILightComposite, ILightLayout } from './interfaces';
import { LightControl } from './LightControl';

/**
 * Контейнер для группировки контролов
 */
export class LightComposite extends LightControl implements ILightComposite {
    protected _children: ILightControl[] = [];
    protected _layout: ILightLayout | null = null;

    constructor() {
        super();
    }

    /**
     * Возвращает дочерние контролы
     */
    getChildren(): readonly ILightControl[] {
        return this._children;
    }

    /**
     * Добавляет дочерний контрол
     */
    addChild(child: ILightControl, index?: number): void {
        if (child.parent === this) {
            return;
        }

        // Удаляем из старого родителя
        if (child.parent) {
            child.parent.removeChild(child);
        }

        // Добавляем
        if (index !== undefined && index >= 0 && index < this._children.length) {
            this._children.splice(index, 0, child);
        } else {
            this._children.push(child);
        }

        child.parent = this;
    }

    /**
     * Удаляет дочерний контрол
     */
    removeChild(child: ILightControl): void;
    removeChild(index: number): void;
    removeChild(childOrIndex: ILightControl | number): void {
        if (typeof childOrIndex === 'number') {
            if (childOrIndex >= 0 && childOrIndex < this._children.length) {
                const child = this._children[childOrIndex];
                this._children.splice(childOrIndex, 1);
                child.parent = null;
            }
        } else {
            const index = this._children.indexOf(childOrIndex);
            if (index >= 0) {
                this._children.splice(index, 1);
                childOrIndex.parent = null;
            }
        }
    }

    /**
     * Возвращает количество дочерних контролов
     */
    getChildCount(): number {
        return this._children.length;
    }

    /**
     * Возвращает дочерний контрол по индексу
     */
    getChild(index: number): ILightControl | null {
        if (index >= 0 && index < this._children.length) {
            return this._children[index];
        }
        return null;
    }

    /**
     * Возвращает layout
     */
    getLayout(): ILightLayout | null {
        return this._layout;
    }

    /**
     * Устанавливает layout
     */
    setLayout(layout: ILightLayout | null): void {
        this._layout = layout;
    }

    /**
     * Выполняет layout
     */
    layout(changed: boolean = true): void {
        if (this._layout) {
            this._layout.layout(this, changed);
        }
    }

    /**
     * Находит контрол в указанной точке
     */
    findControlAt(x: number, y: number): ILightControl | null {
        // Ищем в обратном порядке (верхние контролы первыми)
        for (let i = this._children.length - 1; i >= 0; i--) {
            const child = this._children[i];
            
            if (!child.isVisible()) {
                continue;
            }

            const bounds = child.getBounds();
            const localX = x - bounds.x;
            const localY = y - bounds.y;

            if (bounds.contains(x, y)) {
                // Если это тоже композит - ищем глубже
                if ('findControlAt' in child) {
                    const found = (child as ILightComposite).findControlAt(localX, localY);
                    if (found) {
                        return found;
                    }
                }
                return child;
            }
        }

        // Если точка внутри нашего bounds - возвращаем себя
        if (this._bounds.contains(x, y)) {
            return this;
        }

        return null;
    }

    /**
     * Вычисляет предпочтительный размер
     */
    computePreferredSize(wHint: number, hHint: number): Point {
        if (this._layout) {
            return this._layout.computeSize(this, wHint, hHint, true);
        }
        return super.computePreferredSize(wHint, hHint);
    }

    /**
     * Отрисовывает контейнер и все дочерние контролы
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.shouldPaint(clip)) {
            return;
        }

        // Отрисовываем фон (если нужно)
        this.paintBackground(ctx, clip);

        // Отрисовываем дочерние контролы
        this.paintChildren(ctx, clip);

        // Отрисовываем рамку (если нужно)
        this.paintBorder(ctx, clip);
    }

    /**
     * Отрисовывает фон
     */
    protected paintBackground(_ctx: CanvasRenderingContext2D, _clip: Rectangle): void {
        // По умолчанию ничего не рисуем - контейнер прозрачный
    }

    /**
     * Отрисовывает рамку
     */
    protected paintBorder(_ctx: CanvasRenderingContext2D, _clip: Rectangle): void {
        // По умолчанию ничего не рисуем
    }

    /**
     * Отрисовывает дочерние контролы
     */
    protected paintChildren(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        console.log('[PAINT] paintChildren called, children:', this._children.length, 'clip:', clip.toString());
        
        for (const child of this._children) {
            if (!child.isVisible()) {
                console.log('[PAINT] child not visible:', (child as any).constructor?.name);
                continue;
            }

            const bounds = child.getBounds();
            console.log('[PAINT] child bounds:', bounds.toString(), 'constructor:', (child as any).constructor?.name);
            
            // Пересчитываем clip для дочернего контрола
            const childClip = clip.intersection(bounds);
            if (childClip.isEmpty()) {
                console.log('[PAINT] childClip is empty, skipping');
                continue;
            }

            // НЕ делаем translate - контролы рисуют в своих абсолютных координатах
            console.log('[PAINT] painting child with clip:', childClip.toString());
            child.paint(ctx, childClip);
        }
    }

    /**
     * Уничтожает контейнер и все дочерние контролы
     */
    dispose(): void {
        if (this._disposed) {
            return;
        }

        // Уничтожаем детей
        for (const child of [...this._children]) {
            child.dispose();
        }
        this._children = [];

        super.dispose();
    }
}
