/**
 * Table - таблица формы
 * @see com._1c.g5.v8.dt.form.model.Table
 * 
 * Наследует:
 * - DataItem
 * - FormItemContainer (items)
 * - TooltipContainer
 * - EventHandlerContainer
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
  
  /** Высота */
  height?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Режим выбора */
  selectionMode?: TableSelectionMode;
  
  /** Режим ввода строки */
  rowInputMode?: TableRowInputMode;
  
  /** Шапка */
  header?: boolean;
  
  /** Высота шапки */
  headerHeight?: number;
  
  /** Подвал */
  footer?: boolean;
  
  /** Высота подвала */
  footerHeight?: number;
  
  /** Горизонтальные линии */
  horizontalLines?: boolean;
  
  /** Вертикальные линии */
  verticalLines?: boolean;
  
  /** Использование полосы прокрутки */
  horizontalScrollBar?: TableScrollBarUse;
  
  /** Вертикальная полоса прокрутки */
  verticalScrollBar?: TableScrollBarUse;
  
  /** Поиск при вводе */
  searchOnInput?: SearchOnInput;
  
  /** Начальное представление дерева */
  initialTreeView?: TableInitialTreeView;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Высота строки */
  rowHeight?: number;
  
  /** Авто командная панель */
  autoCommandBar?: AutoCommandBar;
  
  /** Строка поиска */
  searchStringAddition?: SearchStringAddition;
  
  /** Статус просмотра */
  viewStatusAddition?: ViewStatusAddition;
  
  /** Элемент управления поиском */
  searchControlAddition?: SearchControlAddition;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
  
  /** Контекстное меню */
  contextMenu?: any;
  
  /** Расширенная информация */
  extInfo?: any;
}
