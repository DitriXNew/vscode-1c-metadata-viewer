/**
 * Ридер для поля географической схемы GeographicalSchemaField
 * По мотивам readGeographicalSchemaField из FormChildItemsXmlPartReader в EDT
 * 
 * Использует GeographicalMapFieldExtInfo
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { GeographicalMapFieldExtInfo } from '../../../model/GeographicalMapFieldExtInfo';

/**
 * Ридер для поля географической схемы
 */
export class GeographicalSchemaFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает GeographicalSchemaField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'GeographicalSchemaField';

        // Создаем ExtInfo
        const extInfo: GeographicalMapFieldExtInfo = {};

        // Размеры
        extInfo.width = this.readNumber(node.get('Width'));
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));
        extInfo.height = this.readNumber(node.get('Height'));
        extInfo.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        extInfo.maxHeight = this.readNumber(node.get('MaxHeight'));

        // Растягивание
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        extInfo.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // Вывод
        extInfo.output = this.readEnum(node.get('Output'));

        // Стиль
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
