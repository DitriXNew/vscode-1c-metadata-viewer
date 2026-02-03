/**
 * Ридер для группы кнопок (ButtonGroup)
 * По мотивам readButtonGroup из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormGroupXmlPartReader } from './AbstractFormGroupXmlPartReader';
import { FormGroup } from '../../model/FormGroup';
import { ButtonGroupExtInfo } from '../../model/ButtonGroupExtInfo';
import { FormItem } from '../../model/FormItem';

/**
 * Ридер для группы кнопок
 */
export class ButtonGroupXmlPartReader extends AbstractFormGroupXmlPartReader {

    /** Callback для чтения дочерних элементов */
    private childItemsReader?: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[];

    /**
     * Устанавливает callback для чтения дочерних элементов
     */
    setChildItemsReader(reader: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[]): void {
        this.childItemsReader = reader;
    }

    /**
     * Читает группу кнопок из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormGroup {
        // Читаем базовые свойства FormGroup
        const group = this.readFormGroup(node, context, errorCollector);
        
        // Устанавливаем тип группы
        group.type = 'ButtonGroup';

        // Создаём и заполняем ExtInfo
        const extInfo: ButtonGroupExtInfo = {};
        group.extInfo = extInfo;

        // CommandSource
        extInfo.commandSource = this.readDataPath(node.get('CommandSource'));

        // Representation
        extInfo.representation = this.readEnum(node.get('Representation'));

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
