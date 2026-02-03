/**
 * Ридер для группы колонок (ColumnGroup)
 * По мотивам readColumnGroup из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormGroupXmlPartReader } from './AbstractFormGroupXmlPartReader';
import { FormGroup } from '../../model/FormGroup';
import { ColumnGroupExtInfo } from '../../model/ColumnGroupExtInfo';
import { FormItem } from '../../model/FormItem';

/**
 * Ридер для группы колонок (используется в таблицах)
 */
export class ColumnGroupXmlPartReader extends AbstractFormGroupXmlPartReader {

    /** Callback для чтения дочерних элементов */
    private childItemsReader?: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[];

    /**
     * Устанавливает callback для чтения дочерних элементов
     */
    setChildItemsReader(reader: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[]): void {
        this.childItemsReader = reader;
    }

    /**
     * Читает группу колонок из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormGroup {
        // Читаем базовые свойства FormGroup
        const group = this.readFormGroup(node, context, errorCollector);
        
        // Устанавливаем тип группы
        group.type = 'ColumnGroup';

        // Создаём и заполняем ExtInfo
        const extInfo: ColumnGroupExtInfo = {};
        group.extInfo = extInfo;

        // Group (группировка)
        extInfo.group = this.readEnum(node.get('Group'));

        // TitleBackColor
        extInfo.titleBackColor = this.readColor(node.get('TitleBackColor'));

        // ShowInHeader
        extInfo.showInHeader = this.readBoolean(node.get('ShowInHeader'));

        // HeaderDataPath
        extInfo.headerDataPath = this.readDataPath(node.get('HeaderDataPath'));

        // HeaderHorizontalAlign
        extInfo.headerHorizontalAlign = this.readEnum(node.get('HeaderHorizontalAlign'));

        // HeaderFormat
        extInfo.headerFormat = this.readLocalizedString(node.get('HeaderFormat'));

        // HeaderPicture
        extInfo.headerPicture = this.readPicture(node.get('HeaderPicture'));

        // FixingInTable
        extInfo.fixingInTable = this.readEnum(node.get('FixingInTable'));

        // ShowTitle - version-dependent
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // 8.5.1+ uses ShowTitle851
            extInfo.showTitle = this.readEnum(node.get('ShowTitle'));
            extInfo.showTitleInCard = this.readBoolean(node.get('ShowTitleInCard'));
            extInfo.showInCard = this.readBoolean(node.get('ShowInCard'));
            extInfo.fixInCard = this.readEnum(node.get('FixInCard'));
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
