/**
 * Парсер дочерних элементов формы - аналог FormChildItemsXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader
 * 
 * Основной парсер для всех типов элементов формы (поля, группы, кнопки, декорации, etc.)
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { FormItem } from '../model/FormItem';

// Импорты ридеров для отдельных типов полей
import { LabelFieldXmlPartReader } from './fields/LabelFieldXmlPartReader';
import { InputFieldXmlPartReader } from './fields/InputFieldXmlPartReader';
import { CheckBoxFieldXmlPartReader } from './fields/CheckBoxFieldXmlPartReader';
import { PictureFieldXmlPartReader } from './fields/PictureFieldXmlPartReader';
import { RadioButtonFieldXmlPartReader } from './fields/RadioButtonFieldXmlPartReader';

// Импорты ридеров для групп
import { UsualGroupXmlPartReader } from './groups/UsualGroupXmlPartReader';
import { PagesGroupXmlPartReader } from './groups/PagesGroupXmlPartReader';
import { PageGroupXmlPartReader } from './groups/PageGroupXmlPartReader';
import { ColumnGroupXmlPartReader } from './groups/ColumnGroupXmlPartReader';
import { ButtonGroupXmlPartReader } from './groups/ButtonGroupXmlPartReader';
import { PopupXmlPartReader } from './groups/PopupXmlPartReader';
import { CommandBarXmlPartReader } from './groups/CommandBarXmlPartReader';

// Импорты ридера для таблицы
import { TableXmlPartReader } from './table/TableXmlPartReader';

// Импорты ридера для кнопки
import { ButtonXmlPartReader } from './button/ButtonXmlPartReader';

// Импорты ридеров для декораций
import { LabelDecorationXmlPartReader } from './decoration/LabelDecorationXmlPartReader';
import { PictureDecorationXmlPartReader } from './decoration/PictureDecorationXmlPartReader';

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

    // Ридеры групп
    private readonly usualGroupReader: UsualGroupXmlPartReader;
    private readonly pagesGroupReader: PagesGroupXmlPartReader;
    private readonly pageGroupReader: PageGroupXmlPartReader;
    private readonly columnGroupReader: ColumnGroupXmlPartReader;
    private readonly buttonGroupReader: ButtonGroupXmlPartReader;
    private readonly popupReader: PopupXmlPartReader;
    private readonly commandBarReader: CommandBarXmlPartReader;

    // Ридер таблицы
    private readonly tableReader: TableXmlPartReader;

    // Ридер кнопки
    private readonly buttonReader: ButtonXmlPartReader;

    // Ридеры декораций
    private readonly labelDecorationReader: LabelDecorationXmlPartReader;
    private readonly pictureDecorationReader: PictureDecorationXmlPartReader;

    constructor() {
        super();
        
        // Инициализация ридеров полей
        this.labelFieldReader = new LabelFieldXmlPartReader();
        this.inputFieldReader = new InputFieldXmlPartReader();
        this.checkBoxFieldReader = new CheckBoxFieldXmlPartReader();
        this.pictureFieldReader = new PictureFieldXmlPartReader();
        this.radioButtonFieldReader = new RadioButtonFieldXmlPartReader();

        // Инициализация ридеров групп
        this.usualGroupReader = new UsualGroupXmlPartReader();
        this.pagesGroupReader = new PagesGroupXmlPartReader();
        this.pageGroupReader = new PageGroupXmlPartReader();
        this.columnGroupReader = new ColumnGroupXmlPartReader();
        this.buttonGroupReader = new ButtonGroupXmlPartReader();
        this.popupReader = new PopupXmlPartReader();
        this.commandBarReader = new CommandBarXmlPartReader();

        // Инициализация ридера таблицы
        this.tableReader = new TableXmlPartReader();

        // Инициализация ридера кнопки
        this.buttonReader = new ButtonXmlPartReader();

        // Инициализация ридеров декораций
        this.labelDecorationReader = new LabelDecorationXmlPartReader();
        this.pictureDecorationReader = new PictureDecorationXmlPartReader();

        // Устанавливаем callback для рекурсивного чтения дочерних элементов
        const childItemsReader = (node: XmlNode, ctx: XmlReaderContext, err: XmlReadErrorCollector) => 
            this.read(node, ctx, err);
        
        this.usualGroupReader.setChildItemsReader(childItemsReader);
        this.pagesGroupReader.setChildItemsReader(childItemsReader);
        this.pageGroupReader.setChildItemsReader(childItemsReader);
        this.columnGroupReader.setChildItemsReader(childItemsReader);
        this.buttonGroupReader.setChildItemsReader(childItemsReader);
        this.popupReader.setChildItemsReader(childItemsReader);
        this.commandBarReader.setChildItemsReader(childItemsReader);
        this.tableReader.setChildItemsReader(childItemsReader);
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

            // === Группы ===
            case 'UsualGroup':
                return this.usualGroupReader.read(node, context, errorCollector);

            case 'Pages':
                return this.pagesGroupReader.read(node, context, errorCollector);

            case 'Page':
                return this.pageGroupReader.read(node, context, errorCollector);

            case 'ColumnGroup':
                return this.columnGroupReader.read(node, context, errorCollector);

            case 'ButtonGroup':
                return this.buttonGroupReader.read(node, context, errorCollector);

            case 'Popup':
                return this.popupReader.read(node, context, errorCollector);

            case 'CommandBar':
                return this.commandBarReader.read(node, context, errorCollector);

            case 'AutoCommandBar':
                // AutoCommandBar имеет отдельный ридер
                errorCollector.addWarning(`AutoCommandBar not yet fully implemented`);
                return undefined;

            case 'ContextMenu':
                errorCollector.addWarning(`ContextMenu not yet implemented`);
                return undefined;

            // === Таблица ===
            case 'Table':
                return this.tableReader.read(node, context, errorCollector);

            // === Кнопка ===
            case 'Button':
                return this.buttonReader.read(node, context, errorCollector);

            // === Декорации ===
            case 'PictureDecoration':
                return this.pictureDecorationReader.read(node, context, errorCollector);
                
            case 'LabelDecoration':
            case 'LableDecoration': // опечатка в старых версиях
                return this.labelDecorationReader.read(node, context, errorCollector);

            // === Дополнения - TODO ===
            case 'SearchStringAddition':
            case 'ViewStatusAddition':
            case 'SearchControlAddition':
                errorCollector.addWarning(`Addition type "${nodeName}" not yet implemented`);
                return undefined;

            // === Расширенная подсказка ===
            case 'ExtendedTooltip':
                // Обычно является вложенным элементом, игнорируем на верхнем уровне
                return undefined;

            default:
                errorCollector.addWarning(`Unknown child item type: "${nodeName}"`);
                return undefined;
        }
    }
}

