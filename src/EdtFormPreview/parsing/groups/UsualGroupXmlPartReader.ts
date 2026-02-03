/**
 * Ридер для обычной группы (UsualGroup)
 * По мотивам readUsualGroup из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormGroupXmlPartReader } from './AbstractFormGroupXmlPartReader';
import { FormGroup } from '../../model/FormGroup';
import { UsualGroupExtInfo } from '../../model/UsualGroupExtInfo';
import { FormItem } from '../../model/FormItem';

/**
 * Ридер для обычной группы
 */
export class UsualGroupXmlPartReader extends AbstractFormGroupXmlPartReader {

    /** Callback для чтения дочерних элементов */
    private childItemsReader?: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[];

    /**
     * Устанавливает callback для чтения дочерних элементов
     */
    setChildItemsReader(reader: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[]): void {
        this.childItemsReader = reader;
    }

    /**
     * Читает обычную группу из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormGroup {
        // Читаем базовые свойства FormGroup
        const group = this.readFormGroup(node, context, errorCollector);
        
        // Устанавливаем тип группы
        group.type = 'UsualGroup';

        // Создаём и заполняем ExtInfo
        const extInfo: UsualGroupExtInfo = {};
        group.extInfo = extInfo;

        // Group (группировка)
        extInfo.group = this.readEnum(node.get('Group'));

        // ChildrenAlign
        extInfo.childrenAlign = this.readEnum(node.get('ChildrenAlign'));

        // HorizontalSpacing
        extInfo.horizontalSpacing = this.readEnum(node.get('HorizontalSpacing'));

        // VerticalSpacing
        extInfo.verticalSpacing = this.readEnum(node.get('VerticalSpacing'));

        // HorizontalAlign
        extInfo.horizontalAlign = this.readEnum(node.get('HorizontalAlign'));

        // VerticalAlign
        extInfo.verticalAlign = this.readEnum(node.get('VerticalAlign'));

        // ChildItemsTitleLocation (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.childItemsTitleLocation = this.readEnum(node.get('ChildItemsTitleLocation'));
            // CollapsedRepresentationItem - ссылка на элемент
            // extInfo.collapsedRepresentationItem = ...
        }

        // Behavior
        extInfo.behavior = this.readEnum(node.get('Behavior'));

        // CollapsedRepresentationTitle
        extInfo.collapsedRepresentationTitle = this.readLocalizedString(node.get('CollapsedRepresentationTitle'));

        // Collapsed
        extInfo.collapsed = this.readBoolean(node.get('Collapsed'));

        // ControlRepresentation
        extInfo.controlRepresentation = this.readEnum(node.get('ControlRepresentation'));

        // Representation
        extInfo.representation = this.readEnum(node.get('Representation'));

        // ShowLeftMargin
        extInfo.showLeftMargin = this.readBoolean(node.get('ShowLeftMargin'));

        // United
        extInfo.united = this.readBoolean(node.get('United'));

        // ChildItemsWidth -> slaveItemsWidth
        extInfo.slaveItemsWidth = this.readEnum(node.get('ChildItemsWidth'));

        // Format
        extInfo.format = this.readLocalizedString(node.get('Format'));

        // TitleDataPath
        extInfo.titleDataPath = this.readDataPath(node.get('TitleDataPath'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // ThroughAlign
        extInfo.throughAlign = this.readEnum(node.get('ThroughAlign'));

        // 8.3.12+
        if (this.versionIsAtLeast(context, '8.3.12')) {
            // HiddenStateTitleBackColor
            extInfo.hiddenStateTitleBackColor = this.readColor(node.get('HiddenStateTitleBackColor'));

            // CurrentRowUse
            extInfo.currentRowUse = this.readEnum(node.get('CurrentRowUse'));

            // AssociatedTableElementId - version-dependent
            // TODO: handle version differences for 8.3.15+
        }

        // ShowTitle - version-dependent
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // 8.5.1+ uses ShowTitle851
            extInfo.showTitle = this.readEnum(node.get('ShowTitle'));
            
            // ShowAsCard
            extInfo.showAsCard = this.readBoolean(node.get('ShowAsCard'));

            // Hyperlink
            extInfo.hyperlink = this.readBoolean(node.get('Hyperlink'));

            // ScrollOnCompress
            extInfo.scrollOnCompress = this.readBoolean(node.get('ScrollOnCompress'));

            // BackPicture, BackPictureEffect, CardRepresentationType - TODO
        } else {
            // Pre-8.5.1 uses boolean showTitle
            extInfo.showTitle = this.readBoolean(node.get('ShowTitle'));
        }

        // Читаем обработчики событий
        this.readEventHandlers(node, group, context, errorCollector);

        return group;
    }

    protected override readChildItems(
        childItemsNode: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormItem[] {
        if (this.childItemsReader) {
            return this.childItemsReader(childItemsNode, context, errorCollector);
        }
        return super.readChildItems(childItemsNode, context, errorCollector);
    }

    /**
     * Читает обработчики событий
     */
    protected readEventHandlers(
        node: XmlNode,
        group: FormGroup,
        _context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): void {
        const eventsNode = node.get('Events');
        if (eventsNode.exists()) {
            const handlers: { name: string; handler: string }[] = [];
            for (const eventNode of eventsNode.getAll('Event')) {
                const name = eventNode.attribute('name');
                const handler = eventNode.text();
                if (name && handler) {
                    handlers.push({ name, handler });
                }
            }
            if (handlers.length > 0) {
                group.handlers = handlers;
            }
        }
    }
}
