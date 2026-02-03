/**
 * UsualGroupExtInfo - расширенная информация для обычной группы
 * @see com._1c.g5.v8.dt.form.model.UsualGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './Color';
import { AbstractDataPath } from './DataPath';
import { LocalizedString } from './LocalizedString';
import { FormChildrenGroup } from './FormChildrenGroup';
import { FormChildrenAlign } from './FormChildrenAlign';
import { FormItemSpacing } from './FormItemSpacing';
import { ChildrenTitleLocation } from './ChildrenTitleLocation';
import { FormChildrenWidth } from './FormChildrenWidth';
import { CurrentRowUse } from './CurrentRowUse';

export type UsualGroupBehavior = 
  | 'Auto'
  | 'Usual'
  | 'Collapsible';

export type UsualGroupControlRepresentation = 
  | 'Auto'
  | 'Picture'
  | 'Text'
  | 'PictureAndText';

export type UsualGroupRepresentation = 
  | 'None'
  | 'WeakSeparation'
  | 'NormalSeparation'
  | 'StrongSeparation';

export type UsualGroupThroughAlign = 
  | 'Auto'
  | 'Use'
  | 'DontUse';

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
