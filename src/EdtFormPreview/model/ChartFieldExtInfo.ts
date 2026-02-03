/**
 * ChartFieldExtInfo - расширенная информация для поля диаграммы
 * @see com._1c.g5.v8.dt.form.model.ChartFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';

export interface ChartFieldExtInfo extends FieldExtInfo {
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
}
