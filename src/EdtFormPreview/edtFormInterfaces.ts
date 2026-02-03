/**
 * Интерфейсы для парсинга EDT форм (.form файлы) версии 8.5
 * Namespace: http://g5.1c.ru/v8/dt/form
 */

// Базовые типы значений
export interface LocalizedString {
  key: string;
  value: string;
}

export interface UserVisible {
  common: boolean;
}

export interface DataPath {
  segments: string;
}

export interface PictureRef {
  picture: string;
}

export interface EventHandler {
  event: string;
  name: string;
}

// Базовые интерфейсы элементов формы
export interface FormItemBase {
  name: string;
  id: number;
  visible?: boolean;
  enabled?: boolean;
  userVisible?: UserVisible;
  title?: LocalizedString | LocalizedString[];
  titleLocation?: string;
  extendedTooltip?: ExtendedTooltip;
  contextMenu?: ContextMenu;
}

export interface ExtendedTooltip {
  name: string;
  id: number;
  type?: string;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  extInfo?: LabelDecorationExtInfo;
}

export interface ContextMenu {
  name: string;
  id: number;
  autoFill?: boolean;
}

// ExtInfo типы для разных элементов
export interface LabelDecorationExtInfo {
  horizontalAlign?: string;
  handlers?: EventHandler[];
  hyperlink?: boolean;
}

export interface InputFieldExtInfo {
  handlers?: EventHandler[];
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  wrap?: boolean;
  chooseType?: boolean;
  typeDomainEnabled?: boolean;
  textEdit?: boolean;
  choiceHistoryOnInput?: string;
  width?: number;
  maxWidth?: number;
}

export interface LabelFieldExtInfo {
  handlers?: EventHandler[];
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  maxWidth?: number;
  hyperlink?: boolean;
  horizontalStretch?: boolean;
}

export interface CheckBoxFieldExtInfo {
  handlers?: EventHandler[];
}

export interface PictureDecorationExtInfo {
  handlers?: EventHandler[];
  picture?: PictureRef;
  hyperlink?: boolean;
  fileDragMode?: string;
}

export interface ImageFieldExtInfo {
  handlers?: EventHandler[];
}

export interface UsualGroupExtInfo {
  group?: 'Vertical' | 'AlwaysHorizontal' | 'HorizontalIfPossible';
  showLeftMargin?: boolean;
  united?: boolean;
  throughAlign?: string;
  currentRowUse?: string;
  representation?: string;
}

export interface PageGroupExtInfo {
  showTitle?: boolean;
}

export interface PagesGroupExtInfo {
  pagesRepresentation?: string;
}

export interface PopupGroupExtInfo {
  // Popup group specific properties
}

export interface ButtonGroupExtInfo {
  representation?: string;
}

export interface ColumnGroupExtInfo {
  group?: string;
  showTitle?: boolean;
}

export interface CommandBarExtInfo {
  commandSource?: string;
}

// Дополнительные FieldExtInfo типы
export interface RadioButtonsFieldExtInfo {
  handlers?: EventHandler[];
  columnsCount?: number;
}

export interface CalendarFieldExtInfo {
  handlers?: EventHandler[];
  showCurrentDate?: boolean;
  calendarNavigation?: boolean;
}

export interface ChartFieldExtInfo {
  handlers?: EventHandler[];
}

export interface ProgressBarFieldExtInfo {
  handlers?: EventHandler[];
  minValue?: number;
  maxValue?: number;
  orientation?: string;
}

