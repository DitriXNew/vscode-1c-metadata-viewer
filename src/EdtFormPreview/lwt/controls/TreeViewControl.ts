/**
 * Контрол TreeView - древовидный список
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.TreeView
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, Color } from '../theme';
import { Table83Styles, TableSizes } from '../theme/ControlStyles';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Узел дерева
 */
export interface ITreeNode {
    /** Уникальный идентификатор */
    id: string;
    /** Текст узла */
    text: string;
    /** Иконка */
    icon?: string;
    /** Родительский ID */
    parentId?: string | null;
    /** Дочерние узлы */
    children?: ITreeNode[];
    /** Развёрнут ли */
    expanded?: boolean;
    /** Выбран ли */
    selected?: boolean;
    /** Отключён ли */
    disabled?: boolean;
    /** Пользовательские данные */
    data?: unknown;
    /** Есть ли дочерние (для ленивой загрузки) */
    hasChildren?: boolean;
}

/**
 * Создать узел дерева
 */
export function createTreeNode(id: string, text: string, options?: Partial<ITreeNode>): ITreeNode {
    return {
        id,
        text,
        children: [],
        expanded: false,
        selected: false,
        disabled: false,
        ...options
    };
}

/**
 * Плоский узел для отрисовки
 */
interface IFlatNode {
    node: ITreeNode;
    level: number;
    isLast: boolean;
    parentLines: boolean[]; // Какие вертикальные линии рисовать
}

// ============================================================================
// КОНТРОЛ TREEVIEW
// ============================================================================

/**
 * TreeView контрол
 */
export class TreeViewControl extends LightControl {
    // Данные
    private _nodes: ITreeNode[] = [];
    private _flatNodes: IFlatNode[] = [];
    private _selectedNodeId: string | null = null;
    
    // Настройки
    private _rowHeight: number = 24;
    private _indentWidth: number = 20;
    private _iconSize: number = 16;
    private _showLines: boolean = true;
    private _showIcons: boolean = true;
    private _showCheckboxes: boolean = false;
    
    // Состояние
    private _hoveredNodeId: string | null = null;
    private _scrollTop: number = 0;
    private _expandIconSize: number = 9;

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Корневые узлы */
    get nodes(): ITreeNode[] {
        return this._nodes;
    }

    set nodes(value: ITreeNode[]) {
        this._nodes = value;
        this.rebuildFlatList();
        this.invalidate();
    }

    /** Выбранный узел */
    get selectedNodeId(): string | null {
        return this._selectedNodeId;
    }

    set selectedNodeId(value: string | null) {
        if (this._selectedNodeId !== value) {
            // Снять выделение со старого
            if (this._selectedNodeId) {
                const oldNode = this.findNode(this._selectedNodeId);
                if (oldNode) oldNode.selected = false;
            }
            
            // Установить выделение на новый
            this._selectedNodeId = value;
            if (value) {
                const newNode = this.findNode(value);
                if (newNode) newNode.selected = true;
            }
            
            this.invalidate();
        }
    }

    /** Выбранный узел (объект) */
    get selectedNode(): ITreeNode | null {
        return this._selectedNodeId ? this.findNode(this._selectedNodeId) : null;
    }

    /** Высота строки */
    get rowHeight(): number {
        return this._rowHeight;
    }

    set rowHeight(value: number) {
        this._rowHeight = value;
        this.invalidate();
    }

    /** Ширина отступа уровня */
    get indentWidth(): number {
        return this._indentWidth;
    }

    set indentWidth(value: number) {
        this._indentWidth = value;
        this.invalidate();
    }

    /** Показывать линии */
    get showLines(): boolean {
        return this._showLines;
    }

    set showLines(value: boolean) {
        this._showLines = value;
        this.invalidate();
    }

    /** Показывать иконки */
    get showIcons(): boolean {
        return this._showIcons;
    }

    set showIcons(value: boolean) {
        this._showIcons = value;
        this.invalidate();
    }

