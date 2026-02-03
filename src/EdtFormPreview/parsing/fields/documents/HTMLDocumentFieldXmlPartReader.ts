/**
 * Ридер для поля HTML документа HTMLDocumentField
 * По мотивам readHTMLDocumentField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { HtmlFieldExtInfo } from '../../../model/HtmlFieldExtInfo';

/**
 * Ридер для поля HTML документа
 */
export class HTMLDocumentFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает HTMLDocumentField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'HTMLDocumentField';

        // Создаем ExtInfo
        const extInfo: HtmlFieldExtInfo = {};

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

        // Цвет рамки
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // 8.5.1+ properties
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.border = this.readBorder(node.get('Border'));
        }

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
