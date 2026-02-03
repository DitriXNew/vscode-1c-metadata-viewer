/**
 * Ридер для поля календаря CalendarField
 * По мотивам readCalendarField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { CalendarFieldExtInfo } from '../../../model/CalendarFieldExtInfo';

/**
 * Ридер для поля календаря
 */
export class CalendarFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает CalendarField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'CalendarField';

        // Создаем ExtInfo
        const extInfo: CalendarFieldExtInfo = {};

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

        // Настройки календаря
        extInfo.selectionMode = this.readEnum(node.get('SelectionMode'));
        extInfo.showCurrentDate = this.readBoolean(node.get('ShowCurrentDate'));
        extInfo.calendarNavigation = this.readBoolean(node.get('CalendarNavigation'));
        extInfo.beginOfRepresentationPeriod = this.readString(node.get('BeginOfRepresentationPeriod'));
        extInfo.endOfRepresentationPeriod = this.readString(node.get('EndOfRepresentationPeriod'));

        // Перетаскивание
        extInfo.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));
        extInfo.enableDrag = this.readBoolean(node.get('EnableDrag'));

        // Стиль
        extInfo.font = this.readFont(node.get('Font'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));
        extInfo.border = this.readBorder(node.get('Border'));

        // Панель месяцев
        extInfo.showMonthsPanel = this.readBoolean(node.get('ShowMonthsPanel'));
        extInfo.widthInMonths = this.readNumber(node.get('WidthInMonths'));
        extInfo.heightInMonths = this.readNumber(node.get('HeightInMonths'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
