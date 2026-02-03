/**
 * Ридер для поля текстового документа TextDocumentField
 * По мотивам readTextDocumentField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { TextDocFieldExtInfo } from '../../../model/TextDocFieldExtInfo';

/**
 * Ридер для поля текстового документа
 */
export class TextDocumentFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает TextDocumentField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'TextDocumentField';

        // Создаем ExtInfo
        const extInfo: TextDocFieldExtInfo = {};

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

        // Цвета
        extInfo.textColor = this.readColor(node.get('TextColor'));
        extInfo.backColor = this.readColor(node.get('BackColor'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // Шрифт
        extInfo.font = this.readFont(node.get('Font'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
