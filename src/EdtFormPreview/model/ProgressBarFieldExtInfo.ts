/**
 * ProgressBarFieldExtInfo - расширенная информация для поля индикатора прогресса
 * @see com._1c.g5.v8.dt.form.model.ProgressBarFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './TitleStyle';
import { FormElementOrientation } from './RadioButtonsFieldExtInfo';

export type FormProgressBarRepresentation = 
  | 'Auto'
  | 'Smooth'
  | 'Block';

export interface ProgressBarFieldExtInfo extends FieldExtInfo {
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
  
  /** Ориентация */
  orientation?: FormElementOrientation;
  
  /** Представление */
  representation?: FormProgressBarRepresentation;
  
  /** Показывать проценты */
  showPercent?: boolean;
  
  /** Цвет границы */
  borderColor?: Color;
}
