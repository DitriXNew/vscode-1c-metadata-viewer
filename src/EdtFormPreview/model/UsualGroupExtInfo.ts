/**
 * UsualGroupExtInfo - расширенная информация для обычной группы
 * @see com._1c.g5.v8.dt.form.model.UsualGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './TitleStyle';
import { AbstractDataPath } from './DataPath';
import { LocalizedString } from './Titled';

export type FormChildrenGroup = 
  | 'Vertical'
  | 'AlwaysHorizontal'
  | 'HorizontalIfPossible';

export type FormChildrenAlign = 
  | 'Auto'
  | 'Left'
  | 'Right';

export type FormItemSpacing = 
  | 'Auto'
  | 'None'
  | 'Half'
  | 'Single'
  | 'OneAndAHalf'
  | 'Double';

export type UsualGroupBehavior = 
  | 'Auto'
  | 'Usual'
  | 'Collapsible';

export type ChildrenTitleLocation = 
  | 'Auto'
  | 'Top'
  | 'Left';

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

export type FormChildrenWidth = 
  | 'Auto'
  | 'ByMaster'
  | 'Equal';

export type CurrentRowUse = 
  | 'Auto'
  | 'AsCurrentRow'
  | 'AsChosenRow';

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
