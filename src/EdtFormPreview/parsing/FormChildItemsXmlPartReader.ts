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

// Импорты ридеров для полей документов
import { 
    SpreadSheetDocumentFieldXmlPartReader,
    TextDocumentFieldXmlPartReader,
    HTMLDocumentFieldXmlPartReader,
    FormattedDocumentFieldXmlPartReader,
    PDFDocumentFieldXmlPartReader
} from './fields/documents';

// Импорты ридеров для специальных полей
import {
    CalendarFieldXmlPartReader,
    PeriodFieldXmlPartReader,
    ProgressBarFieldXmlPartReader,
    TrackBarFieldXmlPartReader,
    ChartFieldXmlPartReader,
    GanttChartFieldXmlPartReader,
    DendrogramFieldXmlPartReader,
    GraphicalSchemaFieldXmlPartReader,
    GeographicalSchemaFieldXmlPartReader,
    PlannerFieldXmlPartReader
} from './fields/special';

// Импорты ридеров для дополнений
import {
    SearchStringAdditionXmlPartReader,
    ViewStatusAdditionXmlPartReader,
    SearchControlAdditionXmlPartReader
} from './additions';

// Импорт ридера для контекстного меню
import { ContextMenuXmlPartReader } from './contextmenu';

// Импорт ридера для расширенной подсказки
import { ExtendedTooltipXmlPartReader } from './extendedtooltip';

