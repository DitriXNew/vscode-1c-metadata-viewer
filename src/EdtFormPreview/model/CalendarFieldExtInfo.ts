/**
 * CalendarFieldExtInfo - расширенная информация для поля календаря
 * @see com._1c.g5.v8.dt.form.model.CalendarFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { Border } from './Border';
import { FormDateSelectionMode } from './FormDateSelectionMode';

export interface CalendarFieldExtInfo extends FieldExtInfo {
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
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Режим выбора */
  selectionMode?: FormDateSelectionMode;
  
  /** Показывать текущую дату */
  showCurrentDate?: boolean;
  
  /** Навигация по календарю */
  calendarNavigation?: boolean;
  
  /** Начало периода представления */
  beginOfRepresentationPeriod?: string;
  
  /** Конец периода представления */
  endOfRepresentationPeriod?: string;
  
  /** Разрешить начало перетаскивания */
  enableStartDrag?: boolean;
  
  /** Разрешить перетаскивание */
  enableDrag?: boolean;
  
  /** Шрифт */
  font?: Font;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Граница */
  border?: Border;
  
  /** Показывать панель месяцев */
  showMonthsPanel?: boolean;
  
  /** Ширина в месяцах */
  widthInMonths?: number;
  
  /** Высота в месяцах */
  heightInMonths?: number;
}
