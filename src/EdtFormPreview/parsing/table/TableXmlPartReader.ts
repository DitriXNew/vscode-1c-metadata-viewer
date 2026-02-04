/**
 * TableXmlPartReader - парсер таблицы формы
 * @see com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader#readTable
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { Table } from '../../model/Table';
import { FormItem } from '../../model/FormItem';
import { DynamicListTableExtInfo } from '../../model/DynamicListTableExtInfo';
import { EventHandler } from '../../model/EventHandler';
import { SearchStringAdditionXmlPartReader } from '../additions/SearchStringAdditionXmlPartReader';
import { ViewStatusAdditionXmlPartReader } from '../additions/ViewStatusAdditionXmlPartReader';
import { SearchControlAdditionXmlPartReader } from '../additions/SearchControlAdditionXmlPartReader';
import { AutoCommandBarXmlPartReader } from '../AutoCommandBarXmlPartReader';
import { ContextMenuXmlPartReader } from '../contextmenu/ContextMenuXmlPartReader';
import { ExtendedTooltipXmlPartReader } from '../extendedtooltip/ExtendedTooltipXmlPartReader';

/** Свойства, которые указывают на DynamicListTableExtInfo */
const DYNAMIC_LIST_FEATURES = [
    'AutoRefresh', 'AutoRefreshPeriod', 'ChoiceFoldersAndItems', 
    'RestoreCurrentRow', 'ShowRoot', 'AllowRootChoice', 
    'AllowGettingCurrentRowURL', 'UpdateOnDataChange', 'UserSettingsGroup'
];

/** Тип callback-функции для чтения дочерних элементов */
type ChildItemsReaderCallback = (node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector) => FormItem[];

/**
 * Ридер для парсинга Table
 */
export class TableXmlPartReader extends AbstractFormXmlPartReader {
    
    private childItemsReader?: ChildItemsReaderCallback;
    
    // Ридеры для вложенных элементов
    private readonly searchStringAdditionReader: SearchStringAdditionXmlPartReader;
    private readonly viewStatusAdditionReader: ViewStatusAdditionXmlPartReader;
    private readonly searchControlAdditionReader: SearchControlAdditionXmlPartReader;
    private readonly autoCommandBarReader: AutoCommandBarXmlPartReader;
    private readonly contextMenuReader: ContextMenuXmlPartReader;
    private readonly extendedTooltipReader: ExtendedTooltipXmlPartReader;

    constructor() {
        super();
        this.searchStringAdditionReader = new SearchStringAdditionXmlPartReader();
        this.viewStatusAdditionReader = new ViewStatusAdditionXmlPartReader();
        this.searchControlAdditionReader = new SearchControlAdditionXmlPartReader();
        this.autoCommandBarReader = new AutoCommandBarXmlPartReader();
        this.contextMenuReader = new ContextMenuXmlPartReader();
        this.extendedTooltipReader = new ExtendedTooltipXmlPartReader();
    }

    /**
     * Устанавливает callback для рекурсивного чтения дочерних элементов
     */
    setChildItemsReader(reader: ChildItemsReaderCallback): void {
        this.childItemsReader = reader;
        // Также устанавливаем reader для вложенных элементов
        this.autoCommandBarReader.setChildItemsReader(reader);
        this.contextMenuReader.setChildItemsReader(reader);
    }

