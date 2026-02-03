/**
 * UsualGroupExtInfo - расширенная информация для обычной группы
 * @see com._1c.g5.v8.dt.form.model.UsualGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { Color } from './Color';
import { AbstractDataPath } from './DataPath';
import { LocalizedString } from './LocalizedString';
import { ChildrenTitleLocation, CurrentRowUse, FormChildrenAlign, FormChildrenGroup, FormChildrenWidth, FormItemSpacing, ItemHorizontalAlignment, ItemVerticalAlignment, UsualGroupBehavior, UsualGroupControlRepresentation, UsualGroupRepresentation, UsualGroupThroughAlign } from './types';

export interface UsualGroupExtInfo extends GroupExtInfo {
  /** Группировка дочерних элементов */
  group?: FormChildrenGroup;
  
  /** Выравнивание дочерних элементов */
  childrenAlign?: FormChildrenAlign;
  
  /** Горизонтальный интервал */
  horizontalSpacing?: FormItemSpacing;
  
  /** Вертикальный интервал */
  verticalSpacing?: FormItemSpacing;
  
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание */
  verticalAlign?: ItemVerticalAlignment;
  
  /** Поведение группы */
  behavior?: UsualGroupBehavior;
  
  /** Расположение заголовков дочерних элементов */
  childItemsTitleLocation?: ChildrenTitleLocation;
  
  /** Прокрутка при сжатии */
  scrollOnCompress?: boolean;
  
  /** Заголовок свёрнутого представления */
  collapsedRepresentationTitle?: LocalizedString | LocalizedString[];
  
  /** Свёрнута ли группа */
  collapsed?: boolean;
  
  /** Представление элемента управления */
  controlRepresentation?: UsualGroupControlRepresentation;
  
  /** Представление группы */
  representation?: UsualGroupRepresentation;
  
  /** Показывать как карточку */
  showAsCard?: boolean;
  
  /** Гиперссылка */
  hyperlink?: boolean;
  
  /** Показывать левый отступ */
  showLeftMargin?: boolean;
  
  /** Объединённая группа */
  united?: boolean;
  
  /** Ширина подчинённых элементов */
  slaveItemsWidth?: FormChildrenWidth;
  
  /** Формат */
  format?: LocalizedString | LocalizedString[];
  
  /** Показывать заголовок */
  showTitle?: boolean;
  
  /** Путь к данным заголовка */
  titleDataPath?: AbstractDataPath;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Сквозное выравнивание */
  throughAlign?: UsualGroupThroughAlign;
  
  /** Цвет фона заголовка в скрытом состоянии */
  hiddenStateTitleBackColor?: Color;
  
  /** Использование текущей строки */
  currentRowUse?: CurrentRowUse;
}
