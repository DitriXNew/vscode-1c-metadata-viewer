/**
 * Контрол Group - группа элементов
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.GroupControl
 */
import { LightComposite } from '../core/LightComposite';
import { Rectangle } from '../geometry/Rectangle';
import { getTheme, ITheme, Color, Font } from '../theme';

/**
 * Вид группы
 */
export enum GroupType {
    /** Обычная группа без рамки */
    None = 'none',
    /** Группа с рамкой */
    Panel = 'panel',
    /** Группа с заголовком */
    GroupBox = 'groupBox',
    /** Свёртываемая группа */
    Collapsible = 'collapsible',
    /** Страница (для TabControl) */
    Page = 'page'
}

/**
 * Контрол группы
 */
export class GroupControl extends LightComposite {
    private _title: string = '';
    private _groupType: GroupType = GroupType.None;
    private _font: Font | null = null;
    private _backgroundColor: Color | null = null;
    private _borderColor: Color | null = null;
    private _collapsed: boolean = false;
    private _collapsible: boolean = false;
    private _showTitle: boolean = true;
    private _titleHeight: number = 24;

    /**
     * Заголовок группы
     */
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.invalidate();
        }
    }

    /**
     * Тип группы
     */
    get groupType(): GroupType {
        return this._groupType;
    }

    set groupType(value: GroupType) {
        this._groupType = value;
        if (value === GroupType.Collapsible) {
            this._collapsible = true;
        }
        this.invalidate();
    }

    /**
     * Шрифт заголовка
     */
    get font(): Font | null {
        return this._font;
    }

    set font(value: Font | null) {
        this._font = value;
        this.invalidate();
    }

    /**
     * Цвет фона
     */
    get backgroundColor(): Color | null {
        return this._backgroundColor;
    }

    set backgroundColor(value: Color | null) {
        this._backgroundColor = value;
        this.invalidate();
    }

    /**
     * Цвет рамки
     */
    get borderColor(): Color | null {
        return this._borderColor;
    }

    set borderColor(value: Color | null) {
        this._borderColor = value;
        this.invalidate();
    }

    /**
     * Свёрнута ли группа
     */
    get collapsed(): boolean {
        return this._collapsed;
    }

    set collapsed(value: boolean) {
        this._collapsed = value;
        this.invalidate();
    }

    /**
     * Можно ли сворачивать
     */
    get collapsible(): boolean {
        return this._collapsible;
    }

    set collapsible(value: boolean) {
        this._collapsible = value;
        this.invalidate();
    }

    /**
     * Показывать заголовок
     */
    get showTitle(): boolean {
        return this._showTitle;
    }

    set showTitle(value: boolean) {
        this._showTitle = value;
        this.invalidate();
    }

    /**
     * Высота заголовка
     */
    get titleHeight(): number {
        return this._titleHeight;
    }

    set titleHeight(value: number) {
        this._titleHeight = value;
        this.invalidate();
    }

    /**
     * Получает эффективный шрифт
     */
    private getEffectiveFont(theme: ITheme): Font {
        return this._font ?? theme.titleFont;
    }

    /**
     * Получает эффективный цвет фона
     */
    private getEffectiveBackgroundColor(theme: ITheme): Color | null {
        if (this._groupType === GroupType.None) {
            return null;
        }
        return this._backgroundColor ?? theme.groupBackground;
    }

    /**
     * Получает эффективный цвет рамки
     */
    private getEffectiveBorderColor(theme: ITheme): Color {
        return this._borderColor ?? theme.groupBorder;
    }

    /**
     * Получает область содержимого (без заголовка)
     */
    getContentArea(): Rectangle {
        const theme = getTheme();
        const padding = theme.padding;
        let offsetTop = padding;

        // Добавляем высоту заголовка если он отображается
        if (this._showTitle && this._title && 
            (this._groupType === GroupType.GroupBox || 
             this._groupType === GroupType.Collapsible)) {
            offsetTop = this._titleHeight;
        }

        if (this._collapsed) {
            return new Rectangle(this.bounds.x, this.bounds.y + offsetTop, 0, 0);
        }

        return new Rectangle(
            this.bounds.x + padding,
            this.bounds.y + offsetTop,
            this.bounds.width - padding * 2,
            this.bounds.height - offsetTop - padding
        );
    }

    /**
     * Отрисовка контрола
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        switch (this._groupType) {
            case GroupType.Panel:
                this.paintPanel(ctx, theme);
                break;
            case GroupType.GroupBox:
                this.paintGroupBox(ctx, theme);
                break;
            case GroupType.Collapsible:
                this.paintCollapsible(ctx, theme);
                break;
            case GroupType.Page:
                this.paintPage(ctx, theme);
                break;
            default:
                // None - просто рисуем детей
                break;
        }

        // Рисуем детей если группа не свёрнута
        if (!this._collapsed) {
            this.paintChildren(ctx, clip);
        }

        ctx.restore();
    }

    /**
     * Отрисовка панели
     */
    private paintPanel(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;

        // Фон
        const bgColor = this.getEffectiveBackgroundColor(theme);
        if (bgColor) {
            ctx.fillStyle = bgColor.toCss();
            ctx.fillRect(x, y, width, height);
        }

        // Рамка
        const borderColor = this.getEffectiveBorderColor(theme);
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    }

    /**
     * Отрисовка GroupBox
     */
    private paintGroupBox(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;
        const font = this.getEffectiveFont(theme);
        const borderColor = this.getEffectiveBorderColor(theme);

        // Фон
        const bgColor = this.getEffectiveBackgroundColor(theme);
        if (bgColor) {
            ctx.fillStyle = bgColor.toCss();
            ctx.fillRect(x, y + font.size / 2, width, height - font.size / 2);
        }

        // Измеряем заголовок
        ctx.font = font.toCss();
        const titleWidth = ctx.measureText(this._title).width + theme.padding * 2;
        const titleX = x + theme.padding * 2;

        // Рамка с разрывом для заголовка
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;

        ctx.beginPath();
        // Верхняя линия слева от заголовка
        ctx.moveTo(x + 0.5, y + font.size / 2 + 0.5);
        ctx.lineTo(titleX - theme.padding, y + font.size / 2 + 0.5);
        // Верхняя линия справа от заголовка
        ctx.moveTo(titleX + titleWidth, y + font.size / 2 + 0.5);
        ctx.lineTo(x + width - 0.5, y + font.size / 2 + 0.5);
        // Правая линия
        ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // Нижняя линия
        ctx.lineTo(x + 0.5, y + height - 0.5);
        // Левая линия
        ctx.lineTo(x + 0.5, y + font.size / 2 + 0.5);
        ctx.stroke();

        // Заголовок
        if (this._showTitle && this._title) {
            ctx.fillStyle = theme.groupTitleForeground.toCss();
            ctx.fillText(this._title, titleX, y + font.size);
        }
    }

    /**
     * Отрисовка свёртываемой группы
     */
    private paintCollapsible(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;
        const font = this.getEffectiveFont(theme);

        // Фон заголовка
        ctx.fillStyle = theme.groupBackground.toCss();
        ctx.fillRect(x, y, width, this._titleHeight);

        // Рамка
        const borderColor = this.getEffectiveBorderColor(theme);
        ctx.strokeStyle = borderColor.toCss();
        ctx.lineWidth = 1;
        
        if (this._collapsed) {
            ctx.strokeRect(x + 0.5, y + 0.5, width - 1, this._titleHeight - 1);
        } else {
            ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
        }

        // Иконка свёртывания
        this.paintCollapseIcon(ctx, x + 8, y + this._titleHeight / 2, theme);

        // Заголовок
        if (this._showTitle && this._title) {
            ctx.font = font.toCss();
            ctx.fillStyle = theme.groupTitleForeground.toCss();
            ctx.fillText(this._title, x + 24, y + (this._titleHeight + font.size) / 2 - 2);
        }
    }

    /**
     * Отрисовка страницы (для табов)
     */
    private paintPage(ctx: CanvasRenderingContext2D, theme: ITheme): void {
        const { x, y, width, height } = this.bounds;

        // Фон
        ctx.fillStyle = theme.background.toCss();
        ctx.fillRect(x, y, width, height);
    }

    /**
     * Отрисовка иконки свёртывания
     */
    private paintCollapseIcon(ctx: CanvasRenderingContext2D, x: number, y: number, theme: ITheme): void {
        const size = 6;
        ctx.fillStyle = theme.groupTitleForeground.toCss();

        ctx.beginPath();
        if (this._collapsed) {
            // Треугольник вправо
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x, y + size);
        } else {
            // Треугольник вниз
            ctx.moveTo(x - size / 2, y - size / 2);
            ctx.lineTo(x + size, y - size / 2);
            ctx.lineTo(x + size / 4, y + size / 2);
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Переключает свёртывание
     */
    toggleCollapse(): void {
        if (this._collapsible) {
            this._collapsed = !this._collapsed;
            this.invalidate();
        }
    }

    /**
     * Обработка клика в области заголовка
     */
    onTitleClick(): void {
        this.toggleCollapse();
    }
}
