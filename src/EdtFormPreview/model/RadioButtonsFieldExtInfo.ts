/**
 * RadioButtonsFieldExtInfo - расширенная информация для поля переключателя
 * @see com._1c.g5.v8.dt.form.model.RadioButtonsFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { TumblerRepresentation } from './CheckBoxFieldExtInfo';
import { RadioButtonType } from './RadioButtonType';
import { FormChoiceListDesTimeValue } from './FormChoiceListDesTimeValue';

export type FormElementOrientation = 
  | 'Auto'
  | 'Vertical'
  | 'Horizontal';

export interface RadioButtonsFieldExtInfo extends FieldExtInfo {
  /** Тип переключателя */
  radioButtonsType?: RadioButtonType;
  
  /** Представление тумблера */
  tumblerRepresentation?: TumblerRepresentation;
  
  /** Ширина элемента */
  itemWidth?: number;
  
  /** Высота элемента */
  itemHeight?: number;
  
  /** Высота заголовка элемента */
  itemTitleHeight?: number;
  
  /** Количество колонок */
  columnsCount?: number;
  
  /** Равная ширина элементов */
  equalElementsWidth?: boolean;
  
  /** Список выбора */
  choiceList?: FormChoiceListDesTimeValue[];
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Шрифт */
  font?: Font;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Ориентация */
  orientation?: FormElementOrientation;
}
