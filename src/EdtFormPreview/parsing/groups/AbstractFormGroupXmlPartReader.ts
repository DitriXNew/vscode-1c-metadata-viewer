/**
 * Базовый ридер для групп формы (FormGroup)
 * По мотивам readFormGroup и fillGroup из FormChildItemsXmlPartReader в EDT
 * 
 * Содержит общую логику чтения базовых свойств всех типов групп
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { FormGroup } from '../../model/FormGroup';
import { FormItem } from '../../model/FormItem';
import { ExtendedTooltipXmlPartReader } from '../extendedtooltip/ExtendedTooltipXmlPartReader';

/**
 * Базовый ридер для всех типов групп формы
 */
export abstract class AbstractFormGroupXmlPartReader extends AbstractFormXmlPartReader {

    protected readonly extendedTooltipReader: ExtendedTooltipXmlPartReader;

    constructor() {
        super();
        this.extendedTooltipReader = new ExtendedTooltipXmlPartReader();
    }

    /**
     * Читает базовые свойства FormGroup (соответствует fillGroup + readFormGroup в EDT)
     */
    protected readFormGroup(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormGroup {
        const group: FormGroup = {
            id: 0,
            name: ''
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            group.id = id;
        }

        // name
        this.readNamedElement(node, group);

        // DisplayImportance
        group.displayImportance = this.readDisplayImportance(node);

        // Visible
        group.visible = this.readBoolean(node.get('Visible'));

        // UserVisible
        group.userVisible = this.readUserVisible(node.get('UserVisible'));

        // Enabled
        group.enabled = this.readBoolean(node.get('Enabled'));

        // ReadOnly
        group.readOnly = this.readBoolean(node.get('ReadOnly'));

        // EnableContentChange
        group.enableContentChange = this.readBoolean(node.get('EnableContentChange'));

        // Title
        group.title = this.readLocalizedString(node.get('Title'));

        // TitleTextColor
        group.titleTextColor = this.readColor(node.get('TitleTextColor'));

        // TitleFont
        group.titleFont = this.readFont(node.get('TitleFont'));

        // ToolTip
        group.toolTip = this.readLocalizedString(node.get('ToolTip'));

        // ToolTipRepresentation
        group.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));

        // Shortcut
        group.shortcut = this.readString(node.get('Shortcut'));

        // Width
        group.width = this.readNumber(node.get('Width'));

        // Height
        group.height = this.readNumber(node.get('Height'));

        // HorizontalStretch
        group.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

        // VerticalStretch
        group.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // GroupHorizontalAlign
        group.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        group.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // ChildItems - рекурсивно читаем дочерние элементы
        const childItemsNode = node.get('ChildItems');
        if (childItemsNode.exists()) {
            group.items = this.readChildItems(childItemsNode, context, errorCollector);
        }

        // ExtendedTooltip - читается отдельно
        this.readExtendedTooltip(node, group, context, errorCollector);

        return group;
    }

    /**
     * Читает дочерние элементы группы
     * Должен быть переопределён или вызван через callback
     */
    protected readChildItems(
        _childItemsNode: XmlNode,
        _context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): FormItem[] {
        // Базовая реализация возвращает пустой массив
        // Реальное чтение делегируется FormChildItemsXmlPartReader
        return [];
    }

    /**
     * Читает расширенную подсказку
     */
    protected readExtendedTooltip(
        node: XmlNode,
        group: FormGroup,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): void {
        group.extendedTooltip = this.extendedTooltipReader.readFromParent(node, context, errorCollector);
    }
}
