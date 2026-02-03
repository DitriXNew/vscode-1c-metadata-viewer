/**
 * Ридер для страницы (Page)
 * По мотивам readPage из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormGroupXmlPartReader } from './AbstractFormGroupXmlPartReader';
import { FormGroup } from '../../model/FormGroup';
import { PageGroupExtInfo } from '../../model/PageGroupExtInfo';
import { FormItem } from '../../model/FormItem';

/**
 * Ридер для страницы (вкладки)
 */
export class PageGroupXmlPartReader extends AbstractFormGroupXmlPartReader {

    /** Callback для чтения дочерних элементов */
    private childItemsReader?: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[];

    /**
     * Устанавливает callback для чтения дочерних элементов
     */
    setChildItemsReader(reader: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[]): void {
        this.childItemsReader = reader;
    }

    /**
     * Читает страницу из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormGroup {
        // Читаем базовые свойства FormGroup
        const group = this.readFormGroup(node, context, errorCollector);
        
        // Устанавливаем тип группы
        group.type = 'Page';

        // Создаём и заполняем ExtInfo
        const extInfo: PageGroupExtInfo = {};
        group.extInfo = extInfo;

        // Picture
        extInfo.picture = this.readPicture(node.get('Picture'));

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

        // ChildItemsWidth -> slaveItemsWidth
        extInfo.slaveItemsWidth = this.readEnum(node.get('ChildItemsWidth'));

        // Format
        extInfo.format = this.readLocalizedString(node.get('Format'));

        // TitleDataPath
        extInfo.titleDataPath = this.readDataPath(node.get('TitleDataPath'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // ShowTitle and ScrollOnCompress - version-dependent
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // 8.5.1+ uses ShowTitle851 and ScrollOnCompress851
            extInfo.showTitle = this.readEnum(node.get('ShowTitle'));
            extInfo.scrollOnCompress = this.readEnum(node.get('ScrollOnCompress'));
            extInfo.childItemsTitleLocation = this.readEnum(node.get('ChildItemsTitleLocation'));
        } else {
            // Pre-8.5.1 uses boolean versions
            extInfo.showTitle = this.readBoolean(node.get('ShowTitle'));
            extInfo.scrollOnCompress = this.readBoolean(node.get('ScrollOnCompress'));
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
