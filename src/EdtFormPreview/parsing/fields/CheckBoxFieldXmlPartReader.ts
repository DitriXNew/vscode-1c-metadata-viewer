/**
 * Ридер для поля флажка (CheckBoxField)
 * По мотивам readCheckBoxField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from './AbstractFormFieldXmlPartReader';
import { FormField } from '../../model/FormField';
import { CheckBoxFieldExtInfo } from '../../model/CheckBoxFieldExtInfo';

/**
 * Ридер для поля флажка
 */
export class CheckBoxFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает поле флажка из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        
        // Устанавливаем тип поля
        field.type = 'CheckBoxField';

        // Создаём и заполняем ExtInfo
        const extInfo: CheckBoxFieldExtInfo = {};
        field.extInfo = extInfo;

        // CheckBoxType
        extInfo.checkBoxType = this.readEnum(node.get('CheckBoxType'));

        // ThreeState
        extInfo.threeState = this.readBoolean(node.get('ThreeState'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // TextColor
        extInfo.textColor = this.readColor(node.get('TextColor'));

        // Font
        extInfo.font = this.readFont(node.get('Font'));

        // EditFormat
        extInfo.editFormat = this.readLocalizedString(node.get('EditFormat'));

        // ItemTitleHeight
        extInfo.itemTitleHeight = this.readNumber(node.get('ItemTitleHeight'));

        // ItemWidth
        extInfo.itemWidth = this.readNumber(node.get('ItemWidth'));

        // ItemHeight
        extInfo.itemHeight = this.readNumber(node.get('ItemHeight'));

        // EqualItemsWidth (EqualElementsWidth в модели)
        extInfo.equalElementsWidth = this.readBoolean(node.get('EqualItemsWidth'));

        // 8.5.1+
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // TumblerRepresentation
            extInfo.tumblerRepresentation = this.readEnum(node.get('TumblerRepresentation'));

            // HorizontalStretch
            extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        }

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