// Импорт ридера для автокомандной панели
import { AutoCommandBarXmlPartReader } from './AutoCommandBarXmlPartReader';

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

    // Ридеры полей документов
    private readonly spreadSheetDocumentFieldReader: SpreadSheetDocumentFieldXmlPartReader;
    private readonly textDocumentFieldReader: TextDocumentFieldXmlPartReader;
    private readonly htmlDocumentFieldReader: HTMLDocumentFieldXmlPartReader;
    private readonly formattedDocumentFieldReader: FormattedDocumentFieldXmlPartReader;
    private readonly pdfDocumentFieldReader: PDFDocumentFieldXmlPartReader;

    // Ридеры специальных полей
    private readonly calendarFieldReader: CalendarFieldXmlPartReader;
    private readonly periodFieldReader: PeriodFieldXmlPartReader;
    private readonly progressBarFieldReader: ProgressBarFieldXmlPartReader;
    private readonly trackBarFieldReader: TrackBarFieldXmlPartReader;
    private readonly chartFieldReader: ChartFieldXmlPartReader;
    private readonly ganttChartFieldReader: GanttChartFieldXmlPartReader;
    private readonly dendrogramFieldReader: DendrogramFieldXmlPartReader;
    private readonly graphicalSchemaFieldReader: GraphicalSchemaFieldXmlPartReader;
    private readonly geographicalSchemaFieldReader: GeographicalSchemaFieldXmlPartReader;
    private readonly plannerFieldReader: PlannerFieldXmlPartReader;

    // Ридеры дополнений
    private readonly searchStringAdditionReader: SearchStringAdditionXmlPartReader;
    private readonly viewStatusAdditionReader: ViewStatusAdditionXmlPartReader;
    private readonly searchControlAdditionReader: SearchControlAdditionXmlPartReader;

    // Ридер контекстного меню
    private readonly contextMenuReader: ContextMenuXmlPartReader;

    // Ридер расширенной подсказки
    private readonly extendedTooltipReader: ExtendedTooltipXmlPartReader;

    // Ридер автокомандной панели
    private readonly autoCommandBarReader: AutoCommandBarXmlPartReader;

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

        // Инициализация ридеров полей документов
        this.spreadSheetDocumentFieldReader = new SpreadSheetDocumentFieldXmlPartReader();
        this.textDocumentFieldReader = new TextDocumentFieldXmlPartReader();
        this.htmlDocumentFieldReader = new HTMLDocumentFieldXmlPartReader();
        this.formattedDocumentFieldReader = new FormattedDocumentFieldXmlPartReader();
        this.pdfDocumentFieldReader = new PDFDocumentFieldXmlPartReader();

        // Инициализация ридеров специальных полей
        this.calendarFieldReader = new CalendarFieldXmlPartReader();
        this.periodFieldReader = new PeriodFieldXmlPartReader();
        this.progressBarFieldReader = new ProgressBarFieldXmlPartReader();
        this.trackBarFieldReader = new TrackBarFieldXmlPartReader();
        this.chartFieldReader = new ChartFieldXmlPartReader();
        this.ganttChartFieldReader = new GanttChartFieldXmlPartReader();
        this.dendrogramFieldReader = new DendrogramFieldXmlPartReader();
        this.graphicalSchemaFieldReader = new GraphicalSchemaFieldXmlPartReader();
        this.geographicalSchemaFieldReader = new GeographicalSchemaFieldXmlPartReader();
        this.plannerFieldReader = new PlannerFieldXmlPartReader();

        // Инициализация ридеров дополнений
        this.searchStringAdditionReader = new SearchStringAdditionXmlPartReader();
        this.viewStatusAdditionReader = new ViewStatusAdditionXmlPartReader();
        this.searchControlAdditionReader = new SearchControlAdditionXmlPartReader();

        // Инициализация ридера контекстного меню
        this.contextMenuReader = new ContextMenuXmlPartReader();

        // Инициализация ридера расширенной подсказки
        this.extendedTooltipReader = new ExtendedTooltipXmlPartReader();

        // Инициализация ридера автокомандной панели
        this.autoCommandBarReader = new AutoCommandBarXmlPartReader();

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
        this.contextMenuReader.setChildItemsReader(childItemsReader);
        this.autoCommandBarReader.setChildItemsReader(childItemsReader);
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

            // === Поля документов ===
            case 'SpreadSheetDocumentField':
                return this.spreadSheetDocumentFieldReader.read(node, context, errorCollector);

            case 'TextDocumentField':
                return this.textDocumentFieldReader.read(node, context, errorCollector);

            case 'HTMLDocumentField':
                return this.htmlDocumentFieldReader.read(node, context, errorCollector);

            case 'FormattedDocumentField':
                return this.formattedDocumentFieldReader.read(node, context, errorCollector);

            case 'PDFDocumentField':
                return this.pdfDocumentFieldReader.read(node, context, errorCollector);

            // === Поля специальных типов ===
            case 'CalendarField':
                return this.calendarFieldReader.read(node, context, errorCollector);

            case 'PeriodField':
                return this.periodFieldReader.read(node, context, errorCollector);

            case 'ProgressBarField':
                return this.progressBarFieldReader.read(node, context, errorCollector);

            case 'TrackBarField':
                return this.trackBarFieldReader.read(node, context, errorCollector);

            case 'ChartField':
                return this.chartFieldReader.read(node, context, errorCollector);

            case 'GanttChartField':
                return this.ganttChartFieldReader.read(node, context, errorCollector);

            case 'DendrogramField':
                return this.dendrogramFieldReader.read(node, context, errorCollector);

            case 'GraphicalSchemaField':
                return this.graphicalSchemaFieldReader.read(node, context, errorCollector);

            case 'GeographicalSchemaField':
                return this.geographicalSchemaFieldReader.read(node, context, errorCollector);

            case 'PlannerField':
                return this.plannerFieldReader.read(node, context, errorCollector);

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
                return this.autoCommandBarReader.read(node, context, errorCollector);

            case 'ContextMenu':
                return this.contextMenuReader.read(node, context, errorCollector);

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

            // === Дополнения ===
            case 'SearchStringAddition':
                return this.searchStringAdditionReader.read(node, context, errorCollector);

            case 'ViewStatusAddition':
                return this.viewStatusAdditionReader.read(node, context, errorCollector);

            case 'SearchControlAddition':
                return this.searchControlAdditionReader.read(node, context, errorCollector);

            // === Расширенная подсказка ===
            case 'ExtendedTooltip':
                return this.extendedTooltipReader.read(node, context, errorCollector);

            default:
                errorCollector.addWarning(`Unknown child item type: "${nodeName}"`);
                return undefined;
        }
    }
}