    /**
     * Читает Table
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): Table {
        const table: Table = {
            id: this.readId(node) ?? 0,
            name: node.get('name').text() ?? ''
        };
        
        // Устанавливаем тип для идентификации
        (table as any).type = 'Table';
        
        table.displayImportance = this.readDisplayImportance(node);
        
        // === Представление ===
        table.representation = this.readEnum(node.get('Representation'));
        
        // === Видимость ===
        table.visible = this.readBoolean(node.get('Visible'));
        table.userVisible = this.readUserVisible(node.get('UserVisible'));
        table.enabled = this.readBoolean(node.get('Enabled'));
        
        // === Командная панель ===
        table.commandBarLocation = this.readEnum(node.get('CommandBarLocation'));
        if (this.versionIsAtLeast(context, '8.5.1')) {
            this.readShowCommandBar(node, table, context, errorCollector);
        }
        
        // === Основные свойства ===
        table.autoFill = this.readBoolean(node.get('Autofill'));
        table.readOnly = this.readBoolean(node.get('ReadOnly'));
        table.skipOnInput = this.readBoolean(node.get('SkipOnInput'));
        table.defaultItem = this.readBoolean(node.get('DefaultItem'));
        table.changeRowSet = this.readBoolean(node.get('ChangeRowSet'));
        table.changeRowOrder = this.readBoolean(node.get('ChangeRowOrder'));
        
        // === Размеры ===
        table.width = this.readNumber(node.get('Width'));
        table.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        table.maxWidth = this.readNumber(node.get('MaxWidth'));
        table.minWidth = this.readNumber(node.get('MinWidth'));
        table.height = this.readNumber(node.get('Height'));
        table.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        table.maxHeight = this.readNumber(node.get('MaxHeight'));
        table.heightInTableRows = this.readNumber(node.get('HeightInTableRows'));
        
        if (this.versionIsAtLeast(context, '8.3.9')) {
            table.heightControlVariant = this.readEnum(node.get('HeightControlVariant'));
        }
        
        if (this.versionIsAtLeast(context, '8.3.10')) {
            table.autoMaxRowsCount = this.readBoolean(node.get('AutoMaxRowsCount'));
            table.maxRowsCount = this.readNumber(node.get('MaxRowsCount'));
        }
        
        if (this.versionIsAtLeast(context, '8.3.12')) {
            table.currentRowUse = this.readEnum(node.get('CurrentRowUse'));
            table.behaviorOnHorizontalCompression = this.readEnum(node.get('BehaviorOnHorizontalCompression'));
        }
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.cardBehaviorOnVerticalCompression = this.readEnum(node.get('CardBehaviorOnVerticalCompression'));
            table.autoMaxCardHeight = this.readBoolean(node.get('AutoMaxCardHeight'));
            table.maxCardHeight = this.readNumber(node.get('MaxCardHeight'));
        }
        
        // === Режимы выбора и ввода ===
        table.choiceMode = this.readBoolean(node.get('ChoiceMode'));
        table.multipleChoice = this.readBoolean(node.get('MultipleChoice'));
        table.rowInputMode = this.readEnum(node.get('RowInputMode'));
        table.selectionMode = this.readEnum(node.get('SelectionMode'));
        table.rowSelectionMode = this.readEnum(node.get('RowSelectionMode'));
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.rowActionsShowType = this.readEnum(node.get('RowActionsShowType'));
        }
        
        // === Шапка и подвал ===
        table.header = this.readBoolean(node.get('Header'));
        table.headerHeight = this.readNumber(node.get('HeaderHeight'));
        table.footer = this.readBoolean(node.get('Footer'));
        table.footerHeight = this.readNumber(node.get('FooterHeight'));
        
        // === Полосы прокрутки ===
        table.horizontalScrollBar = this.readEnum(node.get('HorizontalScrollBar'));
        table.verticalScrollBar = this.readEnum(node.get('VerticalScrollBar'));
        
        // === Линии и чередование (зависит от версии) ===
        if (!this.versionIsAtLeast(context, '8.5.1')) {
            table.horizontalLines = this.readBoolean(node.get('HorizontalLines'));
            table.verticalLines = this.readBoolean(node.get('VerticalLines'));
            table.useAlternationRowColor = this.readBoolean(node.get('UseAlternationRowColor'));
        } else {
            table.horizontalLinesBWA = this.readBoolean(node.get('HorizontalLinesBWA'));
            table.verticalLinesBWA = this.readBoolean(node.get('VerticalLinesBWA'));
            table.useAlternationRowColorBWA = this.readBoolean(node.get('UseAlternationRowColorBWA'));
        }
        
        // === Авто добавление и поиск ===
        table.autoInsertNewRow = this.readBoolean(node.get('AutoInsertNewRow'));
        table.autoAddIncomplete = this.readBoolean(node.get('AutoAddIncomplete'));
        table.autoMarkIncomplete = this.readBoolean(node.get('AutoMarkIncomplete'));
        table.searchOnInput = this.readEnum(node.get('SearchOnInput'));
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.markRequiredComplete = this.readBoolean(node.get('MarkRequiredComplete'));
        }
        
        // === Начальный вид ===
        table.initialListView = this.readEnum(node.get('InitialListView'));
        table.initialTreeView = this.readEnum(node.get('InitialTreeView'));
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.initialRowActivation = this.readEnum(node.get('InitialRowActivation'));
        }
        
        // === Вывод и растягивание ===
        table.output = this.readEnum(node.get('Output'));
        table.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        table.verticalStretch = this.readBoolean(node.get('VerticalStretch'));
        
        // === Перетаскивание ===
        table.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));
        table.enableDrag = this.readBoolean(node.get('EnableDrag'));
        
        if (this.versionIsAtLeast(context, '8.3.13')) {
            table.fileDragMode = this.readEnum(node.get('FileDragMode'));
        }
        
        // === Путь к данным ===
        table.dataPath = this.readDataPath(node.get('DataPath'));
        
        // === Картинки ===
        const rowPicturePath = this.readDataPath(node.get('RowPictureDataPath'));
        if (rowPicturePath && rowPicturePath.segments) {
            table.rowPictureDataPath = { 
                segments: [rowPicturePath.segments], 
                objects: [], 
                extraPaths: [] 
            };
        }
        table.rowsPicture = this.readPicture(node.get('RowsPicture'));
        
        // === Цвета и шрифты ===
        table.textColor = this.readColor(node.get('TextColor'));
        table.backColor = this.readColor(node.get('BackColor'));
        table.borderColor = this.readColor(node.get('BorderColor'));
        table.font = this.readFont(node.get('Font'));
        
        // === Заголовок ===
        table.title = this.readLocalizedString(node.get('Title'));
        table.titleHeight = this.readNumber(node.get('TitleHeight'));
        table.titleFont = this.readFont(node.get('TitleFont'));
        table.titleTextColor = this.readColor(node.get('TitleTextColor'));
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.saveColors = this.readEnum(node.get('SaveColors'));
            table.iconSaveColorsKey = node.get('IconSaveColorsKey').text();
            table.shapeSaveColorsKey = node.get('ShapeSaveColorsKey').text();
            table.cellHyperlinksRepresentation = this.readEnum(node.get('CellHyperlinksRepresentation'));
        }
        
        table.titleLocation = this.readEnum(node.get('TitleLocation'));
        table.titleBackColor = this.readColor(node.get('TitleBackColor'));
        table.shortcut = node.get('Shortcut').text();
        
        // === Исключённые команды ===
        const excludedCommands = node.get('CommandSet').getAll('ExcludedCommand');
        if (excludedCommands.length > 0) {
            table.excludedCommands = excludedCommands
                .map(cmd => cmd.text())
                .filter((t): t is string => t !== undefined);
        }
        
        // === Подсказка ===
        table.toolTip = this.readLocalizedString(node.get('ToolTip'));
        table.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));
        
        // === Расположение элементов поиска ===
        table.searchStringLocation = this.readEnum(node.get('SearchStringLocation'));
        table.viewStatusLocation = this.readEnum(node.get('ViewStatusLocation'));
        table.searchControlLocation = this.readEnum(node.get('SearchControlLocation'));
        
        // === Выравнивание в группе ===
        table.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));
        table.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));
        
        // === Прочее ===
        table.refreshRequest = this.readEnum(node.get('RefreshRequest'));
        table.viewMode = node.get('ViewMode').text();
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.complexSettingsViewMode = node.get('ComplexSettingsViewMode').text();
        }
        
        table.settingsNamedItemDetailedRepresentation = this.readBoolean(node.get('SettingsNamedItemDetailedRepresentation'));
        table.rowFilter = node.get('RowFilter').text();
        
        if (this.versionIsAtLeast(context, '8.3.16')) {
            table.onMainServerUnavalableBehavior = node.get('OnMainServerUnavalableBehavior').text();
        }
        
        if (this.versionIsAtLeast(context, '8.5.1')) {
            table.hierarchyPanelLocation = this.readEnum(node.get('HierarchyPanelLocation'));
            table.mobileDeviceTableType = this.readEnum(node.get('MobileDeviceTableType'));
        }
        
        // === Дополнения (Additions) ===
        const searchStringNode = node.get('SearchStringAddition');
        if (searchStringNode.exists()) {
            table.searchStringAddition = this.searchStringAdditionReader.read(searchStringNode, context, errorCollector);
        }
        
        const viewStatusNode = node.get('ViewStatusAddition');
        if (viewStatusNode.exists()) {
            table.viewStatusAddition = this.viewStatusAdditionReader.read(viewStatusNode, context, errorCollector);
        }
        
        const searchControlNode = node.get('SearchControlAddition');
        if (searchControlNode.exists()) {
            table.searchControlAddition = this.searchControlAdditionReader.read(searchControlNode, context, errorCollector);
        }
        
        // === ExtInfo ===
        this.readTableExtInfo(node, table, context, errorCollector);
        
        // === AutoCommandBar ===
        const autoCommandBarNode = node.get('AutoCommandBar');
        if (autoCommandBarNode.exists()) {
            table.autoCommandBar = this.autoCommandBarReader.read(autoCommandBarNode, context, errorCollector);
        }
        
        // === Контекстное меню ===
        table.contextMenu = this.contextMenuReader.readFromParent(node, context, errorCollector);
        
        // === Расширенная подсказка ===
        table.extendedTooltip = this.extendedTooltipReader.readFromParent(node, context, errorCollector);
        
        // === Обработчики событий ===
        table.handlers = this.readEventHandlers(node.get('Events'));
        
        // === Дочерние элементы (колонки) ===
        if (this.childItemsReader) {
            table.items = this.childItemsReader(node.get('ChildItems'), context, errorCollector);
        }
        
        return table;
    }

    /**
     * Читает ShowCommandBar с учётом значения 'auto' (8.5.1+)
     */
    private readShowCommandBar(node: XmlNode, table: Table, _context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): void {
        const showCommandBarNode = node.get('ShowCommandBar');
        const text = showCommandBarNode.text();
        
        if (text === 'auto') {
            table.showCommandBarNeedDereferenced = true;
            // showCommandBar остаётся undefined - нужно разыменование
        } else if (text) {
            (table as any).showCommandBar = text.toLowerCase() === 'true';
        }
    }

