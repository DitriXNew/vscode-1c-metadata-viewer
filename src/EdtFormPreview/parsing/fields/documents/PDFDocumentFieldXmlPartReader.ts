/**
 * Ридер для поля PDF документа PDFDocumentField
 * По мотивам readPdfDocumentField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { PDFDocumentFieldExtInfo } from '../../../model/PDFDocumentFieldExtInfo';
import { ViewStatusAdditionXmlPartReader } from '../../additions/ViewStatusAdditionXmlPartReader';

/**
 * Ридер для поля PDF документа
 */
export class PDFDocumentFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    private viewStatusAdditionReader: ViewStatusAdditionXmlPartReader;

    constructor() {
        super();
        this.viewStatusAdditionReader = new ViewStatusAdditionXmlPartReader();
    }

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

        // Читаем ViewStatusAddition
        const viewStatusAdditionNode = node.get('ViewStatusAddition');
        if (viewStatusAdditionNode.exists()) {
            extInfo.viewStatusAddition = this.viewStatusAdditionReader.read(viewStatusAdditionNode, context, errorCollector);
        }

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
