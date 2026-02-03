/**
 * Парсер дочерних элементов формы - аналог FormChildItemsXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader
 * 
 * Основной парсер для всех типов элементов формы (поля, группы, кнопки, декорации, etc.)
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { FormItem } from '../model/FormItem';

// Импорты ридеров для отдельных типов
import { LabelFieldXmlPartReader } from './fields/LabelFieldXmlPartReader';
import { InputFieldXmlPartReader } from './fields/InputFieldXmlPartReader';
import { CheckBoxFieldXmlPartReader } from './fields/CheckBoxFieldXmlPartReader';
import { PictureFieldXmlPartReader } from './fields/PictureFieldXmlPartReader';
import { RadioButtonFieldXmlPartReader } from './fields/RadioButtonFieldXmlPartReader';

/**
 * Парсер дочерних элементов формы
 * 
 * Делегирует парсинг конкретных типов специализированным ридерам
 */
export class FormChildItemsXmlPartReader extends AbstractFormXmlPartReader {
    
    // Ридеры полей
    private readonly labelFieldReader: LabelFieldXmlPartReader;
    private readonly inputFieldReader: InputFieldXmlPartReader;
    private readonly checkBoxFieldReader: CheckBoxFieldXmlPartReader;
    private readonly pictureFieldReader: PictureFieldXmlPartReader;
    private readonly radioButtonFieldReader: RadioButtonFieldXmlPartReader;

    constructor() {
        super();
        this.labelFieldReader = new LabelFieldXmlPartReader();
        this.inputFieldReader = new InputFieldXmlPartReader();
        this.checkBoxFieldReader = new CheckBoxFieldXmlPartReader();
        this.pictureFieldReader = new PictureFieldXmlPartReader();
        this.radioButtonFieldReader = new RadioButtonFieldXmlPartReader();
    }

    /**
     * Читает все дочерние элементы из узла ChildItems
     */
    read(childItemsNode: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormItem[] {
        const items: FormItem[] = [];

        if (!childItemsNode.exists()) {
            return items;
        }

        // Итерируем по всем дочерним узлам
        for (const node of childItemsNode.children()) {
            const item = this.readChildItem(node, context, errorCollector);
            if (item) {
                items.push(item);
            }
        }

        return items;
    }

    /**
     * Читает один дочерний элемент в зависимости от его типа
     */
    private readChildItem(
        node: XmlNode, 
        context: XmlReaderContext, 
        errorCollector: XmlReadErrorCollector
    ): FormItem | undefined {
        const nodeName = node.name;

        switch (nodeName) {
            // === Поля ввода ===
            case 'LabelField':
            case 'LableField': // опечатка в старых версиях
                return this.labelFieldReader.read(node, context, errorCollector);

            case 'InputField':
                return this.inputFieldReader.read(node, context, errorCollector);

            case 'CheckBoxField':
                return this.checkBoxFieldReader.read(node, context, errorCollector);

            case 'PictureField':
                return this.pictureFieldReader.read(node, context, errorCollector);

            case 'RadioButtonField':
                return this.radioButtonFieldReader.read(node, context, errorCollector);

            // === Поля документов - TODO ===
            case 'SpreadSheetDocumentField':
            case 'TextDocumentField':
            case 'HTMLDocumentField':
            case 'FormattedDocumentField':
            case 'PDFDocumentField':
                errorCollector.addWarning(`Document field type "${nodeName}" not yet implemented`);
                return undefined;

            // === Поля специальных типов - TODO ===
            case 'CalendarField':
            case 'PeriodField':
            case 'ProgressBarField':
            case 'TrackBarField':
            case 'ChartField':
            case 'GanttChartField':
            case 'DendrogramField':
            case 'GraphicalSchemaField':
            case 'GeographicalSchemaField':
            case 'PlannerField':
                errorCollector.addWarning(`Special field type "${nodeName}" not yet implemented`);
                return undefined;

            // === Группы - TODO ===
            case 'UsualGroup':
            case 'Pages':
            case 'Page':
            case 'ColumnGroup':
            case 'ButtonGroup':
            case 'Popup':
            case 'CommandBar':
            case 'AutoCommandBar':
            case 'ContextMenu':
                errorCollector.addWarning(`Group type "${nodeName}" not yet implemented`);
                return undefined;

            // === Таблица - TODO ===
            case 'Table':
                errorCollector.addWarning(`Table not yet implemented`);
                return undefined;

            // === Кнопка - TODO ===
            case 'Button':
                errorCollector.addWarning(`Button not yet implemented`);
                return undefined;

            // === Декорации - TODO ===
            case 'PictureDecoration':
            case 'LabelDecoration':
            case 'LableDecoration':
                errorCollector.addWarning(`Decoration type "${nodeName}" not yet implemented`);
                return undefined;

            // === Дополнения - TODO ===
            case 'SearchStringAddition':
            case 'ViewStatusAddition':
            case 'SearchControlAddition':
                errorCollector.addWarning(`Addition type "${nodeName}" not yet implemented`);
                return undefined;

            // === Расширенная подсказка - TODO ===
            case 'ExtendedTooltip':
                // Обычно является вложенным элементом, игнорируем на верхнем уровне
                return undefined;

            default:
                errorCollector.addWarning(`Unknown child item type: "${nodeName}"`);
                return undefined;
        }
    }
}