    // ========================================================================
    // МЕТОДЫ РАБОТЫ С УЗЛАМИ
    // ========================================================================

    /**
     * Найти узел по ID
     */
    findNode(id: string, nodes: ITreeNode[] = this._nodes): ITreeNode | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children && node.children.length > 0) {
                const found = this.findNode(id, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * Добавить узел
     */
    addNode(node: ITreeNode, parentId?: string): void {
        if (parentId) {
            const parent = this.findNode(parentId);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(node);
                node.parentId = parentId;
            }
        } else {
            this._nodes.push(node);
        }
        this.rebuildFlatList();
        this.invalidate();
    }

    /**
     * Удалить узел
     */
    removeNode(id: string): void {
        const removeFromArray = (nodes: ITreeNode[]): boolean => {
            const index = nodes.findIndex(n => n.id === id);
            if (index >= 0) {
                nodes.splice(index, 1);
                return true;
            }
            for (const node of nodes) {
                if (node.children && removeFromArray(node.children)) {
                    return true;
                }
            }
            return false;
        };

        if (removeFromArray(this._nodes)) {
            if (this._selectedNodeId === id) {
                this._selectedNodeId = null;
            }
            this.rebuildFlatList();
            this.invalidate();
        }
    }

    /**
     * Развернуть узел
     */
    expandNode(id: string): void {
        const node = this.findNode(id);
        if (node && !node.expanded) {
            node.expanded = true;
            this.rebuildFlatList();
            this.invalidate();
        }
    }

    /**
     * Свернуть узел
     */
    collapseNode(id: string): void {
        const node = this.findNode(id);
        if (node && node.expanded) {
            node.expanded = false;
            this.rebuildFlatList();
            this.invalidate();
        }
    }

    /**
     * Переключить состояние узла
     */
    toggleNode(id: string): void {
        const node = this.findNode(id);
        if (node) {
            node.expanded = !node.expanded;
            this.rebuildFlatList();
            this.invalidate();
        }
    }

    /**
     * Развернуть все узлы
     */
    expandAll(): void {
        const expandRecursive = (nodes: ITreeNode[]) => {
            for (const node of nodes) {
                node.expanded = true;
                if (node.children) expandRecursive(node.children);
            }
        };
        expandRecursive(this._nodes);
        this.rebuildFlatList();
        this.invalidate();
    }

    /**
     * Свернуть все узлы
     */
    collapseAll(): void {
        const collapseRecursive = (nodes: ITreeNode[]) => {
            for (const node of nodes) {
                node.expanded = false;
                if (node.children) collapseRecursive(node.children);
            }
        };
        collapseRecursive(this._nodes);
        this.rebuildFlatList();
        this.invalidate();
    }

    /**
     * Построить плоский список видимых узлов
     */
    private rebuildFlatList(): void {
        this._flatNodes = [];
        
        const addNodes = (nodes: ITreeNode[], level: number, parentLines: boolean[]) => {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const isLast = i === nodes.length - 1;
                
                this._flatNodes.push({
                    node,
                    level,
                    isLast,
                    parentLines: [...parentLines]
                });
                
                if (node.expanded && node.children && node.children.length > 0) {
                    const newParentLines = [...parentLines, !isLast];
                    addNodes(node.children, level + 1, newParentLines);
                }
            }
        };
        
        addNodes(this._nodes, 0, []);
    }

    /**
     * Проверить, есть ли у узла дочерние
     */
    private hasChildren(node: ITreeNode): boolean {
        return node.hasChildren || (node.children && node.children.length > 0) || false;
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        const height = this._flatNodes.length * this._rowHeight;
        return new Dimension(200, Math.max(100, height + 4));
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка дерева
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        // Фон
        ctx.fillStyle = theme.inputBackground.toCss();
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        // Рамка
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(this.bounds.x + 0.5, this.bounds.y + 0.5, this.bounds.width - 1, this.bounds.height - 1);

        // Клиппинг содержимого
        ctx.beginPath();
        ctx.rect(this.bounds.x + 1, this.bounds.y + 1, this.bounds.width - 2, this.bounds.height - 2);
        ctx.clip();

        // Отрисовка узлов
        const startY = this.bounds.y + 1 - this._scrollTop;
        const visibleStart = Math.floor(this._scrollTop / this._rowHeight);
        const visibleEnd = Math.min(
            this._flatNodes.length,
            visibleStart + Math.ceil((this.bounds.height - 2) / this._rowHeight) + 1
        );

        for (let i = visibleStart; i < visibleEnd; i++) {
            const flatNode = this._flatNodes[i];
            const y = startY + i * this._rowHeight;
            
            if (y + this._rowHeight > this.bounds.y && y < this.bounds.y + this.bounds.height) {
                this.paintNode(ctx, flatNode, y);
            }
        }

        ctx.restore();

        // Полоса прокрутки
        const totalHeight = this._flatNodes.length * this._rowHeight;
        if (totalHeight > this.bounds.height - 2) {
            this.paintScrollBar(ctx, totalHeight);
        }
    }

    /**
     * Отрисовка одного узла
     */
    private paintNode(ctx: CanvasRenderingContext2D, flatNode: IFlatNode, y: number): void {
        const theme = getTheme();
        const { node, level, isLast, parentLines } = flatNode;
        const font = theme.defaultFont;
        
        const isSelected = node.id === this._selectedNodeId;
        const isHovered = node.id === this._hoveredNodeId;
        const isDisabled = node.disabled || !this.enabled;
        const hasChildren = this.hasChildren(node);

        let x = this.bounds.x + 1 + level * this._indentWidth;

        // Фон выделения
        if (isSelected) {
            ctx.fillStyle = Table83Styles.selectedBackground.toCss();
            ctx.fillRect(this.bounds.x + 1, y, this.bounds.width - 2, this._rowHeight);
        } else if (isHovered && !isDisabled) {
            ctx.fillStyle = theme.buttonBackgroundHover.toCss();
            ctx.fillRect(this.bounds.x + 1, y, this.bounds.width - 2, this._rowHeight);
        }

        // Линии дерева
        if (this._showLines) {
            ctx.strokeStyle = theme.groupBorder.toCss();
            ctx.lineWidth = 1;
            ctx.setLineDash([1, 1]);

            // Вертикальные линии от родителей
            for (let i = 0; i < parentLines.length; i++) {
                if (parentLines[i]) {
                    const lineX = this.bounds.x + 1 + i * this._indentWidth + this._indentWidth / 2;
                    ctx.beginPath();
                    ctx.moveTo(lineX + 0.5, y);
                    ctx.lineTo(lineX + 0.5, y + this._rowHeight);
                    ctx.stroke();
                }
            }

            // Горизонтальная линия к узлу
            const nodeLineX = this.bounds.x + 1 + level * this._indentWidth + this._indentWidth / 2;
            ctx.beginPath();
            ctx.moveTo(nodeLineX + 0.5, y + this._rowHeight / 2);
            ctx.lineTo(x + this._indentWidth - 2, y + this._rowHeight / 2);
            ctx.stroke();

            // Вертикальная линия (если не последний)
            if (!isLast) {
                ctx.beginPath();
                ctx.moveTo(nodeLineX + 0.5, y);
                ctx.lineTo(nodeLineX + 0.5, y + this._rowHeight);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(nodeLineX + 0.5, y);
                ctx.lineTo(nodeLineX + 0.5, y + this._rowHeight / 2);
                ctx.stroke();
            }

            ctx.setLineDash([]);
        }

        x += 2;

        // Иконка раскрытия
        if (hasChildren) {
            const iconX = x;
            const iconY = y + (this._rowHeight - this._expandIconSize) / 2;
            
            ctx.fillStyle = theme.background.toCss();
            ctx.fillRect(iconX, iconY, this._expandIconSize, this._expandIconSize);
            
            ctx.strokeStyle = theme.inputBorder.toCss();
            ctx.lineWidth = 1;
            ctx.strokeRect(iconX + 0.5, iconY + 0.5, this._expandIconSize - 1, this._expandIconSize - 1);

            // Плюс или минус
            ctx.strokeStyle = theme.foreground.toCss();
            ctx.lineWidth = 1;
            const center = this._expandIconSize / 2;
            
            // Горизонтальная линия (всегда)
            ctx.beginPath();
            ctx.moveTo(iconX + 2, iconY + center);
            ctx.lineTo(iconX + this._expandIconSize - 2, iconY + center);
            ctx.stroke();

            // Вертикальная линия (если свёрнут)
            if (!node.expanded) {
                ctx.beginPath();
                ctx.moveTo(iconX + center, iconY + 2);
                ctx.lineTo(iconX + center, iconY + this._expandIconSize - 2);
                ctx.stroke();
            }
        }

        x += this._expandIconSize + 4;

        // Иконка узла
        if (this._showIcons && node.icon) {
            const iconY = y + (this._rowHeight - this._iconSize) / 2;
            // TODO: Реальная отрисовка иконки
            ctx.fillStyle = isDisabled ? theme.disabledForeground.toCss() : theme.foreground.toCss();
            ctx.fillRect(x, iconY, this._iconSize, this._iconSize);
            x += this._iconSize + 4;
        }

        // Текст
        ctx.font = font.toCss();
        const textColor = isDisabled ? theme.disabledForeground : theme.foreground;
        ctx.fillStyle = textColor.toCss();
        
        const textY = y + (this._rowHeight + font.size) / 2 - 2;
        ctx.fillText(node.text, x, textY);
    }

    /**
     * Отрисовка полосы прокрутки
     */
    private paintScrollBar(ctx: CanvasRenderingContext2D, totalHeight: number): void {
        const scrollWidth = 12;
        const scrollX = this.bounds.x + this.bounds.width - scrollWidth - 1;
        const scrollY = this.bounds.y + 1;
        const scrollHeight = this.bounds.height - 2;

        // Фон
        ctx.fillStyle = new Color(245, 245, 245).toCss();
        ctx.fillRect(scrollX, scrollY, scrollWidth, scrollHeight);

        // Ползунок
        const thumbHeight = Math.max(20, (scrollHeight / totalHeight) * scrollHeight);
        const thumbTop = (this._scrollTop / (totalHeight - scrollHeight)) * (scrollHeight - thumbHeight);

        ctx.fillStyle = new Color(200, 200, 200).toCss();
        ctx.fillRect(scrollX + 2, scrollY + thumbTop, scrollWidth - 4, thumbHeight);
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ
    // ========================================================================

    /**
     * Получить узел по координатам
     */
    private getNodeAtPoint(x: number, y: number): IFlatNode | null {
        if (!this.bounds.contains(x, y)) return null;
        
        const relY = y - this.bounds.y - 1 + this._scrollTop;
        const index = Math.floor(relY / this._rowHeight);
        
        if (index >= 0 && index < this._flatNodes.length) {
            return this._flatNodes[index];
        }
        return null;
    }

    /**
     * Проверить попадание в иконку раскрытия
     */
    private isExpandIconHit(x: number, flatNode: IFlatNode): boolean {
        if (!this.hasChildren(flatNode.node)) return false;
        
        const iconX = this.bounds.x + 1 + flatNode.level * this._indentWidth + 2;
        return x >= iconX && x <= iconX + this._expandIconSize;
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        const flatNode = this.getNodeAtPoint(x, y);
        const newHoveredId = flatNode?.node.id || null;
        
        if (this._hoveredNodeId !== newHoveredId) {
            this._hoveredNodeId = newHoveredId;
            this.invalidate();
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredNodeId !== null) {
            this._hoveredNodeId = null;
            this.invalidate();
        }
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        if (!this.enabled) return;

        const flatNode = this.getNodeAtPoint(x, y);
        if (!flatNode) return;

        // Клик на иконку раскрытия
        if (this.isExpandIconHit(x, flatNode)) {
            this.toggleNode(flatNode.node.id);
            return;
        }

        // Выбор узла
        if (!flatNode.node.disabled) {
            this.selectedNodeId = flatNode.node.id;
        }
    }

    /**
     * Обработка двойного клика
     */
    onDoubleClick(x: number, y: number): void {
        const flatNode = this.getNodeAtPoint(x, y);
        if (flatNode && this.hasChildren(flatNode.node)) {
            this.toggleNode(flatNode.node.id);
        }
    }

    /**
     * Обработка скролла
     */
    onWheel(deltaY: number): void {
        const totalHeight = this._flatNodes.length * this._rowHeight;
        const maxScroll = Math.max(0, totalHeight - (this.bounds.height - 2));
        
        this._scrollTop = Math.max(0, Math.min(maxScroll, this._scrollTop + deltaY));
        this.invalidate();
    }

    /**
     * Обработка клавиатуры
     */
    onKeyDown(key: string): void {
        if (!this.enabled) return;

        const currentIndex = this._flatNodes.findIndex(fn => fn.node.id === this._selectedNodeId);
        
        switch (key) {
            case 'ArrowDown':
                if (currentIndex < this._flatNodes.length - 1) {
                    this.selectedNodeId = this._flatNodes[currentIndex + 1].node.id;
                    this.ensureVisible(currentIndex + 1);
                }
                break;
                
            case 'ArrowUp':
                if (currentIndex > 0) {
                    this.selectedNodeId = this._flatNodes[currentIndex - 1].node.id;
                    this.ensureVisible(currentIndex - 1);
                }
                break;
                
            case 'ArrowRight':
                if (currentIndex >= 0) {
                    const node = this._flatNodes[currentIndex].node;
                    if (this.hasChildren(node) && !node.expanded) {
                        this.expandNode(node.id);
                    } else if (node.expanded && node.children && node.children.length > 0) {
                        // Перейти к первому дочернему
                        this.selectedNodeId = node.children[0].id;
                    }
                }
                break;
                
            case 'ArrowLeft':
                if (currentIndex >= 0) {
                    const flatNode = this._flatNodes[currentIndex];
                    if (flatNode.node.expanded) {
                        this.collapseNode(flatNode.node.id);
                    } else if (flatNode.node.parentId) {
                        // Перейти к родителю
                        this.selectedNodeId = flatNode.node.parentId;
                    }
                }
                break;
                
            case 'Enter':
            case ' ':
                if (currentIndex >= 0) {
                    const node = this._flatNodes[currentIndex].node;
                    if (this.hasChildren(node)) {
                        this.toggleNode(node.id);
                    }
                }
                break;
                
            case 'Home':
                if (this._flatNodes.length > 0) {
                    this.selectedNodeId = this._flatNodes[0].node.id;
                    this._scrollTop = 0;
                    this.invalidate();
                }
                break;
                
            case 'End':
                if (this._flatNodes.length > 0) {
                    this.selectedNodeId = this._flatNodes[this._flatNodes.length - 1].node.id;
                    this.ensureVisible(this._flatNodes.length - 1);
                }
                break;
        }
    }

    /**
     * Прокрутить, чтобы узел был видим
     */
    private ensureVisible(index: number): void {
        const nodeTop = index * this._rowHeight;
        const nodeBottom = nodeTop + this._rowHeight;
        const viewTop = this._scrollTop;
        const viewBottom = this._scrollTop + this.bounds.height - 2;

        if (nodeTop < viewTop) {
            this._scrollTop = nodeTop;
            this.invalidate();
        } else if (nodeBottom > viewBottom) {
            this._scrollTop = nodeBottom - (this.bounds.height - 2);
            this.invalidate();
        }
    }
}
