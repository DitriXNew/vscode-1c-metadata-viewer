/**
 * PageGroupExtInfo - расширенная информация для страницы (вкладки)
 * @see com._1c.g5.v8.dt.form.model.PageGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { Color } from './Color';
import { AbstractDataPath } from './DataPath';
import { LocalizedString } from './LocalizedString';
import { Picture } from './Picture';
import { ChildrenTitleLocation, FormChildrenAlign, FormChildrenGroup, FormChildrenWidth, FormItemSpacing, ItemHorizontalAlignment, ItemVerticalAlignment } from './types';

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
  
  /** Показывать заголовок (boolean для < 8.5.1, enum ShowTitle851 для >= 8.5.1) */
  showTitle?: boolean | string;
  
  /** Путь к данным заголовка */
  titleDataPath?: AbstractDataPath;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Расположение заголовков дочерних элементов */
  childItemsTitleLocation?: ChildrenTitleLocation;
  
  /** Прокрутка при сжатии (boolean для < 8.5.1, enum ScrollOnCompress851 для >= 8.5.1) */
  scrollOnCompress?: boolean | string;
}
