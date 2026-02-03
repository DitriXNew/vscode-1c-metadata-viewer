/**
 * PageGroupExtInfo - расширенная информация для страницы (вкладки)
 * @see com._1c.g5.v8.dt.form.model.PageGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './TitleStyle';
import { AbstractDataPath } from './DataPath';
import { 
  FormChildrenGroup, 
  FormChildrenAlign, 
  FormItemSpacing, 
  FormChildrenWidth,
  ChildrenTitleLocation 
} from './UsualGroupExtInfo';
import { LocalizedString } from './Titled';

export interface Picture {
  picture?: string;
}

export interface PageGroupExtInfo extends GroupExtInfo {
  /** Картинка вкладки */
  picture?: Picture;
  
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
  
  /** Расположение заголовков дочерних элементов */
  childItemsTitleLocation?: ChildrenTitleLocation;
  
  /** Прокрутка при сжатии */
  scrollOnCompress?: boolean;
}
