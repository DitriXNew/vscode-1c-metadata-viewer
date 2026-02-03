/**
 * Ридер для поля полосы регулировки TrackBarField
 * По мотивам readTrackBarField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { TrackBarFieldExtInfo } from '../../../model/TrackBarFieldExtInfo';

/**
 * Ридер для поля полосы регулировки
 */
export class TrackBarFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает TrackBarField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'TrackBarField';

        // Создаем ExtInfo
        const extInfo: TrackBarFieldExtInfo = {};

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

        // Значения и шаги
        extInfo.minValue = this.readNumber(node.get('MinValue'));
        extInfo.maxValue = this.readNumber(node.get('MaxValue'));
        extInfo.step = this.readNumber(node.get('Step'));
        extInfo.largeStep = this.readNumber(node.get('LargeStep'));
        extInfo.markingStep = this.readNumber(node.get('MarkingStep'));

        // Ориентация и внешний вид
        extInfo.orientation = this.readEnum(node.get('Orientation'));
        extInfo.markingAppearance = this.readEnum(node.get('MarkingAppearance'));

        // Стиль
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
