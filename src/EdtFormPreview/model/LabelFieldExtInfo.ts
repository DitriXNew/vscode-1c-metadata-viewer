/**
 * LabelFieldExtInfo - расширенная информация для поля надписи
 * @see com._1c.g5.v8.dt.form.model.LabelFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { Border } from './Border';
import { LocalizedString } from './LocalizedString';

export interface LabelFieldExtInfo extends FieldExtInfo {
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
  
  /** Отмечать отрицательные */
  markNegatives?: boolean;
  
  /** Формат */
  format?: LocalizedString | LocalizedString[] | string;
  
  /** Гиперссылка */
  hyperlink?: boolean;
  
  /** Режим пароля */
  passwordMode?: boolean;
  
  /** Граница */
  border?: Border;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Использовать копирование */
  useCopy?: boolean;
}
