/**
 * Ридер для поля табличного документа SpreadSheetDocumentField
 * По мотивам readSpreadSheetDocumentField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { SpreadSheetDocFieldExtInfo } from '../../../model/SpreadSheetDocFieldExtInfo';

/**
 * Ридер для поля табличного документа
 */
export class SpreadSheetDocumentFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает SpreadSheetDocumentField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'SpreadsheetDocumentField';

        // Создаем ExtInfo
        const extInfo: SpreadSheetDocFieldExtInfo = {};

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

        // Отображение
        extInfo.showGrid = this.readBoolean(node.get('ShowGrid'));
        extInfo.showHeaders = this.readBoolean(node.get('ShowHeaders'));
        extInfo.blackAndWhiteView = this.readBoolean(node.get('BlackAndWhiteView'));
        extInfo.protection = this.readBoolean(node.get('Protection'));
        extInfo.selectionShowMode = this.readEnum(node.get('SelectionShowMode'));

        // 8.3.16+ properties
        if (this.versionIsGreaterThan(context, '8.3.16')) {
            extInfo.drawingSelectionShowMode = this.readEnum(node.get('DrawingSelectionShowMode'));
        }

        // Редактирование
        extInfo.output = this.readEnum(node.get('Output'));
        extInfo.edit = this.readBoolean(node.get('Edit'));
        extInfo.showGroups = this.readBoolean(node.get('ShowGroups'));

        // Перетаскивание
        extInfo.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));
        extInfo.enableDrag = this.readBoolean(node.get('EnableDrag'));

        // Стиль
        extInfo.borderColor = this.readColor(node.get('BorderColor'));
        extInfo.viewScalingMode = this.readEnum(node.get('ViewScalingMode'));

        // 8.3.10+ properties
        if (this.versionIsAtLeast(context, '8.3.10')) {
            extInfo.showCellNames = this.readBoolean(node.get('ShowCellNames'));
            extInfo.showRowAndColumnNames = this.readBoolean(node.get('ShowRowAndColumnNames'));
            extInfo.pointerType = this.readEnum(node.get('PointerType'));
        }

        // 8.5.1+ properties
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.cellActionsButtonViewMode = this.readEnum(node.get('CellActionsButtonViewMode'));
            extInfo.spreadsheetDocumentMultipleSelectionPanelViewMode = this.readEnum(
                node.get('SpreadsheetDocumentMultipleSelectionPanelViewMode')
            );
        }

        // Полосы прокрутки
        extInfo.verticalScrollBar = this.readEnum(node.get('VerticalScrollBar'));
        extInfo.horizontalScrollBar = this.readEnum(node.get('HorizontalScrollBar'));

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
