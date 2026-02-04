/**
 * FormFieldWrapper - контейнер для поля формы с заголовком
 * По мотивам структуры EDT: Label слева/сверху + Control поля
 * 
 * TitleLocation:
 * - Left: [Label:] [Control]
 * - Top: [Label]
 *        [Control]
 * - Right: [Control] [Label:]
 * - Bottom: [Control]
 *           [Label]
 * - None: [Control]
 */

import { LightComposite } from '../core/LightComposite';
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Point } from '../geometry/Point';
import { getTheme, Color, Font } from '../theme';
import { LabelControl, HorizontalAlignment } from './LabelControl';

/**
 * Расположение заголовка поля
 */
export enum TitleLocation {
    None = 'None',
    Left = 'Left',
    Top = 'Top',
    Right = 'Right',
    Bottom = 'Bottom',
    Auto = 'Auto'
}

/**
 * Контейнер поля формы с заголовком
 */
export class FormFieldWrapper extends LightComposite {
    private _titleLocation: TitleLocation = TitleLocation.Left;
    private _title: string = '';
    private _titleWidth: number = 80;  // Фиксированная ширина заголовка
    private _labelControl: LabelControl;
    private _fieldControl: LightControl | null = null;
    private _spacing: number = 4;

    constructor() {
        super();
        this._labelControl = new LabelControl();
        this._labelControl.horizontalAlignment = HorizontalAlignment.Right;
        this.addChild(this._labelControl);
    }

    /**
     * Расположение заголовка
     */
    get titleLocation(): TitleLocation {
        return this._titleLocation;
    }

    set titleLocation(value: TitleLocation) {
        if (this._titleLocation !== value) {
            this._titleLocation = value;
            this.invalidate();
        }
    }

    /**
     * Заголовок поля
     */
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this._labelControl.text = value ? value + ':' : '';
            this.invalidate();
        }
    }

    /**
     * Фиксированная ширина заголовка
     */
    get titleWidth(): number {
        return this._titleWidth;
    }

    set titleWidth(value: number) {
        if (this._titleWidth !== value) {
            this._titleWidth = value;
            this.invalidate();
        }
    }

    /**
     * Отступ между заголовком и полем
     */
    get spacing(): number {
        return this._spacing;
    }

    set spacing(value: number) {
        this._spacing = value;
        this.invalidate();
    }

    /**
     * Контрол поля
     */
    get fieldControl(): LightControl | null {
        return this._fieldControl;
    }

    set fieldControl(control: LightControl | null) {
        // Удаляем старый контрол
        if (this._fieldControl) {
            this.removeChild(this._fieldControl);
        }

        this._fieldControl = control;

        // Добавляем новый
        if (control) {
            this.addChild(control);
        }

        this.invalidate();
    }

    /**
     * Вычисляет предпочтительный размер
     */
    computePreferredSize(wHint: number, hHint: number): Point {
        const theme = getTheme();
        const controlHeight = theme.controlHeight;

        let width = wHint >= 0 ? wHint : 200;  // Default min width
        let height = controlHeight;

        // Учитываем titleLocation
        const showLabel = !!this._title && this._titleLocation !== TitleLocation.None;

        if (this._titleLocation === TitleLocation.Top || this._titleLocation === TitleLocation.Bottom) {
            // Заголовок сверху или снизу добавляет высоту
            if (showLabel) {
                height = controlHeight * 2 + this._spacing;
            }
        }

        // Если есть fieldControl, запрашиваем его preferred size
        if (this._fieldControl) {
            const fieldSize = this._fieldControl.computePreferredSize(-1, -1);
            if (fieldSize.x > 0) {
                width = Math.max(width, fieldSize.x + (showLabel ? this._titleWidth + this._spacing : 0));
            }
        }

        if (hHint >= 0) {
            height = hHint;
        }

        return new Point(width, height);
    }

    /**
     * Раскладка дочерних элементов
     */
    layout(flushCache?: boolean): void {
        const theme = getTheme();
        const font = theme.defaultFont;

        // Абсолютные координаты этого контейнера
        const baseX = this.bounds.x;
        const baseY = this.bounds.y;
        const { width, height } = this.bounds;

        // Размер заголовка
        let labelWidth = this._titleWidth;
        let labelHeight = theme.controlHeight;

        // Скрываем label если нет заголовка или TitleLocation.None
        const showLabel = !!this._title && this._titleLocation !== TitleLocation.None;
        this._labelControl.setVisible(showLabel);

        // Раскладка в зависимости от titleLocation
        // Используем абсолютные координаты (baseX + offset, baseY + offset)
        switch (this._titleLocation) {
            case TitleLocation.Left:
                // [Label:] [Field]
                if (showLabel) {
                    this._labelControl.setBounds(
                        baseX, 
                        baseY + (height - labelHeight) / 2, 
                        labelWidth, 
                        labelHeight
                    );
                }
                if (this._fieldControl) {
                    const fieldX = showLabel ? labelWidth + this._spacing : 0;
                    this._fieldControl.setBounds(
                        baseX + fieldX,
                        baseY,
                        width - fieldX,
                        height
                    );
                }
                break;

            case TitleLocation.Right:
                // [Field] [Label:]
                if (this._fieldControl) {
                    const fieldWidth = showLabel ? width - labelWidth - this._spacing : width;
                    this._fieldControl.setBounds(baseX, baseY, fieldWidth, height);
                }
                if (showLabel) {
                    this._labelControl.setBounds(
                        baseX + width - labelWidth,
                        baseY + (height - labelHeight) / 2,
                        labelWidth,
                        labelHeight
                    );
                }
                break;

            case TitleLocation.Top:
                // [Label]
                // [Field]
                if (showLabel) {
                    this._labelControl.horizontalAlignment = HorizontalAlignment.Left;
                    this._labelControl.setBounds(baseX, baseY, width, labelHeight);
                }
                if (this._fieldControl) {
                    const fieldY = showLabel ? labelHeight + this._spacing : 0;
                    this._fieldControl.setBounds(
                        baseX,
                        baseY + fieldY,
                        width,
                        height - fieldY
                    );
                }
                break;

            case TitleLocation.Bottom:
                // [Field]
                // [Label]
                if (this._fieldControl) {
                    const fieldHeight = showLabel ? height - labelHeight - this._spacing : height;
                    this._fieldControl.setBounds(baseX, baseY, width, fieldHeight);
                }
                if (showLabel) {
                    this._labelControl.horizontalAlignment = HorizontalAlignment.Left;
                    this._labelControl.setBounds(
                        baseX,
                        baseY + height - labelHeight,
                        width,
                        labelHeight
                    );
                }
                break;

            case TitleLocation.None:
            case TitleLocation.Auto:
            default:
                // Только поле, на всю ширину
                if (this._fieldControl) {
                    this._fieldControl.setBounds(baseX, baseY, width, height);
                }
                break;
        }

        // Layout для вложенных контролов
        if (this._fieldControl instanceof LightComposite) {
            this._fieldControl.layout(flushCache);
        }
    }

    /**
     * Рисование
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        // Рисуем заголовок (использует абсолютные координаты)
        if (this._labelControl.visible) {
            this._labelControl.paint(ctx, clip);
        }

        // Рисуем поле (использует абсолютные координаты)
        if (this._fieldControl) {
            this._fieldControl.paint(ctx, clip);
        }
    }
}
