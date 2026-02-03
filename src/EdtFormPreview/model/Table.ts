/**
 * Table - таблица формы
 * @see com._1c.g5.v8.dt.form.model.Table
 * 
 * Наследует:
 * - DataItem
 * - FieldSource
 * - FormStandardCommandSource
 * - AdditionSource
 * - TooltipContainer
 * - FormItemContainer
 * - CommandBarHolder
 * - EventHandlerContainer
 * - AdditionContainer
 * - ExtendedTooltipHolder
 * - ContextMenuHolder
 * - SelectedItemsActionsPanelHolder
 * - RowActionsPanelHolder
 */
import { DataItem } from './DataItem';
import { FormItem } from './FormItem';
import { TooltipContainer } from './TooltipContainer';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './Color';
import { Font } from './Font';
import { Picture } from './Picture';
import { EventHandler } from './EventHandler';
import { ExtendedTooltip } from './ExtendedTooltip';
import { TableRepresentation } from './TableRepresentation';
import { TableSelectionMode } from './TableSelectionMode';
import { TableRowInputMode } from './TableRowInputMode';
import { SearchOnInput } from './SearchOnInput';
import { TableScrollBarUse } from './TableScrollBarUse';
import { TableInitialTreeView } from './TableInitialTreeView';
import { AutoCommandBar } from './AutoCommandBar';
import { AbstractDataPath } from './AbstractDataPath';
import { TableRowSelectionMode } from './TableRowSelectionMode';
import { TableRowActionsShowType } from './TableRowActionsShowType';
import { LogFormTableHeightControlVariant } from './LogFormTableHeightControlVariant';
import { UseOutput } from './UseOutput';
import { FileDragMode } from './FileDragMode';
import { SaveTableAppearance } from './SaveTableAppearance';
import { CellHyperlinksRepresentation } from './CellHyperlinksRepresentation';
import { SearchStringLocation } from './SearchStringLocation';
import { ViewStatusLocation } from './ViewStatusLocation';
import { SearchControlLocation } from './SearchControlLocation';
import { HierarchyPanelLocation } from './HierarchyPanelLocation';
import { RefreshRequestMethod } from './RefreshRequestMethod';
import { TableCurrentRowUse } from './TableCurrentRowUse';
import { TableBehaviorOnHorizontalCompression } from './TableBehaviorOnHorizontalCompression';
import { CardBehaviorOnVerticalCompression } from './CardBehaviorOnVerticalCompression';
import { TableInitialListView } from './TableInitialListView';
import { TableInitialRowActivation } from './TableInitialRowActivation';
import { FormTableType } from './FormTableType';
import { TableExtInfo } from './TableExtInfo';
import { SearchStringAdditionExtInfo } from './SearchStringAdditionExtInfo';
import { ViewStatusAdditionExtInfo } from './ViewStatusAdditionExtInfo';
import { SearchControlAdditionExtInfo } from './SearchControlAdditionExtInfo';

export interface Table extends DataItem, TooltipContainer {
  /** Дочерние элементы (колонки) */
  items?: FormItem[];
  
  /** Обработчики событий */
  handlers?: EventHandler[];
  
  /** Представление */
  representation?: TableRepresentation;
  
  /** Авто заполнение */
  autoFill?: boolean;
  
  /** Только для чтения */
  readOnly?: boolean;
  
  /** Изменение набора строк */
  changeRowSet?: boolean;
  
  /** Изменение порядка строк */
  changeRowOrder?: boolean;
  
  /** Ширина */
  width?: number;
  
  /** Авто максимальная ширина */
  autoMaxWidth?: boolean;
  
  /** Максимальная ширина */
  maxWidth?: number;
  
  /** Минимальная ширина */
  minWidth?: number;
  
  /** Высота */
  height?: number;
  
  /** Авто максимальная высота */
  autoMaxHeight?: boolean;
  
  /** Максимальная высота */
  maxHeight?: number;
  
  /** Высота в строках таблицы */
  heightInTableRows?: number;
  
  /** Вариант управления высотой */
  heightControlVariant?: LogFormTableHeightControlVariant;
  
  /** Авто максимальное количество строк */
  autoMaxRowsCount?: boolean;
  
  /** Максимальное количество строк */
  maxRowsCount?: number;
  
  /** Режим выбора (включён ли) */
  choiceMode?: boolean;
  
  /** Множественный выбор */
  multipleChoice?: boolean;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Режим ввода строки */
  rowInputMode?: TableRowInputMode;
  
  /** Режим выбора */
  selectionMode?: TableSelectionMode;
  
  /** Режим выбора строк */
  rowSelectionMode?: TableRowSelectionMode;
  
  /** Тип отображения действий строки */
  rowActionsShowType?: TableRowActionsShowType;
  
  /** Шапка */
  header?: boolean;
  
  /** Высота шапки */
  headerHeight?: number;
  
  /** Подвал */
  footer?: boolean;
  
