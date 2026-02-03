/**
 * Ридер для поля планировщика PlannerField
 * По мотивам readPlannerField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { PlannerFieldExtInfo } from '../../../model/PlannerFieldExtInfo';

/**
 * Ридер для поля планировщика
 */
export class PlannerFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает PlannerField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'PlannerField';

        // Создаем ExtInfo
        const extInfo: PlannerFieldExtInfo = {};

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

        // Перетаскивание
        extInfo.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));
        extInfo.enableDrag = this.readBoolean(node.get('EnableDrag'));

        // Гиперссылки
        extInfo.timeScaleItemHyperlink = this.readBoolean(node.get('TimeScaleItemHyperlink'));
        extInfo.dimensionItemHyperlink = this.readBoolean(node.get('DimensionItemHyperlink'));
        extInfo.wrappedTimeScaleHeaderHyperlink = this.readBoolean(node.get('WrappedTimeScaleHeaderHyperlink'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