    /**
     * Определяет, есть ли свойства DynamicListTableExtInfo
     */
    private hasDynamicListTableExtInfoProperty(node: XmlNode): boolean {
        for (const featureName of DYNAMIC_LIST_FEATURES) {
            if (node.get(featureName).exists()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Читает обработчики событий
     */
    private readEventHandlers(eventsNode: XmlNode): EventHandler[] | undefined {
        if (!eventsNode.exists()) {
            return undefined;
        }
        
        const handlers: EventHandler[] = [];
        const eventNodes = eventsNode.getAll('Event');
        
        for (const eventNode of eventNodes) {
            const name = eventNode.attribute('name');
            const handler = eventNode.text();
            
            if (name) {
                handlers.push({ name, event: handler || '' });
            }
        }
        
        return handlers.length > 0 ? handlers : undefined;
    }

    /**
     * Читает TableExtInfo
     * Если есть свойства динамического списка, создаёт DynamicListTableExtInfo
     */
    private readTableExtInfo(node: XmlNode, table: Table, context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): void {
        if (this.hasDynamicListTableExtInfoProperty(node)) {
            const extInfo: DynamicListTableExtInfo = {};
            
            extInfo.autoRefresh = this.readBoolean(node.get('AutoRefresh'));
            extInfo.autoRefreshPeriod = this.readNumber(node.get('AutoRefreshPeriod'));
            extInfo.period = this.readStandardPeriod(node.get('Period'));
            extInfo.choiceFoldersAndItems = this.readEnum(node.get('ChoiceFoldersAndItems'));
            extInfo.restoreCurrentRow = this.readBoolean(node.get('RestoreCurrentRow'));
            extInfo.topLevelParent = node.get('TopLevelParent').text();
            extInfo.showRoot = this.readBoolean(node.get('ShowRoot'));
            extInfo.allowRootChoice = this.readBoolean(node.get('AllowRootChoice'));
            
            if (this.versionIsAtLeast(context, '8.3.21')) {
                extInfo.allowGettingCurrentRowURL = this.readBoolean(node.get('AllowGettingCurrentRowURL'));
            }
            
            extInfo.updateOnDataChange = this.readEnum(node.get('UpdateOnDataChange'));
            extInfo.userSettingsGroup = node.get('UserSettingsGroup').text();
            
            table.extInfo = extInfo;
        }
    }

    /**
     * Читает StandardPeriod
     */
    private readStandardPeriod(node: XmlNode): { startDate?: string; endDate?: string; variant?: string } | undefined {
        if (!node.exists()) {
            return undefined;
        }
        
        return {
            startDate: node.get('StartDate').text(),
            endDate: node.get('EndDate').text(),
            variant: node.get('Variant').text()
        };
    }
}
