/**
 * PeriodFieldExtInfo - расширенная информация для поля периода
 * @see com._1c.g5.v8.dt.form.model.PeriodFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { Border } from './Border';

export interface PeriodFieldExtInfo extends FieldExtInfo {
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
  
  /** Шрифт */
  font?: Font;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Граница */
  border?: Border;
}
