/**
 * Ридер для поля индикатора прогресса ProgressBarField
 * По мотивам readProgressBarField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { ProgressBarFieldExtInfo } from '../../../model/ProgressBarFieldExtInfo';

/**
 * Ридер для поля индикатора прогресса
 */
export class ProgressBarFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает ProgressBarField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'ProgressBarField';

        // Создаем ExtInfo
        const extInfo: ProgressBarFieldExtInfo = {};

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

        // Значения
        extInfo.minValue = this.readNumber(node.get('MinValue'));
        extInfo.maxValue = this.readNumber(node.get('MaxValue'));

        // Ориентация и представление
        extInfo.orientation = this.readEnum(node.get('Orientation'));
        extInfo.representation = this.readEnum(node.get('Representation'));
        extInfo.showPercent = this.readBoolean(node.get('ShowPercent'));

        // Стиль
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
