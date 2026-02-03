/**
 * Ридер для поля диаграммы Ганта GanttChartField
 * По мотивам readGanttChartField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from '../AbstractFormFieldXmlPartReader';
import { FormField } from '../../../model/FormField';
import { FormItem } from '../../../model/FormItem';
import { GanttChartFieldExtInfo } from '../../../model/GanttChartFieldExtInfo';
import { TableXmlPartReader } from '../../table/TableXmlPartReader';

/**
 * Ридер для поля диаграммы Ганта
 */
export class GanttChartFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    private tableReader: TableXmlPartReader;

    constructor() {
        super();
        this.tableReader = new TableXmlPartReader();
    }

    /**
     * Устанавливает callback для чтения дочерних элементов
     */
    setChildItemsReader(reader: (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[]): void {
        this.tableReader.setChildItemsReader(reader);
    }

    /**
     * Читает GanttChartField из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        field.type = 'GanttChartField';

        // Создаем ExtInfo
        const extInfo: GanttChartFieldExtInfo = {};

        // 8.3.20+ properties - Table inside GanttChart
        if (this.versionIsGreaterThan(context, '8.3.20')) {
            const tableNode = node.get('Table');
            if (tableNode.exists()) {
                // Читаем встроенную таблицу
                extInfo.autoTable = this.tableReader.read(tableNode, context, errorCollector);
            }
            extInfo.tableLocation = this.readEnum(node.get('TableLocation'));
        }

        // 8.3.22+ properties
        if (this.versionIsGreaterThan(context, '8.3.22')) {
            extInfo.valuesSelectionMode = this.readEnum(node.get('ValuesSelectionMode'));
            extInfo.intervalsSelectionMode = this.readEnum(node.get('IntervalsSelectionMode'));
            extInfo.showHorizontalLinesFlag = this.readBoolean(node.get('ShowHorizontalLinesFlag'));
            extInfo.showVerticalLinesFlag = this.readBoolean(node.get('ShowVerticalLinesFlag'));
        }

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

        field.extInfo = extInfo;

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
