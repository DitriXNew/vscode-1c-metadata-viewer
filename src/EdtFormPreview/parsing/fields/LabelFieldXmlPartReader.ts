/**
 * Ридер для поля надписи (LabelField)
 * По мотивам readLabelField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from './AbstractFormFieldXmlPartReader';
import { FormField } from '../../model/FormField';
import { LabelFieldExtInfo } from '../../model/LabelFieldExtInfo';
import { ManagedFormFieldType } from '../../model/ManagedFormFieldType';

/**
 * Ридер для поля надписи
 */
export class LabelFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает поле надписи из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        
        // Устанавливаем тип поля
        field.type = ManagedFormFieldType.LabelField;

        // Создаём и заполняем ExtInfo
        const extInfo: LabelFieldExtInfo = {};
        field.extInfo = extInfo;

        // Width
        extInfo.width = this.readNumber(node.get('Width'));

        // AutoMaxWidth
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));

        // MaxWidth
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));

        // MinWidth
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));

        // Height
        extInfo.height = this.readNumber(node.get('Height'));

        // AutoMaxHeight
        extInfo.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));

        // MaxHeight
        extInfo.maxHeight = this.readNumber(node.get('MaxHeight'));

        // HorizontalStretch
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

        // VerticalStretch
        extInfo.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // MarkNegatives
        extInfo.markNegatives = this.readBoolean(node.get('MarkNegatives'));

        // Format
        extInfo.format = this.readLocalizedString(node.get('Format'));

        // Hyperlink (Hiperlink в XML - опечатка в старых версиях)
        extInfo.hyperlink = this.readBoolean(node.get('Hiperlink'));

        // PasswordMode
        extInfo.passwordMode = this.readBoolean(node.get('PasswordMode'));

        // UseCopy (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.useCopy = this.readBoolean(node.get('UseCopy'));
        }

        // Border
        extInfo.border = this.readBorder(node.get('Border'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // TextColor
        extInfo.textColor = this.readColor(node.get('TextColor'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // Font
        extInfo.font = this.readFont(node.get('Font'));

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
