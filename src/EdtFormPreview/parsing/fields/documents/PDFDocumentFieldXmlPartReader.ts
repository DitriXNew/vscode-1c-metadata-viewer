/**
 * Ридер для поля PDF документа PDFDocumentField
 * По мотивам readPdfDocumentField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { PDFDocumentFieldExtInfo } from '../../../model/PDFDocumentFieldExtInfo';

/**
 * Ридер для поля PDF документа
 */
export class PDFDocumentFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает PDFDocumentField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // PDF поля поддерживаются только с версии 8.3.21
        if (!this.versionIsAtLeast(context, '8.3.21')) {
            errorCollector.addWarning('PDFDocumentField is not supported in versions before 8.3.21');
        }

        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'PDFDocumentField';

        // Создаем ExtInfo
        const extInfo: PDFDocumentFieldExtInfo = {};

        // Размеры (порядок как в EDT)
        extInfo.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));
        extInfo.height = this.readNumber(node.get('Height'));
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        extInfo.maxHeight = this.readNumber(node.get('MaxHeight'));
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));
        extInfo.output = this.readEnum(node.get('Output'));
        extInfo.verticalStretch = this.readBoolean(node.get('VerticalStretch'));
        extInfo.viewStatusLocation = this.readEnum(node.get('ViewStatusLocation'));
        extInfo.width = this.readNumber(node.get('Width'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        // TODO: readViewStatusAddition - может потребоваться добавить когда будут реализованы Additions
        // this.readViewStatusAddition(node.get('ViewStatusAddition'), ...)

        return field;
    }
}
