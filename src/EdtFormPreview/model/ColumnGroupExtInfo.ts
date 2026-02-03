/**
 * ColumnGroupExtInfo - расширенная информация для группы колонок
 * @see com._1c.g5.v8.dt.form.model.ColumnGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ItemHorizontalAlignment } from './ItemAlignment';
import { Color } from './Color';
import { AbstractDataPath } from './DataPath';
import { Picture } from './Picture';
import { LocalizedString } from './LocalizedString';

export type ColumnGrouping = 
  | 'Vertical'
  | 'InCell'
  | 'Horizontal';

export type FormFixedInTable = 
  | 'None'
  | 'Left'
  | 'Right';

export interface ColumnGroupExtInfo extends GroupExtInfo {
  /** Группировка колонок */
  group?: ColumnGrouping;
  
  /** Показывать заголовок */
  showTitle?: boolean;
  
  /** Цвет фона заголовка */
  titleBackColor?: Color;
  
  /** Показывать в шапке */
  showInHeader?: boolean;
  
  /** Путь к данным шапки */
  headerDataPath?: AbstractDataPath;
  
  /** Горизонтальное выравнивание шапки */
  headerHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Формат шапки */
  headerFormat?: LocalizedString | LocalizedString[];
  
  /** Картинка шапки */
  headerPicture?: Picture;
  
  /** Фиксация в таблице */
  fixingInTable?: FormFixedInTable;
  
  /** Показывать заголовок в карточке */
  showTitleInCard?: boolean;
  
  /** Показывать в карточке */
  showInCard?: boolean;
  
  /** Фиксировать в карточке */
  fixInCard?: boolean;
}