export interface TrackBarFieldExtInfo {
  handlers?: EventHandler[];
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export interface PeriodFieldExtInfo {
  handlers?: EventHandler[];
}

// Обобщённый интерфейс для неизвестных типов полей
export interface GenericFieldExtInfo {
  handlers?: EventHandler[];
  [key: string]: any;
}

// Элементы формы
export interface FormDecoration extends FormItemBase {
  type?: 'Label' | 'Picture';
  maxWidth?: number;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  extInfo?: LabelDecorationExtInfo | PictureDecorationExtInfo;
}

export interface FormField extends FormItemBase {
  dataPath?: DataPath;
  handlers?: EventHandler[];
  type?: 
    | 'InputField' 
    | 'LabelField' 
    | 'CheckBoxField' 
    | 'ImageField'
    | 'HTMLDocumentField'
    | 'GeographicalSchemaField'
    | 'GraphicalSchemaField'
    | 'DendrogramField'
    | 'ChartField'
    | 'GanttChartField'
    | 'ProgressBarField'
    | 'CalendarField'
    | 'RadioButtonField'
    | 'TrackBarField'
    | 'SpreadsheetDocumentField'
    | 'TextDocumentField'
    | 'FormattedDocumentField'
    | 'PlannerField'
    | 'PeriodField'
    | 'PDFDocumentField'
    | 'PictureField';
  editMode?: string;
  showInHeader?: boolean;
  headerHorizontalAlign?: string;
  showInFooter?: boolean;
  maxWidth?: number;
  horizontalStretch?: boolean;
  extInfo?: 
    | InputFieldExtInfo 
    | LabelFieldExtInfo 
    | CheckBoxFieldExtInfo 
    | ImageFieldExtInfo
    | RadioButtonsFieldExtInfo
    | CalendarFieldExtInfo
    | ChartFieldExtInfo
    | ProgressBarFieldExtInfo
    | TrackBarFieldExtInfo
    | PeriodFieldExtInfo
    | GenericFieldExtInfo;
}

export interface FormGroup extends FormItemBase {
  items?: FormItem[];
  type?: 'UsualGroup' | 'Pages' | 'Page' | 'CommandBar' | 'Popup' | 'ButtonGroup' | 'ColumnGroup' | 'ContextMenu' | 'AutoCommandBar' | 'Navigator' | 'SelectedItemsActionsPanel' | 'RowActionsPanel';
  extInfo?: UsualGroupExtInfo | PageGroupExtInfo | PagesGroupExtInfo | PopupGroupExtInfo | ButtonGroupExtInfo | ColumnGroupExtInfo | CommandBarExtInfo;
}

export interface FormTable extends FormItemBase {
  dataPath?: DataPath;
  items?: FormItem[];
  handlers?: EventHandler[];
  autoCommandBar?: AutoCommandBar;
  searchStringAddition?: SearchStringAddition;
  viewStatusAddition?: ViewStatusAddition;
  searchControlAddition?: SearchControlAddition;
}

export interface FormButton extends FormItemBase {
  commandName?: string;
  handlers?: EventHandler[];
  representation?: string;
}

export interface AutoCommandBar {
  name: string;
  id: number;
  items?: FormItem[];
}

export interface SearchStringAddition {
  name: string;
  id: number;
}

export interface ViewStatusAddition {
  name: string;
  id: number;
}

export interface SearchControlAddition {
  name: string;
  id: number;
}

// Объединённый тип для элементов формы
export type FormItem = FormDecoration | FormField | FormGroup | FormTable | FormButton;

// Команды формы
export interface FormCommand {
  name: string;
  id: number;
  title?: LocalizedString | LocalizedString[];
  toolTip?: LocalizedString | LocalizedString[];
  use?: UserVisible;
  picture?: PictureRef;
  action?: FormCommandAction;
  representation?: string;
  modifiesStoredData?: boolean;
  currentRowUse?: string;
  functionalOptions?: string;
}

export interface FormCommandAction {
  handler?: { name: string };
}

// Атрибуты формы
export interface FormAttribute {
  name: string;
  id: number;
  title?: LocalizedString | LocalizedString[];
  type?: AttributeType;
  mainAttribute?: boolean;
  savedData?: boolean;
  fillCheck?: string;
}

export interface AttributeType {
  types?: string[];
}

// Основной интерфейс формы
export interface EdtForm {
  items?: FormItem[];
  autoCommandBar?: AutoCommandBar;
  formCommands?: FormCommand[];
  attributes?: FormAttribute[];
  parameters?: FormParameter[];
  handlers?: EventHandler[];
  commandInterface?: CommandInterface;
  extInfo?: FormExtInfo;
  
  // Свойства формы
  title?: LocalizedString | LocalizedString[];
  width?: number;
  height?: number;
  autoTitle?: boolean;
  windowOpeningMode?: string;
}

export interface FormParameter {
  name: string;
  id: number;
}

export interface CommandInterface {
  navigationPanel?: object;
  commandBar?: object;
}

export interface FormExtInfo {
  handlers?: EventHandler[];
  repostOnWrite?: boolean;
}

// Тип для определения xsi:type элемента
export type FormItemXsiType = 
  | 'form:FormGroup'
  | 'form:FormField'
  | 'form:Table'
  | 'form:Button'
  | 'form:Decoration';

export type ExtInfoXsiType =
  // Field ExtInfo types
  | 'form:InputFieldExtInfo'
  | 'form:LabelFieldExtInfo'
  | 'form:CheckBoxFieldExtInfo'
  | 'form:ImageFieldExtInfo'
  | 'form:RadioButtonsFieldExtInfo'
  | 'form:CalendarFieldExtInfo'
  | 'form:ChartFieldExtInfo'
  | 'form:GanttChartFieldExtInfo'
  | 'form:DendrogramFieldExtInfo'
  | 'form:ProgressBarFieldExtInfo'
  | 'form:TrackBarFieldExtInfo'
  | 'form:PeriodFieldExtInfo'
  | 'form:PlannerFieldExtInfo'
  | 'form:HtmlFieldExtInfo'
  | 'form:SpreadSheetDocFieldExtInfo'
  | 'form:TextDocFieldExtInfo'
  | 'form:FormattedDocFieldExtInfo'
  | 'form:GeographicalMapFieldExtInfo'
  | 'form:FlowchartFieldExtInfo'
  | 'form:PDFDocumentFieldExtInfo'
  // Decoration ExtInfo types
  | 'form:LabelDecorationExtInfo'
  | 'form:PictureDecorationExtInfo'
  // Group ExtInfo types
  | 'form:UsualGroupExtInfo'
  | 'form:PageGroupExtInfo'
  | 'form:PagesGroupExtInfo'
  | 'form:PopupGroupExtInfo'
  | 'form:ButtonGroupExtInfo'
  | 'form:ColumnGroupExtInfo'
  | 'form:CommandBarExtInfo'
  // Form ExtInfo types
  | 'form:DocumentFormExtInfo'
  | 'form:CatalogFormExtInfo'
  | 'form:ReportFormExtInfo'
  | 'form:ObjectFormExtInfo'
  | 'form:RecordSetFormExtInfo'
  | 'form:TaskFormExtInfo'
  | 'form:BusinessProcesFormExtInfo'
  // Table/Addition ExtInfo types
  | 'form:ValueListExtInfo'
  | 'form:DynamicListTableExtInfo'
  | 'form:TableExtInfo'
  | 'form:ViewStatusAdditionExtInfo'
  | 'form:SearchStringAdditionExtInfo'
  | 'form:SearchControlAdditionExtInfo';

// Интерфейс для распарсенного XML узла с xsi:type
export interface ParsedFormNode {
  '$_xsi:type'?: string;
  [key: string]: any;
}
