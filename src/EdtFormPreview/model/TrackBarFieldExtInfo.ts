/**
 * TrackBarFieldExtInfo - расширенная информация для поля полосы регулировки
 * @see com._1c.g5.v8.dt.form.model.TrackBarFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { FormElementOrientation, MarkingStyle } from './types';

export interface TrackBarFieldExtInfo extends FieldExtInfo {
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
  
  /** Минимальное значение */
  minValue?: number;
  
  /** Максимальное значение */
  maxValue?: number;
  
  /** Шаг */
  step?: number;
  
  /** Большой шаг */
  largeStep?: number;
  
  /** Шаг разметки */
  markingStep?: number;
  
  /** Ориентация */
  orientation?: FormElementOrientation;
  
  /** Внешний вид разметки */
  markingAppearance?: MarkingStyle;
  
  /** Цвет границы */
  borderColor?: Color;
}