  /** Высота подвала */
  footerHeight?: number;
  
  /** Горизонтальная полоса прокрутки */
  horizontalScrollBar?: TableScrollBarUse;
  
  /** Вертикальная полоса прокрутки */
  verticalScrollBar?: TableScrollBarUse;
  
  /** Горизонтальные линии */
  horizontalLines?: boolean;
  
  /** Вертикальные линии */
  verticalLines?: boolean;
  
  /** Использовать чередование цвета строк */
  useAlternationRowColor?: boolean;
  
  /** Горизонтальные линии (BWA) */
  horizontalLinesBWA?: boolean;
  
  /** Вертикальные линии (BWA) */
  verticalLinesBWA?: boolean;
  
  /** Использовать чередование цвета строк (BWA) */
  useAlternationRowColorBWA?: boolean;
  
  /** Авто вставка новой строки */
  autoInsertNewRow?: boolean;
  
  /** Авто добавление незаполненного */
  autoAddIncomplete?: boolean;
  
  /** Авто пометка незаполненного */
  autoMarkIncomplete?: boolean;
  
  /** Поиск при вводе */
  searchOnInput?: SearchOnInput;
  
  /** Отметка обязательного заполнения */
  markRequiredComplete?: boolean;
  
  /** Начальное представление списка */
  initialListView?: TableInitialListView;
  
  /** Начальное представление дерева */
  initialTreeView?: TableInitialTreeView;
  
  /** Начальная активация строки */
  initialRowActivation?: TableInitialRowActivation;
  
  /** Вывод */
  output?: UseOutput;
  
  /** Разрешить начало перетаскивания */
  enableStartDrag?: boolean;
  
  /** Разрешить перетаскивание */
  enableDrag?: boolean;
  
  /** Режим перетаскивания файлов */
  fileDragMode?: FileDragMode;
  
  /** Путь к данным картинки строки */
  rowPictureDataPath?: AbstractDataPath;
  
  /** Картинка строк */
  rowsPicture?: Picture;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Сохранение цветов */
  saveColors?: SaveTableAppearance;
  
  /** Ключ сохранения цветов иконки */
  iconSaveColorsKey?: string;
  
  /** Ключ сохранения цветов формы */
  shapeSaveColorsKey?: string;
  
  /** Представление гиперссылок в ячейках */
  cellHyperlinksRepresentation?: CellHyperlinksRepresentation;
  
  /** Расположение строки поиска */
  searchStringLocation?: SearchStringLocation;
  
  /** Расположение статуса просмотра */
  viewStatusLocation?: ViewStatusLocation;
  
  /** Расположение управления поиском */
  searchControlLocation?: SearchControlLocation;
  
  /** Расположение панели иерархии */
  hierarchyPanelLocation?: HierarchyPanelLocation;
  
  /** Видимость панели иерархии */
  hierarchyPanelVisible?: boolean;
  
  /** Видимость панели вертикальной прокрутки */
  verticalScrollPanelVisible?: boolean;
  
  /** Метод запроса обновления */
  refreshRequest?: RefreshRequestMethod;
  
  /** Использование текущей строки */
  currentRowUse?: TableCurrentRowUse;
  
  /** Поведение при горизонтальном сжатии */
  behaviorOnHorizontalCompression?: TableBehaviorOnHorizontalCompression;
  
  /** Поведение карточки при вертикальном сжатии */
  cardBehaviorOnVerticalCompression?: CardBehaviorOnVerticalCompression;
  
  /** Авто максимальная высота карточки */
  autoMaxCardHeight?: boolean;
  
  /** Максимальная высота карточки */
  maxCardHeight?: number;
  
  /** Режим просмотра настроек */
  viewMode?: string;
  
  /** Комплексный режим просмотра настроек */
  complexSettingsViewMode?: string;
  
  /** Детальное представление именованного элемента настроек */
  settingsNamedItemDetailedRepresentation?: boolean;
  
  /** Фильтр строк */
  rowFilter?: any;
  
  /** Поведение при недоступности основного сервера */
  onMainServerUnavalableBehavior?: string;
  
  /** Тип таблицы для мобильных устройств */
  mobileDeviceTableType?: FormTableType;
  
  /** Высота строки */
  rowHeight?: number;
  
  /** Авто командная панель */
  autoCommandBar?: AutoCommandBar;
  
  /** Строка поиска */
  searchStringAddition?: SearchStringAdditionExtInfo;
  
  /** Статус просмотра */
  viewStatusAddition?: ViewStatusAdditionExtInfo;
  
  /** Элемент управления поиском */
  searchControlAddition?: SearchControlAdditionExtInfo;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
  
  /** Контекстное меню */
  contextMenu?: any;
  
  /** Расширенная информация */
  extInfo?: TableExtInfo;
  
  /** Показать командную панель (требует разыменования) */
  showCommandBarNeedDereferenced?: boolean;
}
